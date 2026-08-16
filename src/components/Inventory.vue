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
            <span class="role">Pharmacist in charge</span>
            <span class="name">Dr. Aris</span>
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

        <button class="logs-btn">Recent Activity Logs</button>
      </aside>
      <main class="main-content">
        <h1>Inventory</h1>

        <div class="toolbar">
          <div class="search-box table-search">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#9CA8A3" stroke-width="1.8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#9CA8A3" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <input v-model="query" type="text" placeholder="Search Medicines, Batch No." />
          </div>

          <button class="filter-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 4V20M7 4L4 7M7 4L10 7" stroke="#33443d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17 20V4M17 20L14 17M17 20L20 17" stroke="#33443d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Sort by
          </button>

          <button class="filter-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="7" height="7" rx="1.5" stroke="#33443d" stroke-width="1.6" />
              <rect x="14" y="4" width="7" height="7" rx="1.5" stroke="#33443d" stroke-width="1.6" />
              <rect x="3" y="15" width="7" height="7" rx="1.5" stroke="#33443d" stroke-width="1.6" />
              <rect x="14" y="15" width="7" height="7" rx="1.5" stroke="#33443d" stroke-width="1.6" />
            </svg>
            Category
          </button>

          <button class="filter-btn" @click="csvModalOpen = true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V3M12 3L7 8M12 3L17 8" stroke="#33443d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M4 15V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15" stroke="#33443d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Import CSV
          </button>

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
                <th class="col-check"><input type="checkbox" /></th>
                <th>MEDICINE NAME</th>
                <th>BATCH</th>
                <th>EXPIRED</th>
                <th>STOK</th>
                <th>STATUS</th>
                <th class="col-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in filteredItems" :key="i" :class="rowClass(item.status)">
                <td class="col-check"><input type="checkbox" /></td>
                <td class="name">{{ item.name }}</td>
                <td class="muted">{{ item.batch }}</td>
                <td :class="expiredClass(item.status)">{{ item.expired }}</td>
                <td class="muted">{{ item.stock }}</td>
                <td>
                  <span class="status-pill" :class="item.status">{{ statusLabel(item.status) }}</span>
                </td>
                <td class="col-actions">
                  <div class="more-menu-wrap">
                    <button class="more-btn" aria-label="More actions" @click="toggleMenu(item.id)">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="12" r="1.8" fill="#889690" />
                        <circle cx="12" cy="12" r="1.8" fill="#889690" />
                        <circle cx="19" cy="12" r="1.8" fill="#889690" />
                      </svg>
                    </button>
                    <div v-if="openMenuId === item.id" class="more-menu">
                      <button @click="openEdit(item)">Edit</button>
                      <button class="danger" @click="openDelete(item)">Hapus</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="fab-area">
          <img src="/mascot.png" alt="Mascot" class="fab-mascot" />
          <button class="fab" aria-label="Add medicine" @click="openAdd">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="white" stroke-width="2.2" stroke-linecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="white" stroke-width="2.2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </main>
    </div>

    <InventoryItemModal
      v-if="formModalOpen"
      :item="editingItem"
      @close="formModalOpen = false"
      @save="handleSave"
      @delete="handleDeleteFromForm"
    />

    <ConfirmModal
      v-if="deleteTarget"
      title="Hapus Item Inventory"
      :message="`Apakah Anda yakin ingin menghapus ${deleteTarget.name}? Tindakan ini tidak dapat dibatalkan.`"
      confirm-label="Ya, Hapus"
      danger
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />

    <CsvImportModal
      v-if="csvModalOpen"
      entity-type="inventory"
      @close="csvModalOpen = false"
      @imported="handleCsvImported"
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
import { ownerStore, addInventoryItem, updateInventoryItem, deleteInventoryItem, importInventoryRows, applyInvoiceReceipt } from '../store/ownerStore'
import InventoryItemModal from './modals/InventoryItemModal.vue'
import ConfirmModal from './modals/ConfirmModal.vue'
import CsvImportModal from './modals/CsvImportModal.vue'
import InvoiceOcrModal from './modals/InvoiceOcrModal.vue'

const emit = defineEmits(['navigate', 'add-medicine'])

const activeNav = ref('inventory')
const query = ref('')

