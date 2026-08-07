<template>
  <LoadingScreen v-if="isLoading" @done="isLoading = false" />

  <SelectRole v-else-if="!selectedRole" @select="handleRoleSelect" />

  <div v-else class="app">
    <!-- konten utama sesuai role yang dipilih, misal <RouterView /> -->
    <RouterView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import SelectRole from './components/SelectRole.vue'
// import { RouterView } from 'vue-router' // hapus komentar ini kalau sudah pakai vue-router

const isLoading = ref(true)
const selectedRole = ref(null)

function handleRoleSelect(roleId) {
  selectedRole.value = roleId
  // simpan ke localStorage / pinia store kalau perlu dipakai di halaman lain
  // localStorage.setItem('role', roleId)
}
</script>

<style>
.app {
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
}
</style>