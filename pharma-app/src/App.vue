<template>
  <LoadingScreen v-if="isLoading" @done="isLoading = false" />

  <SelectRole v-else-if="!selectedRole" @select="handleRoleSelect" />

  <LoginPage v-else-if="!isLoggedIn" @login="handleLogin" />

  <template v-else-if="selectedRole === 'owner'">
    <AdminDashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" />
    <Inventory v-else-if="currentPage === 'inventory'" @navigate="currentPage = $event" />
    <Orders v-else-if="currentPage === 'orders'" @navigate="currentPage = $event" />
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