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

        <div class="profile">
          <div class="avatar">S</div>
          <div class="profile-text">
            <span class="role">Pharmacy Technician</span>
            <span class="name">Siti Rahma</span>
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
        <h1>Inventory</h1>
        <p class="page-sub">Pantau stok dan lakukan penyesuaian sesuai pergerakan obat harian.</p>

        <div class="toolbar">
          <div class="search-box table-search">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#9CA8A3" stroke-width="1.8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#9CA8A3" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <input v-model="query" type="text" placeholder="Search Medicines, Batch No." />
          </div>

          <button class="filter-btn" @click="ocrModalOpen = true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8C4 6.9 4.9 6 6 6H7.5L8.5 4H15.5L16.5 6H18C19.1 6 20 6.9 20 8V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V8Z" stroke="#33443d" stroke-width="1.6" stroke-linejoin="round" />
              <circle cx="12" cy="12.5" r="3.2" stroke="#33443d" stroke-width="1.6" />
            </svg>
            Scan Faktur
          </button>
        </div>

        <div class="table-card">
          <table>
            <thead>
              <tr>
                <th>MEDICINE NAME</th>
                <th>BATCH</th>
                <th>EXPIRED</th>
                <th>STOK</th>
                <th>STATUS</th>
                <th class="col-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id" :class="rowClass(item.status)">
                <td class="name">{{ item.name }}</td>
                <td class="muted">{{ item.batch }}</td>
                <td :class="expiredClass(item.status)">{{ item.expired }}</td>
                <td class="muted">{{ item.stock }}</td>
                <td>
                  <span class="status-pill" :class="item.status">{{ statusLabel(item.status) }}</span>
                </td>
                <td class="col-actions">
                  <button class="adjust-btn" @click="openAdjust(item)">Sesuaikan Stok</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <StockAdjustModal
      v-if="adjustTarget"
      :item="adjustTarget"
      @close="adjustTarget = null"
      @save="handleAdjustSave"
    />

    <InvoiceOcrModal
      v-if="ocrModalOpen"
      @close="ocrModalOpen = false"
      @received="handleInvoiceReceived"
    />
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { ownerStore, updateInventoryItem, applyInvoiceReceipt } from '../store/ownerStore'
import StockAdjustModal from '../modals/StockAdjustModal.vue'
import InvoiceOcrModal from '../modals/InvoiceOcrModal.vue'

const emit = defineEmits(['navigate'])

const activeNav = ref('inventory')
const query = ref('')
const adjustTarget = ref(null)
const ocrModalOpen = ref(false)

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

const items = computed(() => ownerStore.inventory)

const filteredItems = computed(() => {
  if (!query.value.trim()) return items.value
  const q = query.value.toLowerCase()
  return items.value.filter(
    (item) => item.name.toLowerCase().includes(q) || item.batch.toLowerCase().includes(q)
  )
})

function rowClass(status) {
  if (status === 'critical') return 'row-critical'
  if (status === 'low-stock') return 'row-low'
  return ''
}

function expiredClass(status) {
  if (status === 'critical') return 'expired critical'
  if (status === 'low-stock') return 'expired low'
  return 'expired'
}

function statusLabel(status) {
  if (status === 'critical') return 'Critical'
  if (status === 'low-stock') return 'Low Stock'
  return 'Available'
}

function openAdjust(item) {
  adjustTarget.value = item
}

function handleAdjustSave({ id, stock }) {
  updateInventoryItem(id, { stock })
  adjustTarget.value = null
}

function handleInvoiceReceived({ items: receivedItems, meta }) {
  applyInvoiceReceipt(receivedItems, meta)
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
  background: linear-gradient(200deg, #14523f 55%, #081f1c 130%);
  min-height: calc(100vh - 61px);
  padding: 22px 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  position: relative;
}

.main-content h1 {
  margin: 0 0 4px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 22px;
  color: #17332a;
}

.page-sub {
  margin: 0 0 18px;
  font-size: 12.5px;
  color: #6c7d76;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.table-search {
  max-width: none;
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.12);
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.12);
  border-radius: 8px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  color: #33443d;
  cursor: pointer;
  white-space: nowrap;
}

.filter-btn svg {
  width: 15px;
  height: 15px;
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

.col-actions {
  width: 150px;
}

tbody tr {
  border-bottom: 1px solid rgba(15, 107, 82, 0.06);
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr.row-critical {
  background: rgba(217, 83, 79, 0.06);
}

tbody tr.row-low {
  background: rgba(224, 163, 44, 0.08);
}

td {
  padding: 14px 16px;
  font-size: 13px;
  color: #33443d;
}

td.name {
  font-weight: 600;
}

td.muted {
  color: #6c7d76;
}

td.expired.critical {
  color: #d9534f;
  font-weight: 700;
}

td.expired.low {
  color: #b8940f;
  font-weight: 700;
}

.status-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
}

.status-pill.available {
  background: rgba(47, 143, 112, 0.12);
  color: #2f8f70;
}

.status-pill.critical {
  background: rgba(217, 83, 79, 0.14);
  color: #d9534f;
}

.status-pill.low-stock {
  background: rgba(224, 163, 44, 0.16);
  color: #b8940f;
}

.adjust-btn {
  background: rgba(47, 143, 112, 0.1);
  border: none;
  color: #0f6b52;
  font-weight: 700;
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 7px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
