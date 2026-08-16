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
        <h1>Main Dashboard</h1>

        <section class="stat-grid">
          <div class="stat-card">
            <div class="stat-label warn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L22 20H2L12 3Z" stroke="#D9534F" stroke-width="1.6" stroke-linejoin="round" />
                <line x1="12" y1="10" x2="12" y2="14" stroke="#D9534F" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="12" cy="17" r="1" fill="#D9534F" />
              </svg>
              <span>EXPIRY ALERT (&lt; 3 Months)</span>
            </div>
            <p class="stat-value red">12 Medicines</p>
            <span class="stat-tag red">Requires Action</span>
          </div>

          <div class="stat-card">
            <div class="stat-label warn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 12H10L8 22L20 10H13L12 2Z" fill="#E0A32C" />
              </svg>
              <span>LOW STOCK (Below ROP)</span>
            </div>
            <p class="stat-value amber">5 Items</p>
            <span class="stat-tag amber">Review Reorder</span>
          </div>

          <div class="stat-card">
            <div class="stat-label">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="#3A8" stroke-width="1.6" />
                <line x1="7" y1="9" x2="17" y2="9" stroke="#3A8" stroke-width="1.6" stroke-linecap="round" />
                <line x1="7" y1="13" x2="17" y2="13" stroke="#3A8" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <span>TOTAL INVENTORY VALUE</span>
            </div>
            <p class="stat-value green">Rp 145.20M</p>
            <span class="stat-tag green">Current Assets</span>
          </div>

          <div class="stat-card">
            <div class="stat-label">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H16V16H4V4Z" stroke="#2F6FE0" stroke-width="1.6" />
                <path d="M8 8H20V20H8V8Z" stroke="#2F6FE0" stroke-width="1.6" />
              </svg>
              <span>DRAFT AUTO-RESTOCK POs</span>
            </div>
            <p class="stat-value blue">2 Pending</p>
            <span class="stat-tag blue">Awaiting Approval</span>
          </div>
        </section>

        <section class="panels">
          <div class="heatmap-panel">
            <h2>VISUAL FEFO &amp; EXPIRY HEATMAP</h2>

            <div class="heatmap-body">
              <div class="heatmap-grid">
                <span
                  v-for="(cell, i) in heatmapCells"
                  :key="i"
                  class="cell"
                  :class="cell"
                ></span>
              </div>

              <div class="legend-card">
                <p class="legend-title">Average Expiry of<br />Medicines Stored</p>
                <div class="legend-item">
                  <span class="dot safe"></span> Safe (&gt;12M)
                </div>
                <div class="legend-item">
                  <span class="dot caution"></span> Caution (3-6M)
                </div>
                <div class="legend-item">
                  <span class="dot warning"></span> Warning (&lt;3M)
                </div>
                <div class="legend-item">
                  <span class="dot critical"></span> Critical (&lt;1M)
                </div>
              </div>
            </div>

            <button class="detail-btn">View Detailed Inventory</button>
          </div>

          <div class="restock-panel">
            <h2>DYNAMIC RESTOCKING SUGGESTIONS</h2>

            <ul class="restock-list">
              <li v-for="(item, i) in restockItems" :key="i">
                <span>{{ item.label }}</span>

                <span v-if="item.status === 'draft'" class="pill draft">Draft PO</span>
                <svg v-else-if="item.status === 'up'" class="trend up" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 17L17 6M17 6H8M17 6V15" stroke="#2F8F70" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else class="trend down" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 7L17 18M17 18H8M17 18V9" stroke="#D9534F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </li>
            </ul>

            <button class="approve-btn">Approve &amp; Send All POs to Suppliers</button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'

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

