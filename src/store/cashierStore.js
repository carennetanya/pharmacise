import { reactive } from 'vue'

export const cashierStore = reactive({
  inventory: [
    { name: 'Paracetamol 500mg', batch: 'PC0421', price: 2500, expired: '12/2027', qty: 500, status: 'available' },
    { name: 'Amoxicillin 500mg', batch: 'AM0421', price: 12000, expired: '14/08/2026', qty: 42, status: 'low-stock' },
    { name: 'Vitamin C 1000mg', batch: 'VC0421', price: 18500, expired: '02/2027', qty: 300, status: 'available' },
    { name: 'Amlodipine 5mg', batch: 'AL0421', price: 8500, expired: '06/2027', qty: 500, status: 'available' },
    { name: 'Piroxicam 20mg', batch: 'PX0421', price: 15000, expired: '11/2027', qty: 500, status: 'available' },
    { name: 'Diclofenac sodium 50mg', batch: 'DF0421', price: 9500, expired: '06/2027', qty: 8, status: 'critical' }
  ],
  transactions: [
    { time: '14:32', items: 3, method: 'Cash', total: 125000 },
    { time: '14:15', items: 1, method: 'QRIS', total: 45000 },
    { time: '13:58', items: 5, method: 'Debit', total: 310000 },
    { time: '13:40', items: 2, method: 'Cash', total: 78000 },
    { time: '13:22', items: 4, method: 'QRIS', total: 156000 },
    { time: '13:05', items: 1, method: 'Cash', total: 32000 }
  ]
})

export function findMedicine(query) {
  const q = query.trim().toLowerCase()
  if (!q) return null
  return cashierStore.inventory.find(
    (med) => med.name.toLowerCase().includes(q) || med.batch.toLowerCase().includes(q)
  )
}

export function decrementStock(batch, qty) {
  const med = cashierStore.inventory.find((m) => m.batch === batch)
  if (!med) return
  med.qty = Math.max(0, med.qty - qty)
  if (med.qty <= 10) {
    med.status = 'critical'
  } else if (med.qty <= 60) {
    med.status = 'low-stock'
  } else {
    med.status = 'available'
  }
}

export function recordTransaction(entry) {
  cashierStore.transactions.unshift(entry)
}
