import { supabase } from '../lib/supabaseClient'

export async function recordAuthActivity(action) {
  const { error } = await supabase.rpc('record_auth_activity', { p_action: action })
  if (error) throw error
}

export async function fetchAuthActivityLogs(limit = 100) {
  const { data, error } = await supabase.rpc('get_auth_activity_logs', { p_limit: limit })
  if (error) throw error
  return data || []
}