const heatmapCells = [
  'blank', 'safe', 'critical', 'safe', 'safe', 'safe', 'blank', 'blank', 'critical', 'safe',
  'caution', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank',
  'safe', 'blank', 'safe', 'safe', 'safe', 'safe', 'safe', 'blank', 'blank', 'blank',
  'safe', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank',
  'safe', 'blank', 'blank', 'critical', 'caution', 'critical', 'caution', 'blank', 'blank', 'blank',
  'safe', 'blank', 'critical', 'critical', 'caution', 'caution', 'caution', 'blank', 'blank', 'blank',
  'safe', 'blank', 'safe', 'safe', 'caution', 'safe', 'caution', 'blank', 'blank', 'blank',
  'safe', 'blank', 'safe', 'safe', 'caution', 'caution', 'caution', 'blank', 'blank', 'blank',
  'caution', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank',
  'caution', 'safe', 'safe', 'safe', 'safe', 'blank', 'safe', 'blank', 'blank', 'blank'
]

const restockItems = [
  { label: 'Amlodipine 5mg - Buy 50 Boxes', status: 'draft' },
  { label: 'Amlodipine 5mg - Buy 20 Boxes', status: 'up' },
  { label: 'Amlodipine 5mg - Buy 20 Boxes', status: 'down' },
  { label: 'Amlodipine 5mg - Buy 70 Boxes', status: 'up' },
  { label: 'Amlodipine 5mg - Buy 15 Boxes', status: 'up' },
  { label: 'Amlodipine 5mg - Buy 50 Boxes', status: 'down' },
  { label: 'Amlodipine 5mg - Buy 20 Boxes', status: 'up' }
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
}

.main-content h1 {
  margin: 0 0 18px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 22px;
  color: #17332a;
}

/* Stat cards */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid rgba(15, 107, 82, 0.08);
}

.stat-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #8a9a94;
  margin-bottom: 10px;
}

.stat-label svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.stat-value {
  margin: 0 0 10px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 700;
}

.stat-value.red { color: #d9534f; }
.stat-value.amber { color: #e0a32c; }
.stat-value.green { color: #2f8f70; }
.stat-value.blue { color: #2f6fe0; }

.stat-tag {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.stat-tag.red { color: #d9534f; background: rgba(217, 83, 79, 0.1); }
.stat-tag.amber { color: #e0a32c; background: rgba(224, 163, 44, 0.12); }
.stat-tag.green { color: #2f8f70; background: rgba(47, 143, 112, 0.1); }
.stat-tag.blue { color: #2f6fe0; background: rgba(47, 111, 224, 0.1); }

/* Panels */
.panels {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 18px;
  align-items: start;
}

.heatmap-panel {
  background: linear-gradient(160deg, #1d7a5f, #2f8f70);
  border-radius: 14px;
  padding: 22px;
}

.heatmap-panel h2,
.restock-panel h2 {
  margin: 0 0 18px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: white;
}

.restock-panel h2 {
  color: #17332a;
}

.heatmap-body {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.heatmap-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
}

.cell {
  aspect-ratio: 1;
  border-radius: 5px;
}

.cell.safe { background: #4fbf82; }
.cell.caution { background: #f2c94c; }
.cell.warning { background: #f0954d; }
.cell.critical { background: #ef6a6a; }
.cell.blank { background: rgba(255, 255, 255, 0.12); }

.legend-card {
  width: 168px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px;
  flex-shrink: 0;
}

.legend-title {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  line-height: 1.4;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot.safe { background: #4fbf82; }
.dot.caution { background: #f2c94c; }
.dot.warning { background: #f0954d; }
.dot.critical { background: #ef6a6a; }

.detail-btn {
  display: block;
  margin-left: auto;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.restock-panel {
  background: white;
  border-radius: 14px;
  padding: 22px;
  border: 1px solid rgba(15, 107, 82, 0.08);
  display: flex;
  flex-direction: column;
  min-height: 420px;
}

.restock-list {
  list-style: none;
  margin: 0 0 18px;
  padding: 0;
  flex: 1;
}

.restock-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid rgba(15, 107, 82, 0.07);
  font-size: 13px;
  color: #33443d;
}

.pill {
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.pill.draft {
  background: #2f8f70;
  color: white;
}

.trend {
  width: 16px;
  height: 16px;
}

.approve-btn {
  background: #2f8f70;
  border: none;
  color: white;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 13px;
  border-radius: 9px;
  cursor: pointer;
}
</style>