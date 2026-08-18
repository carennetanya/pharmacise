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
        <h1>Pengaturan</h1>
        <p class="page-sub">Kelola profil, informasi apotek, dan staf yang memiliki akses.</p>

        <div class="settings-layout">
          <div class="settings-nav">
            <button class="settings-tab" :class="{ active: tab === 'profile' }" @click="tab = 'profile'">
              Profile
            </button>
            <button class="settings-tab" :class="{ active: tab === 'pharmacy' }" @click="tab = 'pharmacy'">
              Info Apotek
            </button>
          </div>

          <div v-if="tab === 'profile'" class="settings-content">
            <div class="card">
              <h2>Profile Settings</h2>

              <div class="avatar-row">
                <div class="settings-avatar">A</div>
                <div>
                  <button class="link-btn">Ganti Foto</button>
                  <p class="hint">JPG atau PNG, maksimal 2MB</p>
                </div>
              </div>

              <div class="divider"></div>

              <div class="field-grid">
                <div class="field">
                  <label>Nama Lengkap</label>
                  <input v-model="profile.name" type="text" />
                </div>
                <div class="field">
                  <label>Email</label>
                  <input v-model="profile.email" type="email" />
                </div>
                <div class="field">
                  <label>Nomor Telepon</label>
                  <input v-model="profile.phone" type="text" />
                </div>
                <div class="field">
                  <label>Peran</label>
                  <input v-model="profile.role" type="text" />
                </div>
              </div>
            </div>

            <div class="card">
              <h2>Notifikasi</h2>

              <div class="toggle-row">
                <div>
                  <p class="toggle-label">Peringatan Stok Menipis</p>
                  <p class="toggle-desc">Dapatkan notifikasi saat stok obat hampir habis</p>
                </div>
                <button
                  class="toggle"
                  :class="{ on: notifications.lowStock }"
                  @click="notifications.lowStock = !notifications.lowStock"
                >
                  <span class="knob"></span>
                </button>
              </div>

              <div class="toggle-divider"></div>

              <div class="toggle-row">
                <div>
                  <p class="toggle-label">Peringatan Kedaluwarsa</p>
                  <p class="toggle-desc">Dapatkan notifikasi untuk obat yang mendekati kedaluwarsa</p>
                </div>
                <button
                  class="toggle"
                  :class="{ on: notifications.expiry }"
                  @click="notifications.expiry = !notifications.expiry"
                >
                  <span class="knob"></span>
                </button>
              </div>

              <div class="toggle-divider"></div>

              <div class="toggle-row">
                <div>
                  <p class="toggle-label">Ringkasan Email Mingguan</p>
                  <p class="toggle-desc">Terima ringkasan performa apotek setiap minggu</p>
                </div>
                <button
                  class="toggle"
                  :class="{ on: notifications.weeklyEmail }"
                  @click="notifications.weeklyEmail = !notifications.weeklyEmail"
                >
                  <span class="knob"></span>
                </button>
              </div>
            </div>

            <div class="actions-row">
              <button class="cancel-btn">Batal</button>
              <button class="save-btn" @click="saveProfile">Simpan Perubahan</button>
            </div>
          </div>

          <div v-else class="settings-content">
            <div class="card">
              <h2>Informasi Apotek</h2>

              <div class="avatar-row">
                <div class="settings-avatar logo">🏥</div>
                <div>
                  <button class="link-btn">Ganti Logo</button>
                  <p class="hint">SVG atau PNG dengan latar transparan</p>
                </div>
              </div>

              <div class="divider"></div>

              <div class="field-grid">
                <div class="field">
                  <label>Nama Apotek</label>
                  <input v-model="pharmacy.name" type="text" />
                </div>
                <div class="field">
                  <label>Nomor Telepon</label>
                  <input v-model="pharmacy.phone" type="text" />
                </div>
                <div class="field">
                  <label>Nomor Izin Apotek</label>
                  <input v-model="pharmacy.license" type="text" />
                </div>
                <div class="field">
                  <label>Email Apotek</label>
                  <input v-model="pharmacy.email" type="text" />
                </div>
                <div class="field wide">
                  <label>Alamat</label>
                  <input v-model="pharmacy.address" type="text" />
                </div>
              </div>
            </div>

            <div class="card">
              <div class="staff-header">
                <h3>Staf &amp; Akses</h3>
                <button class="add-staff-btn" @click="openAddStaff">+ Tambah Staf</button>
              </div>

              <table class="staff-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Peran</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in staff" :key="member.id">
                    <td class="name">{{ member.name }}</td>
                    <td><span class="role-pill" :class="member.role.toLowerCase()">{{ member.role }}</span></td>
                    <td class="muted">{{ member.email }}</td>
                    <td><span class="status-pill" :class="member.status">{{ member.status === 'active' ? 'Aktif' : 'Nonaktif' }}</span></td>
                    <td class="actions">
                      <button class="text-btn" @click="openEditStaff(member)">Edit</button>
                      <button class="text-btn danger" @click="openRemoveAccess(member)">Cabut Akses</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="actions-row">
              <button class="cancel-btn">Batal</button>
              <button class="save-btn" @click="savePharmacy">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <StaffModal
      v-if="staffModalOpen"
      :member="editingStaff"
      @close="staffModalOpen = false"
      @save="handleSaveStaff"
      @remove-access="openRemoveAccessFromForm"
    />

    <ConfirmModal
      v-if="removeAccessTarget"
      title="Cabut Akses Staf"
      :message="`Akses masuk untuk ${removeAccessTarget.name} akan dicabut dan tidak dapat digunakan lagi. Lanjutkan?`"
      confirm-label="Ya, Cabut Akses"
      danger
      @cancel="removeAccessTarget = null"
      @confirm="confirmRemoveAccess"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { ownerStore, addStaffMember, updateStaffMember, removeStaffAccess } from '../store/ownerStore'
