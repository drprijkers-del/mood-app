'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { getMollieClient } from '@/lib/mollie/client'
import { SequenceType } from '@mollie/api-client'
import { revalidatePath } from 'next/cache'

// --- Types ---

export interface BillingInfo {
  plan: 'free' | 'pro'
  billingStatus: string
  billingPeriodEnd: string | null
  recentPayments: {
    id: string
    amount: string
    status: string
    paidAt: string | null
    createdAt: string
  }[]
}

// --- Helper: isTeamPro ---

export async function isTeamPro(teamId: string): Promise<boolean> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('teams')
    .select('plan, billing_status, billing_period_end')
    .eq('id', teamId)
    .single()

  if (!data) return false
  if (data.plan !== 'pro') return false

  // If cancelled but period hasn't ended yet, still pro
  if (data.billing_status === 'cancelled' && data.billing_period_end) {
    return new Date(data.billing_period_end) > new Date()
  }

  return data.billing_status === 'active'
}

// --- Get billing info ---

export async function getBillingInfo(teamId: string): Promise<BillingInfo | null> {
  const adminUser = await requireAdmin()
  const supabase = await createAdminClient()

  const { data: team } = await supabase
    .from('teams')
    .select('id, owner_id, plan, billing_status, billing_period_end')
    .eq('id', teamId)
    .single()

  if (!team) return null
  if (team.owner_id !== adminUser.id && adminUser.role !== 'super_admin') {
    return null
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('id, amount_value, status, paid_at, created_at')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    plan: team.plan as 'free' | 'pro',
    billingStatus: team.billing_status as string,
    billingPeriodEnd: team.billing_period_end ?? null,
    recentPayments: (payments || []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      amount: p.amount_value as string,
      status: p.status as string,
      paidAt: (p.paid_at as string) ?? null,
      createdAt: p.created_at as string,
    })),
  }
}

// --- Start subscription flow ---

export async function startSubscription(teamId: string): Promise<{
  success: boolean
  checkoutUrl?: string
  error?: string
}> {
  const adminUser = await requireAdmin()
  const supabase = await createAdminClient()

  const { data: team } = await supabase
    .from('teams')
    .select('id, name, owner_id, mollie_customer_id, plan')
    .eq('id', teamId)
    .single()

  if (!team) return { success: false, error: 'Team not found' }
  if (team.owner_id !== adminUser.id && adminUser.role !== 'super_admin') {
    return { success: false, error: 'Access denied' }
  }
  if (team.plan === 'pro') {
    return { success: false, error: 'Team already on Pro plan' }
  }

  try {
    // Step 1: Create or reuse Mollie customer
    let mollieCustomerId = team.mollie_customer_id as string | null
    if (!mollieCustomerId) {
      const customer = await getMollieClient().customers.create({
        name: team.name as string,
        email: adminUser.email,
        metadata: JSON.stringify({ teamId, adminUserId: adminUser.id }),
      })
      mollieCustomerId = customer.id

      await supabase
        .from('teams')
        .update({ mollie_customer_id: mollieCustomerId })
        .eq('id', teamId)
    }

    // Step 2: Create first payment with sequenceType 'first' to establish mandate
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
    const payment = await getMollieClient().payments.create({
      amount: { currency: 'EUR', value: '19.00' },
      customerId: mollieCustomerId,
      sequenceType: SequenceType.first,
      description: `Pulse Labs Pro - ${team.name}`,
      redirectUrl: `${baseUrl}/teams/${teamId}?tab=billing&status=pending`,
      ...(!isLocalhost && { webhookUrl: `${baseUrl}/api/webhooks/mollie` }),
      metadata: JSON.stringify({ teamId, type: 'first_payment' }),
    })

    // Update billing status
    await supabase
      .from('teams')
      .update({ billing_status: 'pending_mandate' })
      .eq('id', teamId)

    // Log the payment
    await supabase.from('payments').insert({
      team_id: teamId,
      mollie_payment_id: payment.id,
      amount_value: '19.00',
      amount_currency: 'EUR',
      status: payment.status,
      description: payment.description,
      sequence_type: 'first',
    })

    revalidatePath(`/teams/${teamId}`)

    const checkoutUrl = payment.getCheckoutUrl()
    return {
      success: true,
      checkoutUrl: checkoutUrl ?? undefined,
    }
  } catch (error) {
    console.error('startSubscription error:', error)
    return { success: false, error: 'Failed to create checkout' }
  }
}

// --- Cancel subscription ---

export async function cancelSubscription(teamId: string): Promise<{
  success: boolean
  error?: string
}> {
  const adminUser = await requireAdmin()
  const supabase = await createAdminClient()

  const { data: team } = await supabase
    .from('teams')
    .select('id, owner_id, mollie_customer_id, mollie_subscription_id, billing_status')
    .eq('id', teamId)
    .single()

  if (!team) return { success: false, error: 'Team not found' }
  if (team.owner_id !== adminUser.id && adminUser.role !== 'super_admin') {
    return { success: false, error: 'Access denied' }
  }
  if (!team.mollie_subscription_id || !team.mollie_customer_id) {
    return { success: false, error: 'No active subscription' }
  }

  try {
    // Cancel in Mollie
    await getMollieClient().customerSubscriptions.cancel(
      team.mollie_subscription_id as string,
      { customerId: team.mollie_customer_id as string }
    )

    // Keep plan as 'pro' until billing_period_end
    await supabase
      .from('teams')
      .update({
        billing_status: 'cancelled',
        mollie_subscription_id: null,
      })
      .eq('id', teamId)

    revalidatePath(`/teams/${teamId}`)
    return { success: true }
  } catch (error) {
    console.error('cancelSubscription error:', error)
    return { success: false, error: 'Failed to cancel subscription' }
  }
}
