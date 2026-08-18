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
            <div v-if="pharmacyError" class="banner error-banner">{{ pharmacyError }}</div>
            <div v-if="pharmacySuccess" class="banner success-banner">{{ pharmacySuccess }}</div>

            <div class="card">
              <h2>Informasi Apotek</h2>

              <div v-if="loadingPharmacy" class="hint">Memuat data apotek...</div>

              <template v-else>
                <div class="logo-row">
                  <button
                    class="logo-upload-btn"
                    type="button"
                    aria-label="Ganti Logo"
                    :disabled="uploadingLogo"
                    @click="triggerLogoPicker"
                  >
                    <img v-if="pharmacy.logo_url" :src="pharmacy.logo_url" alt="Logo apotek" class="logo-preview" />
                    <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2.2" stroke-linecap="round" />
                    </svg>
                  </button>
                  <input
                    ref="logoInput"
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    class="hidden-file-input"
                    @change="handleLogoChange"
                  />
                  <div>
                    <button class="link-btn" type="button" :disabled="uploadingLogo" @click="triggerLogoPicker">
                      {{ uploadingLogo ? 'Mengunggah...' : 'Ganti Logo' }}
                    </button>
                    <p class="hint">Digunakan pada struk &amp; laporan</p>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="field-grid">
                  <div class="field">
                    <label>Nama Apotek</label>
                    <input v-model="pharmacy.name" type="text" />
                  </div>
                  <div class="field">
                    <label>Nomor Izin (SIA)</label>
                    <input v-model="pharmacy.license" type="text" />
                  </div>
                  <div class="field">
                    <label>Nomor Telepon</label>
                    <input v-model="pharmacy.phone" type="text" />
                  </div>
                  <div class="field">
                    <label>Email</label>
                    <input v-model="pharmacy.email" type="text" />
                  </div>
                  <div class="field wide">
                    <label>Alamat</label>
                    <input v-model="pharmacy.address" type="text" />
                  </div>
                </div>
              </template>
            </div>

            <div class="card">
              <div class="staff-header">
                <h3>Akun Staf &amp; Kasir</h3>
                <button class="add-staff-btn" :disabled="!pharmacyId" @click="openAddModal">+ Tambah Staf / Kasir</button>
              </div>

              <p v-if="!pharmacyId && !loadingPharmacy" class="hint">
                Simpan informasi apotek terlebih dahulu sebelum menambahkan staf.
              </p>
              <p v-else-if="loadingStaff" class="hint">Memuat daftar staf...</p>
              <p v-else-if="staff.length === 0" class="hint">Belum ada staf atau kasir yang ditambahkan.</p>

              <table v-else class="staff-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Peran</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in staff" :key="member.id">
                    <td class="name">{{ member.name }}</td>
                    <td><span class="role-pill" :class="member.role.toLowerCase()">{{ member.role }}</span></td>
                    <td class="muted">{{ member.email }}</td>
                    <td><span class="status-pill" :class="member.status">{{ member.status === 'active' ? 'Aktif' : 'Nonaktif' }}</span></td>
                    <td class="actions">
                      <button class="text-btn" @click="openEditModal(member)">Edit</button>
                      <button class="text-btn danger" @click="askRemoveStaff(member)">Hapus</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="actions-row">
              <button class="cancel-btn" type="button" :disabled="savingPharmacy" @click="loadPharmacyData">Batal</button>
              <button class="save-btn" :disabled="savingPharmacy || loadingPharmacy" @click="savePharmacy">
                {{ savingPharmacy ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add Staff / Cashier Modal -->
    <div v-if="addModalOpen" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Tambah Staf / Kasir Baru</h3>
            <p class="modal-sub">Buat akun login agar mereka dapat mengakses POS atau sistem inventaris.</p>
          </div>
          <button class="modal-close" @click="closeAddModal" aria-label="Tutup">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M6 18L18 6" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="field">
            <label>Nama Lengkap</label>
            <input v-model="newStaff.name" type="text" placeholder="cth. Dewi Anggraini" />
          </div>

          <div class="field">
            <label>Peran</label>
            <div class="role-select">
              <button
                type="button"
                class="role-card"
                :class="{ active: newStaff.role === 'Staff' }"
                @click="newStaff.role = 'Staff'"
              >
                <span class="role-card-title">Staff</span>
                <span class="role-card-desc">Teknisi Apotek</span>
              </button>
              <button
                type="button"
                class="role-card"
                :class="{ active: newStaff.role === 'Cashier' }"
                @click="newStaff.role = 'Cashier'"
              >
                <span class="role-card-title">Cashier</span>
                <span class="role-card-desc">Akses POS Saja</span>
              </button>
            </div>
          </div>

          <div class="field-grid two">
            <div class="field">
              <label>Email</label>
              <input v-model="newStaff.email" type="text" placeholder="nama@pharmacise.id" />
            </div>
            <div class="field">
              <label>Nomor Telepon</label>
              <input v-model="newStaff.phone" type="text" placeholder="+62 8xx-xxxx-xxxx" />
            </div>
          </div>

          <div class="field-grid two">
            <div class="field">
              <label>Kode PIN (untuk Login POS)</label>
              <input v-model="newStaff.pin" type="password" maxlength="4" placeholder="••••" />
            </div>
            <div class="field">
              <label>Konfirmasi PIN</label>
              <input v-model="newStaff.confirmPin" type="password" maxlength="4" placeholder="••••" />
            </div>
          </div>

          <div class="info-banner">
            Staff dapat mengelola inventaris &amp; pesanan. Cashier hanya dapat mengakses layar checkout POS.
          </div>

          <div v-if="addStaffError" class="banner error-banner">{{ addStaffError }}</div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" type="button" :disabled="addingStaff" @click="closeAddModal">Batal</button>
          <button class="save-btn" :disabled="addingStaff" @click="confirmAddStaff">
            {{ addingStaff ? 'Menambahkan...' : 'Tambah Akun' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Staff / Cashier Modal -->
    <div v-if="editModalOpen" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Edit Staf / Kasir</h3>
            <p class="modal-sub">Perbarui detail akun atau kelola akses untuk anggota tim ini.</p>
          </div>
          <button class="modal-close" @click="closeEditModal" aria-label="Tutup">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M6 18L18 6" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="field">
            <label>Nama Lengkap</label>
            <input v-model="editForm.name" type="text" />
          </div>

          <div class="field">
            <label>Peran</label>
            <div class="role-select">
              <button
                type="button"
                class="role-card"
                :class="{ active: editForm.role === 'Staff' }"
                @click="editForm.role = 'Staff'"
              >
                <span class="role-card-title">Staff</span>
                <span class="role-card-desc">Teknisi Apotek</span>
              </button>
              <button
                type="button"
                class="role-card"
                :class="{ active: editForm.role === 'Cashier' }"
                @click="editForm.role = 'Cashier'"
              >
                <span class="role-card-title">Cashier</span>
                <span class="role-card-desc">Akses POS Saja</span>
              </button>
            </div>
          </div>

          <div class="field-grid two">
            <div class="field">
              <label>Email</label>
              <input v-model="editForm.email" type="text" />
            </div>
            <div class="field">
              <label>Nomor Telepon</label>
              <input v-model="editForm.phone" type="text" />
            </div>
          </div>

          <div class="field-grid two">
            <div class="field">
              <label>Kode PIN (untuk Login POS)</label>
              <input v-model="editForm.pin" type="password" maxlength="4" placeholder="••••" />
            </div>
            <div class="field">
              <label>Konfirmasi PIN</label>
              <input v-model="editForm.confirmPin" type="password" maxlength="4" placeholder="••••" />
            </div>
          </div>
          <p class="pin-hint">Kosongkan untuk mempertahankan PIN saat ini</p>

          <div class="info-banner">
            Staff dapat mengelola inventaris &amp; pesanan. Cashier hanya dapat mengakses layar checkout POS.
          </div>

          <div v-if="editStaffError" class="banner error-banner">{{ editStaffError }}</div>
        </div>

        <div class="modal-footer spread">
          <button class="remove-access-btn" type="button" :disabled="savingEdit" @click="askRemoveStaff(editingMember)">Hapus Akses</button>
          <div class="modal-footer-right">
            <button class="cancel-btn" type="button" :disabled="savingEdit" @click="closeEditModal">Batal</button>
            <button class="save-btn" :disabled="savingEdit" @click="saveEditStaff">
              {{ savingEdit ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Access Confirmation Modal -->
    <div v-if="removeConfirmOpen" class="modal-overlay" @click.self="cancelRemoveStaff">
      <div class="modal-card small">
        <div class="warning-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01" stroke="#d9534f" stroke-width="2" stroke-linecap="round" />
            <circle cx="12" cy="12" r="9" stroke="#d9534f" stroke-width="1.8" />
          </svg>
        </div>
        <h3 class="confirm-title">Hapus Akses?</h3>
        <p class="confirm-text">
          Apakah Anda yakin ingin mencabut akses {{ memberToRemove ? memberToRemove.name : '' }}? Mereka tidak akan bisa lagi masuk ke PharmaCise.
        </p>
        <div v-if="removeStaffError" class="banner error-banner">{{ removeStaffError }}</div>
        <div class="modal-footer center">
          <button class="cancel-btn" type="button" :disabled="removingStaff" @click="cancelRemoveStaff">Batal</button>
          <button class="remove-confirm-btn" :disabled="removingStaff" @click="confirmRemoveStaff">
            {{ removingStaff ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import {
  fetchMyPharmacy,
  savePharmacyInfo,
  uploadPharmacyLogo,
  fetchStaff,
  addStaffMember,
  updateStaffMember,
  setStaffPin,
  removeStaffAccess
} from '../services/pharmacySettings'

const emit = defineEmits(['navigate'])

const activeNav = ref('settings')
const tab = ref('profile')

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

// ---------------------------------------------------------------------------
// Info Apotek — pharmacy profile + staff/cashier accounts (Supabase-backed)
// ---------------------------------------------------------------------------

const pharmacyId = ref(null)
const pharmacy = ref({
  name: '',
  phone: '',
  license: '',
  email: '',
  address: '',
  logo_url: null
})

const loadingPharmacy = ref(false)
const savingPharmacy = ref(false)
const pharmacyError = ref('')
const pharmacySuccess = ref('')

const staff = ref([])
const loadingStaff = ref(false)

const logoInput = ref(null)
const uploadingLogo = ref(false)

function pharmacyRowToForm(row) {
  return {
    name: row.name || '',
    phone: row.phone || '',
    license: row.license_number || '',
    email: row.email || '',
    address: row.address || '',
    logo_url: row.logo_url || null
  }
}

async function loadPharmacyData() {
  loadingPharmacy.value = true
  pharmacyError.value = ''
  pharmacySuccess.value = ''
  try {
    const row = await fetchMyPharmacy()
    if (row) {
      pharmacyId.value = row.id
      pharmacy.value = pharmacyRowToForm(row)
      await loadStaffData()
    } else {
      pharmacyId.value = null
      pharmacy.value = { name: '', phone: '', license: '', email: '', address: '', logo_url: null }
      staff.value = []
    }
  } catch (err) {
    pharmacyError.value = err.message || 'Gagal memuat data apotek.'
  } finally {
    loadingPharmacy.value = false
  }
}

async function savePharmacy() {
  savingPharmacy.value = true
  pharmacyError.value = ''
  pharmacySuccess.value = ''
  try {
    const row = await savePharmacyInfo({ ...pharmacy.value, id: pharmacyId.value })
    pharmacyId.value = row.id
    pharmacy.value = pharmacyRowToForm(row)
    pharmacySuccess.value = 'Informasi apotek berhasil disimpan.'
    if (staff.value.length === 0) await loadStaffData()
  } catch (err) {
    pharmacyError.value = err.message || 'Gagal menyimpan informasi apotek.'
  } finally {
    savingPharmacy.value = false
  }
}

function triggerLogoPicker() {
  if (uploadingLogo.value) return
  logoInput.value?.click()
}

async function handleLogoChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  uploadingLogo.value = true
  pharmacyError.value = ''
  try {
    const publicUrl = await uploadPharmacyLogo(file)
    pharmacy.value.logo_url = publicUrl
    // Persist immediately so a refresh doesn't lose the new logo.
    if (pharmacyId.value) {
      await savePharmacy()
    }
  } catch (err) {
    pharmacyError.value = err.message || 'Gagal mengunggah logo.'
  } finally {
    uploadingLogo.value = false
  }
}

async function loadStaffData() {
  if (!pharmacyId.value) return
  loadingStaff.value = true
  try {
    staff.value = await fetchStaff(pharmacyId.value)
  } catch (err) {
    pharmacyError.value = err.message || 'Gagal memuat daftar staf.'
  } finally {
    loadingStaff.value = false
  }
}

function emptyStaffForm() {
  return { name: '', role: 'Staff', email: '', phone: '', pin: '', confirmPin: '' }
}

function validatePinPair(pin, confirmPin, { required }) {
  if (!pin && !confirmPin && !required) return null
  if (!/^[0-9]{4}$/.test(pin || '')) return 'PIN harus terdiri dari 4 digit angka.'
  if (pin !== confirmPin) return 'Konfirmasi PIN tidak cocok.'
  return null
}

// Add Staff / Cashier modal
const addModalOpen = ref(false)
const newStaff = ref(emptyStaffForm())
const addingStaff = ref(false)
const addStaffError = ref('')

function openAddModal() {
  newStaff.value = emptyStaffForm()
  addStaffError.value = ''
  addModalOpen.value = true
}

function closeAddModal() {
  if (addingStaff.value) return
  addModalOpen.value = false
}

async function confirmAddStaff() {
  addStaffError.value = ''

  if (!newStaff.value.name.trim() || !newStaff.value.email.trim()) {
    addStaffError.value = 'Nama dan email wajib diisi.'
    return
  }
  const pinError = validatePinPair(newStaff.value.pin, newStaff.value.confirmPin, { required: true })
  if (pinError) {
    addStaffError.value = pinError
    return
  }
  if (!pharmacyId.value) {
    addStaffError.value = 'Simpan informasi apotek terlebih dahulu.'
    return
  }

  addingStaff.value = true
  try {
    const row = await addStaffMember({
      pharmacyId: pharmacyId.value,
      name: newStaff.value.name,
      email: newStaff.value.email,
      phone: newStaff.value.phone,
      role: newStaff.value.role,
      pin: newStaff.value.pin
    })
    staff.value.push(row)
    addModalOpen.value = false
  } catch (err) {
    addStaffError.value = err.message || 'Gagal menambahkan staf.'
  } finally {
    addingStaff.value = false
  }
}

// Edit Staff / Cashier modal
const editModalOpen = ref(false)
const editForm = ref(emptyStaffForm())
const editingMember = ref(null)
const savingEdit = ref(false)
const editStaffError = ref('')

function openEditModal(member) {
  editingMember.value = member
  editForm.value = {
    name: member.name,
    role: member.role,
    email: member.email,
    phone: member.phone || '',
    pin: '',
    confirmPin: ''
  }
  editStaffError.value = ''
  editModalOpen.value = true
}

function closeEditModal() {
  if (savingEdit.value) return
  editModalOpen.value = false
  editingMember.value = null
}

async function saveEditStaff() {
  if (!editingMember.value) return
  editStaffError.value = ''

  if (!editForm.value.name.trim() || !editForm.value.email.trim()) {
    editStaffError.value = 'Nama dan email wajib diisi.'
    return
  }
  const pinError = validatePinPair(editForm.value.pin, editForm.value.confirmPin, { required: false })
  if (pinError) {
    editStaffError.value = pinError
    return
  }

  savingEdit.value = true
  try {
    const updated = await updateStaffMember(editingMember.value.id, {
      name: editForm.value.name,
      email: editForm.value.email,
      phone: editForm.value.phone,
      role: editForm.value.role
    })
    if (editForm.value.pin) {
      await setStaffPin(editingMember.value.id, editForm.value.pin)
    }
    Object.assign(editingMember.value, updated)
    editModalOpen.value = false
    editingMember.value = null
  } catch (err) {
    editStaffError.value = err.message || 'Gagal menyimpan perubahan.'
  } finally {
    savingEdit.value = false
  }
}

// Remove access confirmation
const removeConfirmOpen = ref(false)
const memberToRemove = ref(null)
const removingStaff = ref(false)
const removeStaffError = ref('')

function askRemoveStaff(member) {
  if (!member) return
  memberToRemove.value = member
  removeStaffError.value = ''
  removeConfirmOpen.value = true
  editModalOpen.value = false
}

function cancelRemoveStaff() {
  if (removingStaff.value) return
  removeConfirmOpen.value = false
  memberToRemove.value = null
}

async function confirmRemoveStaff() {
  if (!memberToRemove.value) return
  removingStaff.value = true
  removeStaffError.value = ''
  try {
    await removeStaffAccess(memberToRemove.value.id)
    staff.value = staff.value.filter((m) => m.id !== memberToRemove.value.id)
    removeConfirmOpen.value = false
    memberToRemove.value = null
  } catch (err) {
    removeStaffError.value = err.message || 'Gagal menghapus akses staf.'
  } finally {
    removingStaff.value = false
  }
}

function saveProfile() {
  window.alert('Profil berhasil disimpan.')
}

onMounted(() => {
  loadPharmacyData()
})
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

.logo-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logo-upload-btn {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #2f8f70;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0;
}

.logo-upload-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.logo-upload-btn svg {
  width: 22px;
  height: 22px;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden-file-input {
  display: none;
}

.link-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.banner {
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 600;
}

.error-banner {
  background: rgba(217, 83, 79, 0.1);
  color: #d9534f;
}

.success-banner {
  background: rgba(47, 143, 112, 0.12);
  color: #0f6b52;
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

.field-grid.two {
  margin-bottom: 0;
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
  background: rgba(124, 58, 237, 0.12);
  color: #7c3aed;
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

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 30, 25, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}

.modal-card {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 26px;
}

.modal-card.small {
  max-width: 400px;
  text-align: center;
  padding: 30px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
  color: #17332a;
}

.modal-sub {
  margin: 0;
  font-size: 12px;
  color: #8a9a94;
  max-width: 420px;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.role-select {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.role-card {
  border: 1.5px solid rgba(15, 107, 82, 0.15);
  border-radius: 10px;
  background: white;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.role-card.active {
  border-color: #2f8f70;
  background: rgba(47, 143, 112, 0.06);
}

.role-card-title {
  font-size: 13px;
  font-weight: 700;
  color: #17332a;
}

.role-card.active .role-card-title {
  color: #0f6b52;
}

.role-card-desc {
  font-size: 11px;
  color: #8a9a94;
}

.pin-hint {
  margin: -10px 0 0;
  font-size: 11px;
  color: #8a9a94;
}

.info-banner {
  background: rgba(38, 102, 204, 0.08);
  color: #2666cc;
  font-size: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
}

.modal-footer.spread {
  justify-content: space-between;
  align-items: center;
}

.modal-footer.center {
  justify-content: center;
}

.modal-footer-right {
  display: flex;
  gap: 12px;
}

.remove-access-btn {
  background: rgba(217, 83, 79, 0.1);
  border: none;
  color: #d9534f;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.remove-confirm-btn {
  background: #d9534f;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 22px;
  border-radius: 8px;
  cursor: pointer;
}

.warning-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(217, 83, 79, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.warning-icon svg {
  width: 24px;
  height: 24px;
}

.confirm-title {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 700;
  color: #17332a;
}

.confirm-text {
  margin: 0;
  font-size: 13px;
  color: #6c7d76;
  line-height: 1.5;
}
</style>