const openMenuId = ref(null)
const formModalOpen = ref(false)
const editingItem = ref(null)
const deleteTarget = ref(null)
const csvModalOpen = ref(false)
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
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    icon: icon([
      { d: 'M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z', stroke: 'currentColor', 'stroke-width': 1.7 },
      { d: 'M2 20C2 16.6863 4.68629 14 8 14C11.3137 14 14 16.6863 14 20', stroke: 'currentColor', 'stroke-width': 1.7 },
      { d: 'M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5', stroke: 'currentColor', 'stroke-width': 1.7 },
      { d: 'M14 14.5C17 14.9 19.5 17.1 20 20', stroke: 'currentColor', 'stroke-width': 1.7 }
    ])
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: icon([{ d: 'M4 20V10M11 20V4M18 20V14', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round' }])
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: icon([
      { d: 'M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z', stroke: 'currentColor', 'stroke-width': 1.7 },
      { d: 'M19.4 15C19.1 15.7 19.2 16.5 19.6 17.1L19.7 17.2C20.3 17.9 20.3 19 19.6 19.6C19 20.3 17.9 20.3 17.2 19.6L17.1 19.5C16.5 19.1 15.7 19 15 19.3C14.3 19.6 13.9 20.3 13.9 21V21.1C13.9 22.1 13.1 22.9 12.1 22.9C11.1 22.9 10.3 22.1 10.3 21.1V21C10.2 20.2 9.7 19.6 9 19.3C8.3 19 7.5 19.1 6.9 19.5L6.8 19.6C6.1 20.3 5 20.3 4.4 19.6C3.7 19 3.7 17.9 4.4 17.2L4.5 17.1C4.9 16.5 5 15.7 4.7 15C4.4 14.3 3.7 13.9 3 13.9H2.9C1.9 13.9 1.1 13.1 1.1 12.1C1.1 11.1 1.9 10.3 2.9 10.3H3C3.8 10.2 4.4 9.7 4.7 9C5 8.3 4.9 7.5 4.5 6.9L4.4 6.8C3.7 6.1 3.7 5 4.4 4.4C5 3.7 6.1 3.7 6.8 4.4L6.9 4.5C7.5 4.9 8.3 5 9 4.7C9.7 4.4 10.1 3.7 10.1 3V2.9C10.1 1.9 10.9 1.1 11.9 1.1C12.9 1.1 13.7 1.9 13.7 2.9V3C13.7 3.7 14.1 4.4 14.8 4.7C15.5 5 16.3 4.9 16.9 4.5L17 4.4C17.7 3.7 18.8 3.7 19.4 4.4C20.1 5 20.1 6.1 19.4 6.8L19.3 6.9C18.9 7.5 18.8 8.3 19.1 9C19.4 9.7 20.1 10.1 20.8 10.1H20.9C21.9 10.1 22.7 10.9 22.7 11.9C22.7 12.9 21.9 13.7 20.9 13.7H20.8C20.1 13.7 19.4 14.1 19.1 14.8L19.4 15Z', stroke: 'currentColor', 'stroke-width': 1.2 }
    ])
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

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function openAdd() {
  editingItem.value = null
  formModalOpen.value = true
}

function openEdit(item) {
  openMenuId.value = null
  editingItem.value = item
  formModalOpen.value = true
}

function openDelete(item) {
  openMenuId.value = null
  deleteTarget.value = item
}

function confirmDelete() {
  deleteInventoryItem(deleteTarget.value.id)
  deleteTarget.value = null
}

function handleSave(payload) {
  if (payload.id) {
    updateInventoryItem(payload.id, payload)
  } else {
    addInventoryItem(payload)
  }
  formModalOpen.value = false
}

function handleDeleteFromForm(id) {
  deleteInventoryItem(id)
  formModalOpen.value = false
}

function handleCsvImported({ rows }) {
  importInventoryRows(rows)
}

function handleInvoiceReceived({ items: receivedItems, meta }) {
  applyInvoiceReceipt(receivedItems, meta)
}

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
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard-page {
  min-height: 100vh;
  background: #eef4f2;
  font-family: 'Nunito', sans-serif;
}

/* Topbar */
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
  background: none;
  outline: none;
  width: 100%;
  font-size: 13px;
  color: #445;
}

.topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 18px;
}

.icon-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.icon-btn.bell .badge {
  position: absolute;
  top: -3px;
  right: -3px;
  background: #d9534f;
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 15px;
  height: 15px;
  border-radius: 50%;
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
  background: #2f8f70;
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
  color: #223;
}

.chevron {
  width: 14px;
  height: 14px;
}

/* Body layout */
.body {
  display: flex;
  align-items: stretch;
}

/* Sidebar */
.sidebar {
  width: 210px;
  flex-shrink: 0;
  background: #2f8f70;
  min-height: calc(100vh - 61px);
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.logs-btn {
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 11px;
  border-radius: 8px;
  cursor: pointer;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 26px 30px 40px;
  position: relative;
}

.main-content h1 {
  margin: 0 0 18px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 22px;
  color: #17332a;
}

/* Toolbar */
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

/* Table */
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

.col-check {
  width: 44px;
}

.col-actions {
  width: 48px;
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

.more-menu-wrap {
  position: relative;
}

.more-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
}

.more-btn svg {
  width: 18px;
  height: 18px;
}

.more-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.12);
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(15, 51, 42, 0.14);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  overflow: hidden;
  z-index: 20;
}

.more-menu button {
  background: none;
  border: none;
  text-align: left;
  padding: 10px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: #33443d;
  cursor: pointer;
}

.more-menu button:hover {
  background: #f3f6f5;
}

.more-menu button.danger {
  color: #d9534f;
}

/* Floating action button */
.fab-area {
  position: fixed;
  bottom: 32px;
  right: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fab-mascot {
  width: 40px;
  height: auto;
  margin-bottom: -6px;
}

.fab {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #2f8f70;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(47, 143, 112, 0.4);
}

.fab svg {
  width: 20px;
  height: 20px;
}
</style>