import StaffModal from '../modals/StaffModal.vue'
import ConfirmModal from '../modals/ConfirmModal.vue'

const emit = defineEmits(['navigate'])

const activeNav = ref('settings')
const tab = ref('profile')

const staffModalOpen = ref(false)
const editingStaff = ref(null)
const removeAccessTarget = ref(null)

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

const profile = ref({
  name: 'Dr. Aris',
  email: 'aris@pharmacise.id',
  phone: '0812-3456-7890',
  role: 'Pharmacist in charge'
})

const notifications = ref({
  lowStock: true,
  expiry: true,
  weeklyEmail: false
})

const pharmacy = ref({
  name: 'Apotek Sehat Selalu',
  phone: '021-5550-1234',
  license: 'SIA-0421-JKT',
  email: 'admin@apoteksehatselalu.id',
  address: 'Jl. Melati Raya No. 12, Jakarta Selatan'
})

const staff = ownerStore.staff

function openAddStaff() {
  editingStaff.value = null
  staffModalOpen.value = true
}

function openEditStaff(member) {
  editingStaff.value = member
  staffModalOpen.value = true
}

function handleSaveStaff(payload) {
  if (payload.id) {
    updateStaffMember(payload.id, payload)
  } else {
    addStaffMember(payload)
  }
  staffModalOpen.value = false
}

function openRemoveAccess(member) {
  removeAccessTarget.value = member
}

function openRemoveAccessFromForm(id) {
  removeAccessTarget.value = staff.find((m) => m.id === id)
  staffModalOpen.value = false
}

function confirmRemoveAccess() {
  removeStaffAccess(removeAccessTarget.value.id)
  removeAccessTarget.value = null
}

function saveProfile() {
  window.alert('Profil berhasil disimpan.')
}

