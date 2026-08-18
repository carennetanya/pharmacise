import { supabase } from '../lib/supabaseClient'

const LOGO_BUCKET = 'pharmacy-logos'

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data?.user) throw new Error('Anda harus login untuk mengelola pengaturan apotek.')
  return data.user.id
}

/**
 * Loads the pharmacy profile owned by the current user.
 * Returns null if the owner hasn't created one yet.
 */
export async function fetchMyPharmacy() {
  const userId = await getCurrentUserId()
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .eq('owner_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Creates the pharmacy row on first save, updates it afterwards.
 * `pharmacy` uses the same shape as the form in Settings.vue.
 */
export async function savePharmacyInfo(pharmacy) {
  const userId = await getCurrentUserId()

  const payload = {
    owner_id: userId,
    name: pharmacy.name?.trim() || '',
    phone: pharmacy.phone?.trim() || '',
    license_number: pharmacy.license?.trim() || '',
    email: pharmacy.email?.trim() || '',
    address: pharmacy.address?.trim() || '',
    logo_url: pharmacy.logo_url || null
  }

  const { data, error } = await supabase
    .from('pharmacies')
    .upsert(payload, { onConflict: 'owner_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Uploads a logo file to Storage and returns its public URL.
 * Does NOT save it onto the pharmacy row — call savePharmacyInfo after.
 */
export async function uploadPharmacyLogo(file) {
  const userId = await getCurrentUserId()
  const ext = file.name.split('.').pop() || 'png'
  const path = `${userId}/logo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Lists staff/cashier accounts for a pharmacy, newest last.
 */
export async function fetchStaff(pharmacyId) {
  const { data, error } = await supabase
    .from('pharmacy_staff')
    .select('id, name, email, phone, role, status, created_at')
    .eq('pharmacy_id', pharmacyId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Creates a staff/cashier account. PIN is hashed server-side via RPC —
 * it is never stored or transmitted as plaintext after this call.
 */
export async function addStaffMember({ pharmacyId, name, email, phone, role, pin }) {
  const { data, error } = await supabase.rpc('add_pharmacy_staff', {
    p_pharmacy_id: pharmacyId,
    p_name: name.trim(),
    p_email: email.trim(),
    p_phone: phone?.trim() || '',
    p_role: role,
    p_pin: pin
  })

  if (error) throw error
  return data
}

/**
 * Updates the non-sensitive fields of a staff/cashier account.
 */
export async function updateStaffMember(staffId, { name, email, phone, role }) {
  const { data, error } = await supabase
    .from('pharmacy_staff')
    .update({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      role
    })
    .eq('id', staffId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Changes a staff member's POS PIN. Hashing happens server-side via RPC.
 */
export async function setStaffPin(staffId, pin) {
  const { error } = await supabase.rpc('set_staff_pin', {
    p_staff_id: staffId,
    p_pin: pin
  })
  if (error) throw error
}

/**
 * Revokes a staff/cashier account entirely (matches the "Hapus Akses" UI).
 */
export async function removeStaffAccess(staffId) {
  const { error } = await supabase.from('pharmacy_staff').delete().eq('id', staffId)
  if (error) throw error
}