import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.env.OWNER_EMAIL
const password = process.env.OWNER_PASSWORD
const pharmacyEmail = process.env.PHARMACY_EMAIL || ''

if (!supabaseUrl || !serviceRoleKey || !email || !password) {
  throw new Error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OWNER_EMAIL, and OWNER_PASSWORD before running this script.')
}

if (serviceRoleKey.startsWith('sb_publishable_') || serviceRoleKey.startsWith('eyJ')) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is the publishable/anon key. Copy the secret key from Supabase Project Settings > API instead.')
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const { data: users, error: listError } = await admin.auth.admin.listUsers()
if (listError) throw listError

let owner = users.users.find((user) => user.email?.toLowerCase() === email)

if (!owner) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Pharmacise Owner', role: 'owner' }
  })
  if (error) throw error
  owner = data.user
} else {
  const { data, error } = await admin.auth.admin.updateUserById(owner.id, {
    password,
    email_confirm: true,
    user_metadata: { ...owner.user_metadata, full_name: 'Pharmacise Owner', role: 'owner' }
  })
  if (error) throw error
  owner = data.user
}

const { error: pharmacyError } = await admin
  .from('pharmacies')
  .upsert({
    owner_id: owner.id,
    name: 'Apotek Pharmacise',
    email: pharmacyEmail
  }, { onConflict: 'owner_id' })

if (pharmacyError) throw pharmacyError

console.log(`Owner account is ready: ${email}`)
