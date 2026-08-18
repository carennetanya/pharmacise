import { reactive } from 'vue'

let idCounter = 1000
function nextId() {
  idCounter += 1
  return idCounter
}

export const ownerStore = reactive({
  inventory: [
    { id: nextId(), name: 'Paracetamol 500mg', batch: 'PC0421', category: 'Analgesik', expired: '12/2027', stock: 500, unit: 'Strip', price: 2500, status: 'available' },
    { id: nextId(), name: 'Amoxicillin 500mg', batch: 'AM0421', category: 'Antibiotik', expired: '14/08/2026', stock: 100, unit: 'Strip', price: 12000, status: 'critical' },
    { id: nextId(), name: 'Amlodipine 5mg', batch: 'AL0421', category: 'Kardiovaskular', expired: '06/2027', stock: 500, unit: 'Strip', price: 8500, status: 'available' },
    { id: nextId(), name: 'Vitamin C 1000mg', batch: 'VC0421', category: 'Vitamin', expired: '02/2027', stock: 300, unit: 'Botol', price: 18500, status: 'low-stock' },
    { id: nextId(), name: 'Piroxicam 20mg', batch: 'PX0421', category: 'Analgesik', expired: '11/2027', stock: 500, unit: 'Strip', price: 15000, status: 'available' },
    { id: nextId(), name: 'Diclofenac sodium 50mg', batch: 'DF0421', category: 'Analgesik', expired: '06/2027', stock: 500, unit: 'Strip', price: 9500, status: 'available' },
    { id: nextId(), name: 'Diclofenac sodium 50mg', batch: 'DF0422', category: 'Analgesik', expired: '06/2027', stock: 500, unit: 'Strip', price: 9500, status: 'available' }
  ],

  orders: [
    {
      id: nextId(),
      ref: '#PO-2026-089',
      distributor: 'PT Kimia Farma Trading',
      orderDate: '28 Jul 2026',
      eta: '30 Jul 2026',
      etaBold: false,
      total: 'Rp 12.450.000',
      status: 'awaiting',
      actionLabel: 'Approve & Send PO',
      items: [
        { name: 'Paracetamol 500mg', qty: 200, price: 2500 },
        { name: 'Amoxicillin 500mg', qty: 150, price: 12000 }
      ]
    },
    {
      id: nextId(),
      ref: '#PO-2026-085',
      distributor: 'PT Anugrah Argon Medica',
      orderDate: '26 Jul 2026',
      eta: 'Hari Ini (28 Jul)',
      etaBold: true,
      total: 'Rp 8.120.000',
      status: 'transit',
      actionLabel: 'Scan Faktur / Terima',
      items: [
        { name: 'Amlodipine 5mg', qty: 300, price: 8500 },
        { name: 'Vitamin C 1000mg', qty: 100, price: 18500 }
      ]
    },
    {
      id: nextId(),
      ref: '#PO-2026-081',
      distributor: 'PT Mensa Bina Sukses',
      orderDate: '22 Jul 2026',
      eta: '24 Jul 2026',
      etaBold: false,
      total: 'Rp 15.300.000',
      status: 'completed',
      actionLabel: 'Lihat Detail & Invoice',
      items: [
        { name: 'Piroxicam 20mg', qty: 400, price: 15000 },
        { name: 'Diclofenac sodium 50mg', qty: 500, price: 9500 }
      ]
    }
  ],

  suppliers: [
    { id: nextId(), name: 'PT Kimia Farma Trading', contact: 'Hendra Saputra', phone: '+62 21-5550-1122', email: 'hendra@kimiafarma.co.id', products: '128 SKU', status: 'Active' },
    { id: nextId(), name: 'PT Anugrah Argon Medica', contact: 'Lestari Wulandari', phone: '+62 21-5550-3344', email: 'lestari@argonmedica.co.id', products: '94 SKU', status: 'Active' },
    { id: nextId(), name: 'PT Mensa Bina Sukses', contact: 'Yusuf Prasetyo', phone: '+62 21-5550-5566', email: 'yusuf@mensabina.co.id', products: '76 SKU', status: 'Active' },
    { id: nextId(), name: 'PT Sumber Alam Farma', contact: 'Ratna Dewi', phone: '+62 21-5550-7788', email: 'ratna@sumberalam.co.id', products: '42 SKU', status: 'Active' }
  ],

  staff: [
    { id: nextId(), name: 'Dr. Aris', email: 'aris@pharmacise.id', phone: '0812-3456-7890', role: 'Owner', status: 'active' },
    { id: nextId(), name: 'Andi Wijaya', email: 'andi@pharmacise.id', phone: '0813-1122-3344', role: 'Cashier', status: 'active' },
    { id: nextId(), name: 'Siti Rahma', email: 'siti@pharmacise.id', phone: '0813-5566-7788', role: 'Staff', status: 'active' },
    { id: nextId(), name: 'Budi Hartono', email: 'budi@pharmacise.id', phone: '0812-9900-1122', role: 'Cashier', status: 'inactive' }
  ],

  activityLog: []
})

