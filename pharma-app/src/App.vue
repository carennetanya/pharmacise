<template>
  <LoadingScreen v-if="isLoading" @done="handleLoadingDone" />

  <SelectRole v-else-if="!selectedRole" @select="handleRoleSelect" />

  <LoginPage
    v-else-if="!isLoggedIn"
    :error-message="loginError"
    :loading="loginLoading"
    @login="handleLogin"
  />

  <template v-else-if="selectedRole === 'owner'">
    <AdminDashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" @logout="handleLogout" />
    <ActivityLogs v-else-if="currentPage === 'activity-logs'" @navigate="currentPage = $event" @logout="handleLogout" />
    <Inventory v-else-if="currentPage === 'inventory'" @navigate="currentPage = $event" @logout="handleLogout" />
    <Orders v-else-if="currentPage === 'orders'" @navigate="currentPage = $event" @logout="handleLogout" />
    <Suppliers v-else-if="currentPage === 'suppliers'" @navigate="currentPage = $event" @logout="handleLogout" />
    <Analytics v-else-if="currentPage === 'analytics'" @navigate="currentPage = $event" @logout="handleLogout" />
    <Settings v-else-if="currentPage === 'settings'" @navigate="currentPage = $event" @logout="handleLogout" />
  </template>

  <template v-else-if="selectedRole === 'cashier'">
    <CashierDashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" @logout="handleLogout" />
    <CashierTransaction v-else-if="currentPage === 'transaksi'" @navigate="currentPage = $event" @logout="handleLogout" />
    <CashierInventory v-else-if="currentPage === 'inventory'" @navigate="currentPage = $event" @logout="handleLogout" />
  </template>

  <template v-else-if="selectedRole === 'pharmacy-technician'">
    <StaffDashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" @logout="handleLogout" />
    <StaffInventory v-else-if="currentPage === 'inventory'" @navigate="currentPage = $event" @logout="handleLogout" />
    <StaffOrders v-else-if="currentPage === 'orders'" @navigate="currentPage = $event" @logout="handleLogout" />
  </template>

  <div v-else class="app">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import SelectRole from './components/SelectRole.vue'
import LoginPage from './components/LoginPage.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import ActivityLogs from './components/ActivityLogs.vue'
import Inventory from './components/Inventory.vue'
import Orders from './components/Orders.vue'
import Suppliers from './components/Suppliers.vue'
import Analytics from './components/Analytics.vue'
import Settings from './components/Settings.vue'
import CashierDashboard from './components/CashierDashboard.vue'
import CashierTransaction from './components/CashierTransaction.vue'
import CashierInventory from './components/CashierInventory.vue'
import StaffDashboard from './components/StaffDashboard.vue'
import StaffInventory from './components/StaffInventory.vue'
import StaffOrders from './components/StaffOrders.vue'
import { signIn } from './services/authService'
import { clearSession, setSession } from './store/sessionStore'

const isLoading = ref(true)
const authReady = ref(false)
const loadingAnimationDone = ref(false)
const selectedRole = ref(null)
const isLoggedIn = ref(false)
const loginLoading = ref(false)
const loginError = ref('')
const currentPage = ref('dashboard')

function finishLoadingIfReady() {
  if (authReady.value && loadingAnimationDone.value) {
    isLoading.value = false
  }
}

function handleLoadingDone() {
  loadingAnimationDone.value = true
  finishLoadingIfReady()
}

function handleRoleSelect(roleId) {
  selectedRole.value = roleId
  loginError.value = ''
}

function applyAccess(access) {
  setSession(access)
  selectedRole.value = access.role
  isLoggedIn.value = true
  currentPage.value = 'dashboard'
}

function handleLogout() {
  clearSession()
  isLoggedIn.value = false
  selectedRole.value = null
  currentPage.value = 'dashboard'
}

async function handleLogin({ email, password }) {
  loginLoading.value = true
  loginError.value = ''

  try {
    const access = await signIn(email, password)
    if (access.role !== selectedRole.value) {
      throw new Error('Role yang dipilih tidak sesuai dengan akun ini.')
    }
    applyAccess(access)
  } catch (error) {
    loginError.value = error.message || 'Login gagal.'
  } finally {
    loginLoading.value = false
  }
}

onMounted(() => {
  authReady.value = true
  finishLoadingIfReady()
})
</script>

<style>
.app {
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
}
</style>