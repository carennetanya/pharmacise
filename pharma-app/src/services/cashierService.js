import { supabase } from '../lib/supabaseClient'

const INVENTORY_COLUMNS = 'id, pharmacy_id, name, batch, category, expiry_date, stock, unit, price'
const TRANSACTION_COLUMNS = 'id, pharmacy_id, patient_name, payment_method, subtotal, discount, tax, total, created_at, sale_items(*)'

export async function fetchCashierInventory(pharmacyId) {
  const { data, error } = await supabase
    .from('inventory_items')
    .select(INVENTORY_COLUMNS)
    .eq('pharmacy_id', pharmacyId)
    .order('name')

  if (error) throw error
  return data
}

export async function fetchCashierTransactions(pharmacyId, limit = 20) {
  const { data, error } = await supabase
    .from('sales_transactions')
    .select(TRANSACTION_COLUMNS)
    .eq('pharmacy_id', pharmacyId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function checkoutSale({ pharmacyId, items, paymentMethod, discount = 0, tax = 0, patientName = '' }) {
  if (!pharmacyId) throw new Error('Pharmacy ID is required.')
  if (!items?.length) throw new Error('Cart cannot be empty.')

  const { data, error } = await supabase.rpc('checkout_sale', {
    p_pharmacy_id: pharmacyId,
    p_items: items.map((item) => ({
      inventory_id: item.inventoryId,
      quantity: Number(item.quantity)
    })),
    p_payment_method: paymentMethod,
    p_discount: Number(discount) || 0,
    p_tax: Number(tax) || 0,
    p_patient_name: patientName.trim()
  })

  if (error) throw error
  return data
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}
