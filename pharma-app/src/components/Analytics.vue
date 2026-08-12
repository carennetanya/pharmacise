<template>
  <div class="dashboard-page">
    <!-- Topbar -->
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
      <!-- Sidebar -->
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

      <!-- Main content -->
      <main class="main-content">
        <div class="page-head">
          <div>
            <h1>Analytics</h1>
            <p class="page-subtitle">Wawasan bisnis dan performa penjualan apotek Anda.</p>
          </div>

          <button class="period-btn">
            <span>{{ selectedPeriod }}</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#33443d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <section class="stat-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
            <span class="stat-tag" :class="stat.trend">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  v-if="stat.trend === 'up'"
                  d="M6 15L12 9L18 15"
                  stroke="#2f8f70"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  v-else
                  d="M6 9L12 15L18 9"
                  stroke="#c0392b"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ stat.change }}
            </span>
          </div>
        </section>

        <section class="panels">
          <div class="chart-panel">
            <h2>Tren Pendapatan (6 Bulan Terakhir)</h2>

            <div class="bar-chart">
              <div class="bar-col" v-for="(m, i) in revenueTrend" :key="m.label">
                <div class="bar-col-track">
                  <div
                    class="bar-col-fill"
                    :class="{ current: i === revenueTrend.length - 1 }"
                    :style="{ height: (m.value / maxRevenue) * 100 + '%' }"
                  ></div>
                </div>
                <span class="bar-col-label">{{ m.label }}</span>
              </div>
            </div>
          </div>

          <div class="products-panel">
            <h2>Produk Terlaris</h2>

            <ul class="product-list">
              <li v-for="(p, i) in topProducts" :key="p.name">
                <div class="product-row">
                  <span class="p-name">{{ i + 1 }}. {{ p.name }}</span>
                  <span class="p-value">{{ p.revenue }}</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: p.percent + '%' }"></div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section class="panels panels-secondary">
          <div class="category-panel">
            <h2>Penjualan per Kategori</h2>

            <div class="stacked-bar">
              <span
                v-for="cat in categories"
                :key="cat.name"
                class="stacked-seg"
                :style="{ width: cat.pct + '%', background: cat.color }"
              ></span>
            </div>

            <ul class="category-legend">
              <li v-for="cat in categories" :key="cat.name">
                <span class="dot" :style="{ background: cat.color }"></span>
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-pct">{{ cat.pct }}%</span>
              </li>
            </ul>
          </div>

          <div class="staff-panel">
            <h2>Performa Kasir / Staff</h2>

            <table class="staff-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Transaksi</th>
                  <th>Total Penjualan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in staffPerformance" :key="s.name">
                  <td>{{ s.name }}</td>
                  <td>{{ s.transactions }}</td>
                  <td class="amount">{{ s.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

const emit = defineEmits(['navigate'])

const activeNav = ref('analytics')

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

function goTo(id) {
  activeNav.value = id
  emit('navigate', id)
}

const selectedPeriod = ref('Bulan Ini (Juli 2026)')

const stats = [
  { label: 'TOTAL REVENUE', value: 'Rp 428.5M', change: '+12.4% vs bulan lalu', trend: 'up' },
  { label: 'TOTAL TRANSAKSI', value: '1,284', change: '+8.2% vs bulan lalu', trend: 'up' },
  { label: 'RATA-RATA NILAI PESANAN', value: 'Rp 333.700', change: '-2.1% vs bulan lalu', trend: 'down' },
  { label: 'GROSS MARGIN', value: '34.8%', change: '+1.3% vs bulan lalu', trend: 'up' }
]

const revenueTrend = [
  { label: 'Feb', value: 310 },
  { label: 'Mar', value: 355 },
  { label: 'Apr', value: 340 },
  { label: 'Mei', value: 380 },
  { label: 'Jun', value: 365 },
  { label: 'Jul', value: 428 }
]

const maxRevenue = computed(() => Math.max(...revenueTrend.map((m) => m.value)))

const topProducts = [
  { name: 'Amoxicillin 500mg', revenue: 'Rp 42.3M', percent: 100 },
  { name: 'Paracetamol 500mg', revenue: 'Rp 38.1M', percent: 90 },
  { name: 'Vitamin C 1000mg', revenue: 'Rp 29.7M', percent: 70 },
  { name: 'Antasida Tablet', revenue: 'Rp 24.2M', percent: 57 },
  { name: 'Betadine 60ml', revenue: 'Rp 18.5M', percent: 44 }
]

const categories = [
  { name: 'Obat Generik', pct: 42, color: '#2f8f70' },
  { name: 'Obat Resep', pct: 28, color: '#3d6fe0' },
  { name: 'Vitamin & Suplemen', pct: 18, color: '#e0a32c' },
  { name: 'Alat Kesehatan', pct: 12, color: '#8b5cf6' }
]

const staffPerformance = [
  { name: 'Budi Santoso', transactions: 342, total: 'Rp 98.2M' },
  { name: 'Andi Wijaya', transactions: 298, total: 'Rp 87.5M' },
  { name: 'Siti Rahma', transactions: 276, total: 'Rp 79.8M' }
]
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

.body {
  display: flex;
  align-items: stretch;
}

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

.main-content {
  flex: 1;
  padding: 26px 30px 40px;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.main-content h1 {
  margin: 0 0 4px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 24px;
  color: #17332a;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: #6c7d76;
}

.period-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.12);
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 12.5px;
  font-weight: 700;
  color: #33443d;
  cursor: pointer;
  white-space: nowrap;
}

.period-btn svg {
  width: 14px;
  height: 14px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid rgba(15, 107, 82, 0.08);
}

.stat-label {
  margin: 0 0 10px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #8a9a94;
}

.stat-value {
  margin: 0 0 10px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #17332a;
}

.stat-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
}

