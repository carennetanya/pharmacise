<template>
  <div ref="menuRef" class="profile-menu-wrap">
    <button class="profile-trigger" type="button" @click="isOpen = !isOpen">
      <div class="avatar">{{ initials }}</div>
      <div class="profile-text">
        <span class="role">{{ roleLabel }}</span>
        <span class="name">{{ displayName }}</span>
      </div>
      <svg class="chevron" :class="{ open: isOpen }" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div v-if="isOpen" class="profile-dropdown">
      <div class="dropdown-identity">
        <strong>{{ displayName }}</strong>
        <span>{{ email }}</span>
        <span>{{ phone }}</span>
        <span>Dibuat {{ accountCreatedAt }}</span>
      </div>
      <div class="dropdown-divider"></div>
      <button type="button" class="logout-button" @click="handleLogout">Log out</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { signOut } from '../services/authService'
import { clearSession, sessionStore } from '../store/sessionStore'

const emit = defineEmits(['logout'])
const isOpen = ref(false)
const menuRef = ref(null)

const displayName = computed(() => sessionStore.staff?.name || sessionStore.user?.user_metadata?.full_name || 'Owner')
const email = computed(() => sessionStore.staff?.email || sessionStore.user?.email || '')
const phone = computed(() => sessionStore.staff?.phone || sessionStore.user?.user_metadata?.phone || 'Nomor telepon belum diisi')
const accountCreatedAt = computed(() => {
  const createdAt = sessionStore.user?.created_at
  if (!createdAt) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(createdAt))
})
const initials = computed(() => displayName.value.trim().charAt(0).toUpperCase() || 'U')
const roleLabel = computed(() => {
  if (sessionStore.role === 'cashier') return 'Cashier'
  if (sessionStore.role === 'pharmacy-technician') return 'Pharmacy Technician'
  return 'Owner'
})

function closeOnOutsideClick(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) isOpen.value = false
}

async function handleLogout() {
  try {
    await signOut()
  } finally {
    clearSession()
    emit('logout')
  }
}

onMounted(() => document.addEventListener('click', closeOnOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutsideClick))
</script>

<style scoped>
.profile-menu-wrap {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #218f7a;
  color: white;
  font-weight: 800;
}

.profile-text {
  display: flex;
  flex-direction: column;
  min-width: 112px;
}

.role {
  color: #6b7d76;
  font-size: 11px;
}

.name {
  color: #182b25;
  font-size: 13px;
  font-weight: 800;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.15s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 50;
  width: 220px;
  padding: 14px;
  border: 1px solid #dce7e3;
  border-radius: 10px;
  background: white;
  box-shadow: 0 12px 30px rgba(20, 53, 45, 0.16);
}

.dropdown-identity {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-identity strong {
  color: #182b25;
  font-size: 13px;
}

.dropdown-identity span {
  overflow: hidden;
  color: #70817b;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  margin: 12px 0;
  background: #e6eeeb;
}

.logout-button {
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: 7px;
  background: #fff1f1;
  color: #d9534f;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  text-align: left;
}
</style>
