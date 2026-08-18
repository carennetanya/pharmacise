<template>
  <LoadingScreen v-if="isLoading" @done="isLoading = false" />

  <SelectRole v-else-if="!selectedRole" @select="handleRoleSelect" />

  <LoginPage v-else-if="!isLoggedIn" @login="handleLogin" />

  <template v-else-if="selectedRole === 'owner'">
    <AdminDashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" />
    <Inventory v-else-if="currentPage === 'inventory'" @navigate="currentPage = $event" />
    <Orders v-else-if="currentPage === 'orders'" @navigate="currentPage = $event" />
    <Suppliers v-else-if="currentPage === 'suppliers'" @navigate="currentPage = $event" />
    <Analytics v-else-if="currentPage === 'analytics'" @navigate="currentPage = $event" />
    <Settings v-else-if="currentPage === 'settings'" @navigate="currentPage = $event" />
  </template>

  <template v-else-if="selectedRole === 'cashier'">
    <CashierDashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" />
    <CashierTransaction v-else-if="currentPage === 'transaksi'" @navigate="currentPage = $event" />
    <CashierInventory v-else-if="currentPage === 'inventory'" @navigate="currentPage = $event" />
  </template>

  <template v-else-if="selectedRole === 'pharmacy-technician'">
    <StaffDashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" />
    <StaffInventory v-else-if="currentPage === 'inventory'" @navigate="currentPage = $event" />
    <StaffOrders v-else-if="currentPage === 'orders'" @navigate="currentPage = $event" />
  </template>

  <div v-else class="app">
    <RouterView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import SelectRole from './components/SelectRole.vue'
import LoginPage from './components/LoginPage.vue'
import AdminDashboard from './components/AdminDashboard.vue'
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

const isLoading = ref(true)
const selectedRole = ref(null)
const isLoggedIn = ref(false)
const currentPage = ref('dashboard')

function handleRoleSelect(roleId) {
  selectedRole.value = roleId
}

function handleLogin({ email, password }) {
  isLoggedIn.value = true
}
</script>

<style>
.app {
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
}
</style>