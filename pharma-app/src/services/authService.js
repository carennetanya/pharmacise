import { supabase } from '../lib/supabaseClient'
import { recordAuthActivity } from './activityLogService'

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  })

  if (error) {
    if (error.message?.toLowerCase().includes('invalid login credentials')) {
      throw new Error('Email atau password salah.')
    }
    throw error
  }

  try {
    const access = await getUserAccess(data.user)
    if (access.staff) {
      try {
        await recordAuthActivity('login')
      } catch {
        // Authentication must still work if the audit migration is not deployed yet.
      }
    }
    return access
  } catch (error) {
    await supabase.auth.signOut()
    throw error
  }
}

export async function getUserAccess(user) {
  if (!user) throw new Error('Sesi login tidak ditemukan.')

  const { data: pharmacies, error: pharmacyError } = await supabase
    .from('pharmacies')
    .select('id, name, owner_id')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (pharmacyError) throw pharmacyError
  const pharmacy = pharmacies?.[0]
  if (pharmacy) return { user, pharmacy, role: 'owner' }

  const { data: staffRows, error: staffError } = await supabase.rpc('get_my_staff_access')

  if (staffError) throw staffError
  const activeStaff = staffRows?.[0]
  if (!activeStaff) throw new Error('Akun belum memiliki akses ke apotek ini.')

  const staff = {
    id: activeStaff.staff_id,
    pharmacy_id: activeStaff.pharmacy_id,
    name: activeStaff.staff_name,
    email: activeStaff.staff_email,
    phone: activeStaff.staff_phone,
    role: activeStaff.staff_role,
    status: activeStaff.staff_status,
    auth_user_id: activeStaff.auth_user_id
  }
  const staffPharmacy = {
    id: activeStaff.pharmacy_id,
    name: activeStaff.pharmacy_name,
    owner_id: activeStaff.pharmacy_owner_id
  }

  return {
    user,
    pharmacy: staffPharmacy,
    staff,
    role: staff.role === 'Cashier' ? 'cashier' : 'pharmacy-technician'
  }
}

export async function signOut() {
  try {
    await recordAuthActivity('logout')
  } catch {
    // Logout must still complete if audit logging is temporarily unavailable.
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function updateOwnerProfile({ name, phone }) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: name.trim(),
      phone: phone?.trim() || ''
    }
  })

  if (error) throw error
  return data.user
}
