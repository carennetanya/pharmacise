// This file runs in the Supabase Deno runtime, not the Vite/Node runtime.
// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const authorization = request.headers.get('Authorization')

  if (!supabaseUrl || !serviceRoleKey || !authorization) {
    return json({ error: 'Missing server configuration or authorization' }, 401)
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  const accessToken = authorization.replace(/^Bearer\s+/i, '')
  const { data: userData, error: userError } = await admin.auth.getUser(accessToken)

  if (userError || !userData.user) return json({ error: 'Unauthorized' }, 401)

  let payload: {
    pharmacyId?: string
    name?: string
    email?: string
    phone?: string
    role?: 'Staff' | 'Cashier'
    password?: string
  }

  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  const role = payload.role
  const password = payload.password

  if (!payload.pharmacyId || !name || !email || !password || !['Staff', 'Cashier'].includes(role || '')) {
    return json({ error: 'pharmacyId, name, email, role, and password are required' }, 400)
  }
  if (password.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400)

  const { data: pharmacy, error: pharmacyError } = await admin
    .from('pharmacies')
    .select('id')
    .eq('id', payload.pharmacyId)
    .eq('owner_id', userData.user.id)
    .maybeSingle()

  if (pharmacyError) return json({ error: pharmacyError.message }, 500)
  if (!pharmacy) return json({ error: 'Only the pharmacy owner can create staff accounts' }, 403)

  const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role }
  })

  if (createUserError || !createdUser.user) {
    return json({ error: createUserError?.message || 'Unable to create Auth user' }, 400)
  }

  const { data: staff, error: staffError } = await admin
    .from('pharmacy_staff')
    .insert({
      pharmacy_id: pharmacy.id,
      name,
      email,
      phone: payload.phone?.trim() || '',
      role,
      status: 'active',
      auth_user_id: createdUser.user.id
    })
    .select('id, pharmacy_id, name, email, phone, role, status, auth_user_id, created_at')
    .single()

  if (staffError) {
    await admin.auth.admin.deleteUser(createdUser.user.id)
    return json({ error: staffError.message }, 400)
  }

  return json({ staff })
})