function savePharmacy() {
  window.alert('Informasi apotek berhasil disimpan.')
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
  outline: none;
  background: none;
  font-size: 13px;
  color: #223;
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
  padding: 26px 30px 60px;
}

.main-content h1 {
  margin: 0 0 4px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 22px;
  color: #17332a;
}

.page-sub {
  margin: 0 0 20px;
  font-size: 13px;
  color: #6c7d76;
}

.settings-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  align-items: start;
}

.settings-nav {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(15, 107, 82, 0.08);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-tab {
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #33443d;
  cursor: pointer;
}

.settings-tab.active {
  background: rgba(47, 143, 112, 0.12);
  color: #0f6b52;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(15, 107, 82, 0.08);
  padding: 24px;
}

.card h2 {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 700;
  color: #17332a;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.settings-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #2f8f70;
  color: white;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-avatar.logo {
  border-radius: 16px;
  background: #eef4f2;
  font-size: 26px;
}

.link-btn {
  background: none;
  border: none;
  color: #0f6b52;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.hint {
  margin: 4px 0 0;
  font-size: 11px;
  color: #8a9a94;
}

.divider {
  height: 1px;
  background: rgba(15, 107, 82, 0.1);
  margin: 20px 0;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field.wide {
  grid-column: 1 / -1;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6c7d76;
  margin-bottom: 6px;
}

.field input,
.add-staff-form select {
  width: 100%;
  border: 1px solid rgba(15, 107, 82, 0.15);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #223;
  outline: none;
  font-family: inherit;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.toggle-label {
  margin: 0 0 2px;
  font-size: 13px;
  font-weight: 700;
  color: #17332a;
}

.toggle-desc {
  margin: 0;
  font-size: 12px;
  color: #8a9a94;
}

.toggle-divider {
  height: 1px;
  background: rgba(15, 107, 82, 0.08);
  margin: 6px 0;
}

.toggle {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #d7dedc;
  border: none;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
}

.toggle .knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  transition: left 0.15s ease;
}

.toggle.on {
  background: #2f8f70;
}

.toggle.on .knob {
  left: 22px;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.15);
  color: #33443d;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 22px;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  background: #2f8f70;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 26px;
  border-radius: 8px;
  cursor: pointer;
}

.staff-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.staff-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #17332a;
}

.add-staff-btn {
  background: #2f8f70;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 12px;
  padding: 9px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.add-staff-form {
  display: grid;
  grid-template-columns: 1fr 1fr 140px auto;
  gap: 10px;
  margin-bottom: 18px;
  background: #f3f6f5;
  padding: 14px;
  border-radius: 10px;
}

.add-staff-form input {
  border: 1px solid rgba(15, 107, 82, 0.15);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

.add-staff-confirm {
  background: #0f6b52;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 12px;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table thead th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #6c7d76;
  padding: 10px 8px;
  border-bottom: 1px solid rgba(15, 107, 82, 0.08);
}

.staff-table tbody td {
  padding: 14px 8px;
  font-size: 13px;
  color: #33443d;
  border-bottom: 1px solid rgba(15, 107, 82, 0.06);
}

.staff-table tbody tr:last-child td {
  border-bottom: none;
}

.staff-table td.name {
  font-weight: 700;
}

.staff-table td.muted {
  color: #6c7d76;
}

.role-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(47, 143, 112, 0.12);
  color: #0f6b52;
}

.role-pill.cashier {
  background: rgba(38, 102, 204, 0.12);
  color: #2666cc;
}

.status-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.status-pill.active {
  background: rgba(47, 143, 112, 0.12);
  color: #2f8f70;
}

.status-pill.inactive {
  background: rgba(137, 150, 144, 0.15);
  color: #6c7d76;
}

.actions {
  display: flex;
  gap: 12px;
  white-space: nowrap;
}

.text-btn {
  background: none;
  border: none;
  color: #0f6b52;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.text-btn.danger {
  color: #d9534f;
}
</style>
