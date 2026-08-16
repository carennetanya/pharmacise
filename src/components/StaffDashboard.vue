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
        <h1>Dashboard Staf</h1>
        <p class="page-sub">Ringkasan tugas harian: pergerakan stok dan penyiapan resep.</p>

        <section class="stat-grid">
          <div class="stat-card">
            <div class="stat-label warn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 12H10L8 22L20 10H13L12 2Z" fill="#E0A32C" />
              </svg>
              <span>STOK MENIPIS</span>
            </div>
            <p class="stat-value amber">{{ lowStockCount }} Item</p>
            <span class="stat-tag amber">Perlu Diperhatikan</span>
          </div>

          <div class="stat-card">
            <div class="stat-label warn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L22 20H2L12 3Z" stroke="#D9534F" stroke-width="1.6" stroke-linejoin="round" />
                <line x1="12" y1="10" x2="12" y2="14" stroke="#D9534F" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="12" cy="17" r="1" fill="#D9534F" />
              </svg>
              <span>STOK KRITIS</span>
            </div>
            <p class="stat-value red">{{ criticalCount }} Item</p>
            <span class="stat-tag red">Segera Pesan Ulang</span>
          </div>

          <div class="stat-card">
            <div class="stat-label">
              <span class="stat-emoji">📦</span>
              <span>PESANAN DALAM PERJALANAN</span>
            </div>
            <p class="stat-value blue">{{ transitCount }} PO</p>
            <span class="stat-tag blue">Menunggu Diterima</span>
          </div>

          <div class="stat-card">
            <div class="stat-label">
              <span class="stat-emoji">💊</span>
              <span>TOTAL ITEM INVENTORY</span>
            </div>
            <p class="stat-value green">{{ totalItems }} SKU</p>
            <span class="stat-tag green">Terpantau</span>
          </div>
        </section>

        <section class="panels">
          <div class="task-panel">
            <h2>ITEM PERLU PENYESUAIAN STOK</h2>
            <ul class="task-list">
              <li v-for="item in attentionItems" :key="item.id">
                <div class="task-left">
                  <span class="task-name">{{ item.name }}</span>
                  <span class="task-sub">Batch {{ item.batch }} · Sisa {{ item.stock }}</span>
                </div>
                <span class="status-pill" :class="item.status">{{ statusLabel(item.status) }}</span>
              </li>
              <li v-if="attentionItems.length === 0" class="empty-item">Tidak ada item yang perlu perhatian saat ini.</li>
            </ul>
            <button class="goto-btn" @click="goTo('inventory')">Buka Inventory</button>
          </div>

          <div class="task-panel">
            <h2>PESANAN MENUNGGU DITERIMA</h2>
            <ul class="task-list">
              <li v-for="order in incomingOrders" :key="order.id">
                <div class="task-left">
                  <span class="task-name">{{ order.ref }}</span>
                  <span class="task-sub">{{ order.distributor }} · ETA {{ order.eta }}</span>
                </div>
                <span class="status-pill transit">In Transit</span>
              </li>
              <li v-if="incomingOrders.length === 0" class="empty-item">Tidak ada pesanan yang menunggu penerimaan.</li>
            </ul>
            <button class="goto-btn" @click="goTo('orders')">Buka Orders</button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { ownerStore } from '../store/ownerStore'

const emit = defineEmits(['navigate'])

const activeNav = ref('dashboard')

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

const totalItems = computed(() => ownerStore.inventory.length)
const lowStockCount = computed(() => ownerStore.inventory.filter((i) => i.status === 'low-stock').length)
const criticalCount = computed(() => ownerStore.inventory.filter((i) => i.status === 'critical').length)
const transitCount = computed(() => ownerStore.orders.filter((o) => o.status === 'transit').length)

const attentionItems = computed(() =>
  ownerStore.inventory.filter((i) => i.status === 'critical' || i.status === 'low-stock').slice(0, 5)
)

const incomingOrders = computed(() => ownerStore.orders.filter((o) => o.status === 'transit'))

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
  padding: 26px 30px 40px;
}

.main-content h1 {
  margin: 0 0 6px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 26px;
  color: #192534;
}

.page-sub {
  margin: 0 0 18px;
  font-size: 13px;
  color: #6b7887;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 16px 18px;
  border: 1px solid #e5eaf0;
}

.stat-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #6b7887;
  margin-bottom: 10px;
}

.stat-label svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.stat-emoji {
  font-size: 14px;
}

.stat-value {
  margin: 0 0 10px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 24px;
}

.stat-value.red { color: #d03434; }
.stat-value.amber { color: #cc9900; }
.stat-value.green { color: #178c61; }
.stat-value.blue { color: #2666cc; }

.stat-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 5px;
}

.stat-tag.red { color: #bf4040; background: #fcebea; }
.stat-tag.amber { color: #b28c00; background: #fef6e0; }
.stat-tag.green { color: #1a8059; background: #e5f6ed; }
.stat-tag.blue { color: #2666cc; background: #e5eefc; }

.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: start;
}

.task-panel {
  background: white;
  border-radius: 12px;
  padding: 22px;
  border: 1px solid #e5eaf0;
  display: flex;
  flex-direction: column;
}

.task-panel h2 {
  margin: 0 0 16px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #192534;
}

.task-list {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5eaf0;
}

.task-list li:last-child {
  border-bottom: none;
}

.task-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.task-name {
  font-size: 13px;
  font-weight: 700;
  color: #192534;
}

.task-sub {
  font-size: 11px;
  color: #6b7887;
}

.empty-item {
  padding: 16px 0;
  color: #6b7887;
  font-size: 12.5px;
  text-align: center;
}

.status-pill {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 999px;
  white-space: nowrap;
}

.status-pill.available {
  background: rgba(47, 143, 112, 0.12);
  color: #178c61;
}

.status-pill.critical {
  background: rgba(217, 83, 79, 0.14);
  color: #d9534f;
}

.status-pill.low-stock {
  background: rgba(224, 163, 44, 0.16);
  color: #b8940f;
}

.status-pill.transit {
  background: rgba(38, 102, 204, 0.12);
  color: #2666cc;
}

.goto-btn {
  background: #21857a;
  border: none;
  color: white;
  font-size: 13px;
  font-weight: 700;
  padding: 13px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
