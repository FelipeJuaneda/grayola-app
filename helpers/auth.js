import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function getUserWithRole() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    ...user,
    full_name: profile.full_name,
    role: profile.role,
  }
}
