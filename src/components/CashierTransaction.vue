<template>
  <div class="dashboard-page">
    <header class="topbar">
      <div class="brand">
        <img src="/logo.png" alt="Pharmacise logo" class="brand-logo" />
        <span>PHARMACISE</span>
      </div>

      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="#9CA8A3" stroke-width="1.8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#9CA8A3" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input type="text" placeholder="Search Medicines, Batch No." />
      </div>

      <div class="topbar-right">
        <button class="icon-btn" aria-label="More options">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="12" r="1.8" fill="#334" />
            <circle cx="12" cy="12" r="1.8" fill="#334" />
            <circle cx="19" cy="12" r="1.8" fill="#334" />
          </svg>
        </button>

        <button class="icon-btn bell" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C9.5 3 7.5 5 7.5 7.5V11C7.5 12 7.1 12.9 6.4 13.6L5 15H19L17.6 13.6C16.9 12.9 16.5 12 16.5 11V7.5C16.5 5 14.5 3 12 3Z" stroke="#334" stroke-width="1.6" stroke-linejoin="round" />
            <path d="M10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18" stroke="#334" stroke-width="1.6" />
          </svg>
          <span class="badge">3</span>
        </button>

        <div class="profile">
          <div class="avatar">A</div>
          <div class="profile-text">
            <span class="role">Cashier on Duty</span>
            <span class="name">Andi Wijaya</span>
          </div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="#334" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </header>

    <div class="body">
      <aside class="sidebar">
        <nav class="nav-list">
          <button
            v-for="item in navItems"
            :key="item.id"
            class="nav-item"
            :class="{ active: activeNav === item.id }"
            @click="goTo(item.id)"
          >
            <component :is="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </aside>

      <main class="main-content">
        <div class="tx-columns">
          <div class="tx-left-col">
            <div class="card">
              <h2>Scan / Input Resep</h2>
              <p class="card-sub">Gunakan kamera untuk scan barcode/QR resep, atau masukkan kode resep secara manual.</p>

              <div class="scan-tabs">
                <button class="scan-tab" :class="{ active: scanTab === 'scan' }" @click="scanTab = 'scan'">Scan Barcode / QR</button>
                <button class="scan-tab" :class="{ active: scanTab === 'manual' }" @click="scanTab = 'manual'">Input Manual</button>
              </div>

              <div v-if="scanTab === 'scan'" class="scan-box">
                <div class="scan-icon">▣</div>
                <p class="scan-title">Arahkan kamera ke barcode resep</p>
                <p class="scan-hint">Mendukung barcode obat &amp; QR resep digital</p>
              </div>

              <div class="manual-row">
                <input
                  v-model="manualQuery"
                  type="text"
                  placeholder="Ketik kode resep / nama obat..."
                  @keyup.enter="addFromCatalog"
                />
                <button class="add-btn" @click="addFromCatalog">+ Tambah</button>
              </div>
              <p v-if="notFound" class="not-found">{{ notFoundReason }}</p>
            </div>

            <div class="card">
              <h2>Item Transaksi</h2>
              <p class="card-sub">{{ cart.length }} item ditambahkan dari resep</p>

              <table class="cart-table">
                <thead>
                  <tr>
                    <th>Obat</th>
                    <th>Batch</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cart" :key="item.batch">
                    <td class="name">{{ item.name }}</td>
                    <td class="muted">{{ item.batch }}</td>
                    <td>
                      <div class="qty-control">
                        <button @click="decrement(item)">−</button>
                        <span>{{ item.qty }}</span>
                        <button @click="increment(item)">+</button>
                      </div>
                    </td>
                    <td class="muted">{{ formatCurrency(item.price) }}</td>
                    <td>
                      <span class="stock-label" :class="item.stock">{{ item.stock === 'low' ? 'Stok Menipis' : 'Tersedia' }}</span>
                    </td>
                    <td class="subtotal">{{ formatCurrency(item.price * item.qty) }}</td>
                    <td>
                      <button class="remove-btn" @click="removeItem(item)">Hapus</button>
                    </td>
                  </tr>
                  <tr v-if="cart.length === 0">
                    <td colspan="7" class="empty-cart">Belum ada item dalam transaksi ini.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="tx-right-col">
            <div class="card summary-card">
              <h2>Ringkasan Pembayaran</h2>
              <p class="card-sub">Data pasien opsional, untuk keperluan struk</p>

              <label class="field-label">Nama Pasien (opsional)</label>
              <input v-model="patientName" type="text" class="field-input" placeholder="Cth: Budi Santoso" />

              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="summary-row">
                <span>Diskon</span>
                <span>{{ formatCurrency(discount) }}</span>
              </div>
              <div class="summary-row">
                <span>Pajak (PPN 11%)</span>
                <span>{{ formatCurrency(tax) }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>Total Bayar</span>
                <span>{{ formatCurrency(total) }}</span>
              </div>

              <p class="field-label">Metode Pembayaran</p>
              <div class="payment-methods">
                <button
                  v-for="method in paymentMethods"
                  :key="method"
                  class="payment-btn"
                  :class="{ active: paymentMethod === method }"
                  @click="paymentMethod = method"
                >
                  {{ method }}
                </button>
              </div>

              <button class="pay-btn" :disabled="cart.length === 0" @click="completeTransaction">🖨️ Bayar &amp; Cetak Struk</button>
              <button class="draft-btn" @click="saveDraft">Simpan sebagai Draft</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showReceipt" class="modal-overlay">
      <div class="receipt-modal">
        <div class="receipt-check">✓</div>
        <h2>Transaksi Berhasil</h2>
        <p class="receipt-sub">{{ receipt.datetime }}</p>

        <div class="receipt-divider"></div>

        <div class="receipt-items">
          <div v-for="(item, i) in receipt.items" :key="i" class="receipt-row">
            <span>{{ item.name }} x{{ item.qty }}</span>
            <span>{{ formatCurrency(item.price * item.qty) }}</span>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-row">
          <span>Subtotal</span>
          <span>{{ formatCurrency(receipt.subtotal) }}</span>
        </div>
        <div class="receipt-row">
          <span>Pajak</span>
          <span>{{ formatCurrency(receipt.tax) }}</span>
        </div>
        <div class="receipt-row total">
          <span>Total Bayar</span>
          <span>{{ formatCurrency(receipt.total) }}</span>
        </div>

        <p class="receipt-method">Dibayar via {{ receipt.method }}</p>

        <div class="receipt-actions">
          <button class="print-btn" @click="printReceipt">🖨️ Cetak Struk</button>
          <button class="done-btn" @click="closeReceipt">Selesai</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { cashierStore, findMedicine, decrementStock, recordTransaction } from '../store/cashierStore'

const emit = defineEmits(['navigate'])

const activeNav = ref('transaksi')

function goTo(id) {
  activeNav.value = id
  emit('navigate', id)
}

function icon(paths) {
  return () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
      paths.map((p) => h('path', p))
    )
}

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: icon([{ d: 'M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linejoin': 'round' }])
  },
  {
    id: 'transaksi',
    label: 'Transaksi',
    icon: icon([{ d: 'M6 3H14L18 7V21H6V3Z', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linejoin': 'round' }])
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: icon([{ d: 'M4 7L12 3L20 7V17L12 21L4 17V7Z', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linejoin': 'round' }])
  }
]

const cart = ref([
  { name: 'Paracetamol 500mg', batch: 'PC0421', price: 2500, stock: 'available', qty: 2 },
  { name: 'Amoxicillin 500mg', batch: 'AM0421', price: 12000, stock: 'low', qty: 1 },
  { name: 'Vitamin C 1000mg', batch: 'VC0421', price: 18500, stock: 'available', qty: 1 }
])

const scanTab = ref('scan')
const manualQuery = ref('')
const notFound = ref(false)
const notFoundReason = ref('')
const patientName = ref('')
const discount = ref(0)
const paymentMethods = ['Tunai', 'Debit/QRIS', 'Kartu']
const paymentMethod = ref('Tunai')
const showReceipt = ref(false)
const receipt = ref(null)

const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.qty, 0))
const tax = computed(() => Math.round((subtotal.value - discount.value) * 0.11))
const total = computed(() => subtotal.value - discount.value + tax.value)

function stockLabel(status) {
  return status === 'available' ? 'available' : 'low'
}

function addFromCatalog() {
  const query = manualQuery.value.trim()
  if (!query) return

  const match = findMedicine(query)

  if (!match) {
    notFound.value = true
    notFoundReason.value = 'Obat tidak ditemukan di katalog.'
    return
  }

  const existing = cart.value.find((item) => item.batch === match.batch)
  const requestedQty = (existing ? existing.qty : 0) + 1

  if (requestedQty > match.qty) {
    notFound.value = true
    notFoundReason.value = 'Stok obat ini tidak mencukupi.'
    return
  }

  notFound.value = false
  if (existing) {
    existing.qty += 1
  } else {
    cart.value.push({ name: match.name, batch: match.batch, price: match.price, stock: stockLabel(match.status), qty: 1 })
  }
  manualQuery.value = ''
}

function increment(item) {
  const med = cashierStore.inventory.find((m) => m.batch === item.batch)
  if (med && item.qty >= med.qty) return
  item.qty += 1
}

function decrement(item) {
  if (item.qty > 1) {
    item.qty -= 1
  }
}

function removeItem(item) {
  cart.value = cart.value.filter((entry) => entry.batch !== item.batch)
}

function formatCurrency(value) {
  return 'Rp ' + value.toLocaleString('id-ID')
}

function completeTransaction() {
  if (cart.value.length === 0) return

  receipt.value = {
    items: cart.value.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
    subtotal: subtotal.value,
    discount: discount.value,
    tax: tax.value,
    total: total.value,
    method: paymentMethod.value,
    patientName: patientName.value,
    datetime: new Date().toLocaleString('id-ID')
  }

  cart.value.forEach((item) => decrementStock(item.batch, item.qty))

  const now = new Date()
  recordTransaction({
    time: now.toTimeString().slice(0, 5),
    items: cart.value.reduce((sum, item) => sum + item.qty, 0),
    method: paymentMethod.value,
    total: total.value
  })

  showReceipt.value = true
}

function printReceipt() {
  const data = receipt.value
  const rows = data.items
    .map(
      (item) =>
        `<tr><td>${item.name} x${item.qty}</td><td style="text-align:right">${formatCurrency(item.price * item.qty)}</td></tr>`
    )
    .join('')

  const win = window.open('', '_blank', 'width=380,height=640')
  win.document.write(`
    <html>
      <head>
        <title>Struk Pembayaran</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 18px; font-size: 12px; color: #111; }
          h2 { text-align: center; margin: 0 0 2px; letter-spacing: 1px; }
          p { margin: 2px 0; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          td { padding: 4px 0; }
          .line { border-top: 1px dashed #333; margin: 10px 0; }
          .total td { font-weight: bold; font-size: 14px; }
        </style>
      </head>
      <body>
        <h2>PHARMACISE</h2>
        <p>Apotek Sehat Selalu</p>
        <p>${data.datetime}</p>
        <div class="line"></div>
        ${data.patientName ? `<p>Pasien: ${data.patientName}</p>` : ''}
        <p>Kasir: Andi Wijaya</p>
        <div class="line"></div>
        <table>${rows}</table>
        <div class="line"></div>
        <table>
          <tr><td>Subtotal</td><td style="text-align:right">${formatCurrency(data.subtotal)}</td></tr>
          <tr><td>Diskon</td><td style="text-align:right">${formatCurrency(data.discount)}</td></tr>
          <tr><td>Pajak (11%)</td><td style="text-align:right">${formatCurrency(data.tax)}</td></tr>
          <tr class="total"><td>Total</td><td style="text-align:right">${formatCurrency(data.total)}</td></tr>
        </table>
        <div class="line"></div>
        <p>Metode: ${data.method}</p>
        <p>Terima kasih atas kunjungan Anda</p>
      </body>
    </html>
  `)
  win.document.close()
  win.focus()
  win.print()
}

function closeReceipt() {
  showReceipt.value = false
  receipt.value = null
  cart.value = []
  patientName.value = ''
  paymentMethod.value = 'Tunai'
  emit('navigate', 'dashboard')
}

function saveDraft() {
  window.alert('Transaksi disimpan sebagai draft.')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Nunito', sans-serif;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  padding: 14px 28px;
  border-bottom: 1px solid #e5eaf0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-weight: 700;
  color: #21857a;
  font-size: 15px;
  white-space: nowrap;
}

.brand-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.search-box {
  flex: 1;
  max-width: 420px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f6f8fa;
  border: 1px solid #e5eaf0;
  border-radius: 8px;
  padding: 9px 14px;
}

.search-box svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.search-box input {
  border: none;
  outline: none;
  background: none;
  font-size: 13px;
  color: #192534;
  width: 100%;
  font-family: inherit;
}

.search-box input::placeholder {
  color: #6b7887;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  display: flex;
  padding: 4px;
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.icon-btn.bell .badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #e5484d;
  color: white;
  font-size: 9px;
  font-weight: 700;
  border-radius: 7px;
  min-width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #21857a;
  color: white;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.profile-text .role {
  font-size: 10px;
  color: #6b7887;
}

.profile-text .name {
  font-size: 13px;
  font-weight: 700;
  color: #192534;
}

.chevron {
  width: 14px;
  height: 14px;
}

.body {
  display: flex;
  align-items: stretch;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: linear-gradient(200deg, #21857a 55%, #081f1c 130%);
  min-height: calc(100vh - 61px);
  padding: 22px 12px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 500;
  padding: 11px 14px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
}

.nav-item svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.active {
  background: linear-gradient(90deg, white 0%, rgba(255, 255, 255, 0.55) 55%, rgba(255, 255, 255, 0) 100%);
  color: #0f6b52;
}

.main-content {
  flex: 1;
  padding: 26px 30px 60px;
}

.tx-columns {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
  align-items: start;
}

.tx-left-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: white;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
  padding: 24px;
}

.card h2 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: #192534;
}

.card-sub {
  margin: 0 0 18px;
  font-size: 13px;
  color: #6b7887;
}

.scan-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.scan-tab {
  flex: 1;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid #e5eaf0;
  background: white;
  color: #6b7887;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.scan-tab.active {
  background: #21857a;
  border-color: #21857a;
  color: white;
}

.scan-box {
  border: 2px dashed #c9d3dc;
  border-radius: 12px;
  background: #fbfcfd;
  padding: 32px;
  text-align: center;
  margin-bottom: 16px;
}

.scan-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 28px;
  background: #e8f4f2;
  color: #21857a;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-title {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: #192534;
}

.scan-hint {
  margin: 0;
  font-size: 12px;
  color: #6b7887;
}

.manual-row {
  display: flex;
  gap: 12px;
}

.manual-row input {
  flex: 1;
  border: 1px solid #e5eaf0;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  color: #192534;
  outline: none;
  font-family: inherit;
}

.add-btn {
  background: #21857a;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 13px;
  padding: 0 24px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.not-found {
  margin: 10px 0 0;
  font-size: 12px;
  color: #d03434;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table thead th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7887;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5eaf0;
}

.cart-table tbody td {
  padding: 14px 6px;
  border-bottom: 1px solid #e5eaf0;
  font-size: 13px;
  color: #192534;
}

.cart-table tbody tr:last-child td {
  border-bottom: none;
}

.cart-table td.name {
  font-weight: 700;
}

.cart-table td.muted {
  color: #6b7887;
}

.cart-table td.subtotal {
  font-weight: 600;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.qty-control button {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid #e5eaf0;
  background: white;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: #192534;
}

.stock-label {
  font-size: 12px;
  font-weight: 700;
}

.stock-label.available {
  color: #178c61;
}

.stock-label.low {
  color: #b28c00;
}

.remove-btn {
  background: none;
  border: none;
  color: #e5484d;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.empty-cart {
  text-align: center;
  color: #6b7887;
  padding: 24px 0;
}

.summary-card {
  position: sticky;
  top: 20px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7887;
  margin: 0 0 8px;
  display: block;
}

.field-input {
  width: 100%;
  border: 1px solid #e5eaf0;
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 13px;
  color: #192534;
  outline: none;
  margin-bottom: 20px;
  font-family: inherit;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7887;
  padding: 7px 0;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 800;
  color: #192534;
}

.summary-divider {
  height: 1px;
  background: #e5eaf0;
  margin: 8px 0;
}

.payment-methods {
  display: flex;
  gap: 10px;
  margin: 12px 0 20px;
}

.payment-btn {
  flex: 1;
  padding: 11px 0;
  border-radius: 8px;
  border: 1px solid #e5eaf0;
  background: white;
  color: #6b7887;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.payment-btn.active {
  background: #eaf5f3;
  border-color: #21857a;
  color: #21857a;
}

.pay-btn {
  width: 100%;
  background: #21857a;
  border: none;
  color: white;
  font-weight: 800;
  font-size: 14px;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 12px;
}

.pay-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.draft-btn {
  width: 100%;
  background: white;
  border: 1px solid #21857a;
  color: #21857a;
  font-weight: 700;
  font-size: 13px;
  padding: 13px;
  border-radius: 8px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 30, 27, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.receipt-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  max-height: 90vh;
  overflow-y: auto;
}

.receipt-check {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #e5f6ed;
  color: #178c61;
  font-size: 26px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.receipt-modal h2 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: #192534;
}

.receipt-sub {
  margin: 0;
  font-size: 12px;
  color: #6b7887;
}

.receipt-divider {
  height: 1px;
  background: #e5eaf0;
  margin: 16px 0;
}

.receipt-items {
  text-align: left;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #33443d;
  padding: 5px 0;
  text-align: left;
}

.receipt-row.total {
  font-size: 16px;
  font-weight: 800;
  color: #192534;
  padding-top: 8px;
}

.receipt-method {
  margin: 14px 0 0;
  font-size: 12px;
  font-weight: 700;
  color: #21857a;
}

.receipt-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.print-btn {
  flex: 1;
  background: white;
  border: 1px solid #21857a;
  color: #21857a;
  font-weight: 700;
  font-size: 13px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.done-btn {
  flex: 1;
  background: #21857a;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 13px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