.stat-tag svg {
  width: 13px;
  height: 13px;
}

.stat-tag.up {
  color: #2f8f70;
}

.stat-tag.down {
  color: #c0392b;
}

.panels {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 18px;
  align-items: stretch;
  margin-bottom: 18px;
}

.chart-panel,
.products-panel,
.category-panel,
.staff-panel {
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.08);
  border-radius: 14px;
  padding: 22px;
}

.chart-panel h2,
.products-panel h2,
.category-panel h2,
.staff-panel h2 {
  margin: 0 0 20px;
  font-size: 13px;
  font-weight: 700;
  color: #17332a;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  height: 200px;
}

.bar-col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.bar-col-track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #eef1f0;
  overflow: hidden;
}

.bar-col-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #bfe6d8;
  transition: height 0.2s ease;
}

.bar-col-fill.current {
  background: #1d7a5f;
}

.bar-col-label {
  font-size: 11.5px;
  color: #8a9a94;
  font-weight: 600;
}

.bar-col:last-child .bar-col-label {
  color: #0f6b52;
  font-weight: 800;
}

/* Top products */
.product-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 10px;
}

.p-name {
  font-size: 12.5px;
  font-weight: 700;
  color: #33443d;
}

.p-value {
  font-size: 12.5px;
  font-weight: 700;
  color: #2f8f70;
  white-space: nowrap;
}

.bar-track {
  height: 7px;
  border-radius: 999px;
  background: #eef2f0;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2f8f70, #4fbf82);
}

.panels-secondary {
  align-items: stretch;
}

.stacked-bar {
  display: flex;
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 20px;
}

.stacked-seg {
  height: 100%;
}

.category-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
}

.category-legend li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #33443d;
}

.category-legend .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cat-name {
  flex: 1;
}

.cat-pct {
  font-weight: 700;
  color: #17332a;
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.staff-table th {
  text-align: left;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #8a9a94;
  padding: 0 0 10px;
  border-bottom: 1px solid rgba(15, 107, 82, 0.08);
}

.staff-table td {
  padding: 12px 0;
  color: #33443d;
  font-weight: 600;
  border-bottom: 1px solid rgba(15, 107, 82, 0.06);
}

.staff-table tr:last-child td {
  border-bottom: none;
}

.staff-table td.amount {
  color: #2f8f70;
  font-weight: 700;
}
</style>