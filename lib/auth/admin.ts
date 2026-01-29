import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'scrum_master'
}

export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/admin/login')
  }

  // Check if user is in admin_users table and get their info
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, email, role')
    .eq('email', user.email)
    .single()

  if (!adminUser) {
    redirect('/admin/login?error=unauthorized')
  }

  return adminUser as AdminUser
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, email, role')
    .eq('email', user.email)
    .single()

  return adminUser as AdminUser | null
}

export async function getCurrentAdminId(): Promise<string | null> {
  const adminUser = await getAdminUser()
  return adminUser?.id || null
}

export async function isSuperAdmin(): Promise<boolean> {
  const adminUser = await getAdminUser()
  return adminUser?.role === 'super_admin'
}
