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
          <span class="badge">2</span>
        </button>

        <UserProfileMenu @logout="$emit('logout')" />
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
        <h1>Orders</h1>
        <p class="page-sub">Pantau status pesanan dan terima barang yang sudah tiba dari distributor.</p>

        <section class="summary-grid">
          <div class="summary-item">
            <p class="summary-label">Menunggu Approval Owner</p>
            <p class="summary-value">{{ awaitingCount }} Pesanan</p>
            <span class="summary-note amber">Tidak dapat diubah oleh Staff</span>
          </div>

          <div class="summary-item">
            <p class="summary-label">Dalam Pengiriman (In Transit)</p>
            <p class="summary-value">{{ transitCount }} Pengiriman</p>
            <span class="summary-note blue">Siap diterima &amp; discan</span>
          </div>

          <div class="summary-item">
            <p class="summary-label">Selesai / Diterima</p>
            <p class="summary-value">{{ completedCount }} Transaksi</p>
            <span class="summary-note green">Stok Terverifikasi &amp; Sinkron</span>
          </div>
        </section>

        <h2 class="table-title">Daftar Pesanan &amp; Penerimaan Barang</h2>

        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>No. PO / Ref</th>
                <th>Distributor (PBF)</th>
                <th>Tgl Pemesanan</th>
                <th>Est. Tiba</th>
                <th>Total Estimasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="ref">{{ order.ref }}</td>
                <td class="muted">{{ order.distributor }}</td>
                <td class="muted">{{ order.orderDate }}</td>
                <td :class="{ bold: order.etaBold }">{{ order.eta }}</td>
                <td class="bold">{{ order.total }}</td>
                <td>
                  <span class="status-text" :class="order.status">{{ statusLabel(order.status) }}</span>
                </td>
                <td>
                  <button
                    v-if="order.status === 'transit'"
                    class="action-btn transit"
                    @click="openReceive(order)"
                  >
                    Terima Barang (Scan Faktur)
                  </button>
                  <span v-else class="action-disabled">{{ order.status === 'awaiting' ? 'Menunggu Approval Owner' : 'Selesai' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <InvoiceOcrModal
      v-if="ocrModalOpen"
      @close="closeReceive"
      @received="handleInvoiceReceived"
    />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { ownerStore, applyInvoiceReceipt, updateOrderStatus } from '../store/ownerStore'
import UserProfileMenu from './UserProfileMenu.vue'
import InvoiceOcrModal from '../modals/InvoiceOcrModal.vue'

const emit = defineEmits(['navigate'])

const activeNav = ref('orders')
const ocrModalOpen = ref(false)
const receivingOrder = ref(null)

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
    id: 'inventory',
    label: 'Inventory',
    icon: icon([{ d: 'M4 7L12 3L20 7V17L12 21L4 17V7Z', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linejoin': 'round' }])
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: icon([{ d: 'M6 3H14L18 7V21H6V3Z', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linejoin': 'round' }])
  }
]

const orders = computed(() => ownerStore.orders)
const awaitingCount = computed(() => orders.value.filter((o) => o.status === 'awaiting').length)
const transitCount = computed(() => orders.value.filter((o) => o.status === 'transit').length)
const completedCount = computed(() => orders.value.filter((o) => o.status === 'completed').length)

function statusLabel(status) {
  if (status === 'awaiting') return 'Awaiting Approval'
  if (status === 'transit') return 'In Transit'
  return 'Completed'
}

function openReceive(order) {
  receivingOrder.value = order
  ocrModalOpen.value = true
}

function closeReceive() {
  ocrModalOpen.value = false
  receivingOrder.value = null
}

function handleInvoiceReceived({ items, meta }) {
  applyInvoiceReceipt(items, meta)
  if (receivingOrder.value) {
    updateOrderStatus(receivingOrder.value.id, 'completed', 'Lihat Detail & Invoice')
  }
  receivingOrder.value = null
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-page {
  min-height: 100vh;
  background: #f6f8f7;
  font-family: 'Nunito', sans-serif;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  padding: 14px 28px;
  border-bottom: 1px solid rgba(15, 107, 82, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-weight: 700;
  color: #0f6b52;
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
  background: #f3f6f5;
  border: 1px solid rgba(15, 107, 82, 0.1);
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
  color: #17332a;
  width: 100%;
  font-family: inherit;
}

.search-box input::placeholder {
  color: #8a9a94;
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
  background: #0f6b52;
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
  color: #8a9a94;
}

.profile-text .name {
  font-size: 13px;
  font-weight: 700;
  color: #17332a;
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
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 600;
  padding: 11px 12px;
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
  padding: 26px 30px 40px;
}

.main-content h1 {
  margin: 0 0 4px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 22px;
  color: #17332a;
}

.page-sub {
  margin: 0 0 20px;
  font-size: 12.5px;
  color: #6c7d76;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-item {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(15, 107, 82, 0.08);
  padding: 18px 20px;
}

.summary-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: #6c7d76;
}

.summary-value {
  margin: 0 0 8px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #17332a;
}

.summary-note {
  font-size: 11.5px;
  font-weight: 600;
}

.summary-note.amber { color: #b8940f; }
.summary-note.blue { color: #2666cc; }
.summary-note.green { color: #2f8f70; }

.table-title {
  margin: 0 0 14px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 16px;
  color: #17332a;
}

.table-card {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(15, 107, 82, 0.08);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background: #eef2f0;
}

th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #6c7d76;
  padding: 12px 16px;
}

tbody tr {
  border-bottom: 1px solid rgba(15, 107, 82, 0.06);
}

tbody tr:last-child {
  border-bottom: none;
}

td {
  padding: 14px 16px;
  font-size: 13px;
  color: #33443d;
}

td.ref {
  font-weight: 700;
  color: #17332a;
}

td.muted {
  color: #6c7d76;
}

td.bold {
  font-weight: 700;
}

.status-text {
  font-size: 12.5px;
  font-weight: 700;
}

.status-text.awaiting { color: #b8940f; }
.status-text.transit { color: #2666cc; }
.status-text.completed { color: #2f8f70; }

.action-btn {
  border: none;
  border-radius: 7px;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.action-btn.transit {
  background: rgba(38, 102, 204, 0.12);
  color: #2666cc;
}

.action-disabled {
  font-size: 12px;
  color: #a3b0ab;
  font-weight: 600;
}
</style>