function computeStatus(stock) {
  if (stock <= 20) return 'critical'
  if (stock <= 150) return 'low-stock'
  return 'available'
}

export function logActivity(text) {
  ownerStore.activityLog.unshift({ id: nextId(), text, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) })
}

/* Inventory */
export function addInventoryItem(item) {
  const stock = Number(item.stock) || 0
  const entry = {
    id: nextId(),
    name: item.name,
    batch: item.batch,
    category: item.category || 'Umum',
    expired: item.expired,
    stock,
    unit: item.unit || 'Strip',
    price: Number(item.price) || 0,
    status: item.status || computeStatus(stock)
  }
  ownerStore.inventory.unshift(entry)
  logActivity(`Menambahkan item inventory baru: ${entry.name}`)
  return entry
}

export function updateInventoryItem(id, changes) {
  const item = ownerStore.inventory.find((i) => i.id === id)
  if (!item) return
  Object.assign(item, changes)
  if (changes.stock !== undefined && !changes.status) {
    item.status = computeStatus(Number(item.stock) || 0)
  }
  logActivity(`Memperbarui item inventory: ${item.name}`)
}

export function deleteInventoryItem(id) {
  const item = ownerStore.inventory.find((i) => i.id === id)
  ownerStore.inventory = ownerStore.inventory.filter((i) => i.id !== id)
  if (item) logActivity(`Menghapus item inventory: ${item.name}`)
}

export function importInventoryRows(rows) {
  rows.forEach((row) => addInventoryItem(row))
  logActivity(`Mengimpor ${rows.length} item inventory melalui CSV`)
}

export function applyInvoiceReceipt(rows, meta) {
  rows.forEach((row) => {
    const existing = ownerStore.inventory.find((i) => i.batch === row.batch)
    if (existing) {
      existing.stock += Number(row.qty) || 0
      existing.status = computeStatus(existing.stock)
    } else {
      addInventoryItem({
        name: row.name,
        batch: row.batch,
        category: row.category || 'Umum',
        expired: row.expired || '-',
        stock: Number(row.qty) || 0,
        unit: row.unit || 'Strip',
        price: Number(row.price) || 0
      })
    }
  })
  logActivity(`Menerima barang dari faktur ${meta?.invoiceNo || ''} (${rows.length} item)`)
}

/* Suppliers */
export function addSupplier(supplier) {
  const entry = { id: nextId(), status: 'Active', ...supplier }
  ownerStore.suppliers.unshift(entry)
  logActivity(`Menambahkan supplier baru: ${entry.name}`)
  return entry
}

export function updateSupplier(id, changes) {
  const supplier = ownerStore.suppliers.find((s) => s.id === id)
  if (!supplier) return
  Object.assign(supplier, changes)
  logActivity(`Memperbarui data supplier: ${supplier.name}`)
}

export function deleteSupplier(id) {
  const supplier = ownerStore.suppliers.find((s) => s.id === id)
  ownerStore.suppliers = ownerStore.suppliers.filter((s) => s.id !== id)
  if (supplier) logActivity(`Menghapus supplier: ${supplier.name}`)
}

/* Orders */
export function addOrder(order) {
  const entry = {
    id: nextId(),
    ref: `#PO-2026-${String(Math.floor(90 + Math.random() * 900))}`,
    orderDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    etaBold: false,
    status: 'awaiting',
    actionLabel: 'Approve & Send PO',
    ...order
  }
  ownerStore.orders.unshift(entry)
  logActivity(`Membuat pesanan baru ke ${entry.distributor}`)
  return entry
}

export function importOrderRows(distributor, rows) {
  const total = rows.reduce((sum, r) => sum + (Number(r.qty) || 0) * (Number(r.price) || 0), 0)
  return addOrder({
    distributor,
    eta: '-',
    total: `Rp ${total.toLocaleString('id-ID')}`,
    items: rows.map((r) => ({ name: r.name, qty: Number(r.qty) || 0, price: Number(r.price) || 0 }))
  })
}

export function updateOrderStatus(id, status, actionLabel) {
  const order = ownerStore.orders.find((o) => o.id === id)
  if (!order) return
  order.status = status
  if (actionLabel) order.actionLabel = actionLabel
  logActivity(`Memperbarui status pesanan ${order.ref} menjadi ${status}`)
}

/* Staff */
export function addStaffMember(member) {
  const entry = { id: nextId(), status: 'active', ...member }
  ownerStore.staff.unshift(entry)
  logActivity(`Menambahkan staf baru: ${entry.name}`)
  return entry
}

export function updateStaffMember(id, changes) {
  const member = ownerStore.staff.find((m) => m.id === id)
  if (!member) return
  Object.assign(member, changes)
  logActivity(`Memperbarui data staf: ${member.name}`)
}

export function removeStaffAccess(id) {
  const member = ownerStore.staff.find((m) => m.id === id)
  if (!member) return
  ownerStore.staff = ownerStore.staff.filter((m) => m.id !== id)
  logActivity(`Mencabut akses staf: ${member.name}`)
}
