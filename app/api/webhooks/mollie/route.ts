import { NextRequest, NextResponse } from 'next/server'
import { getMollieClient } from '@/lib/mollie/client'
import { SequenceType } from '@mollie/api-client'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const paymentId = formData.get('id') as string

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 })
    }

    // Fetch payment from Mollie API (this verifies authenticity)
    const payment = await getMollieClient().payments.get(paymentId)
    const metadata = typeof payment.metadata === 'string'
      ? JSON.parse(payment.metadata)
      : (payment.metadata as Record<string, unknown> | null)
    const teamId = metadata?.teamId as string | undefined

    if (!teamId) {
      console.error('[mollie-webhook] No teamId in payment metadata', paymentId)
      return NextResponse.json({ error: 'Missing teamId' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Upsert payment record
    await supabase.from('payments').upsert(
      {
        team_id: teamId,
        mollie_payment_id: payment.id,
        amount_value: payment.amount.value,
        amount_currency: payment.amount.currency,
        status: payment.status,
        description: payment.description ?? null,
        paid_at: payment.paidAt ?? null,
        sequence_type: payment.sequenceType ?? null,
      },
      { onConflict: 'mollie_payment_id' }
    )

    if (payment.status === 'paid') {
      if (payment.sequenceType === SequenceType.first) {
        // First payment successful → mandate created → create subscription
        const customerId = payment.customerId as string

        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
        const subscription = await getMollieClient().customerSubscriptions.create({
          customerId,
          amount: { currency: 'EUR', value: '19.00' },
          interval: '1 month',
          description: 'Pulse Labs Pro',
          webhookUrl: `${baseUrl}/api/webhooks/mollie`,
          metadata: JSON.stringify({ teamId }),
        })

        await supabase
          .from('teams')
          .update({
            plan: 'pro',
            billing_status: 'active',
            mollie_subscription_id: subscription.id,
            billing_period_end: subscription.nextPaymentDate ?? null,
          })
          .eq('id', teamId)

      } else if (payment.sequenceType === SequenceType.recurring) {
        // Recurring payment successful → update period end
        const { data: team } = await supabase
          .from('teams')
          .select('mollie_customer_id, mollie_subscription_id')
          .eq('id', teamId)
          .single()

        if (team?.mollie_customer_id && team?.mollie_subscription_id) {
          const sub = await getMollieClient().customerSubscriptions.get(
            team.mollie_subscription_id,
            { customerId: team.mollie_customer_id }
          )
          await supabase
            .from('teams')
            .update({
              billing_status: 'active',
              billing_period_end: sub.nextPaymentDate ?? null,
            })
            .eq('id', teamId)
        }
      }
    } else if (payment.status === 'failed' || payment.status === 'expired') {
      if (payment.sequenceType === SequenceType.first) {
        // First payment failed → revert
        await supabase
          .from('teams')
          .update({ billing_status: 'none' })
          .eq('id', teamId)
      } else {
        // Recurring payment failed
        await supabase
          .from('teams')
          .update({ billing_status: 'past_due' })
          .eq('id', teamId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[mollie-webhook] Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
