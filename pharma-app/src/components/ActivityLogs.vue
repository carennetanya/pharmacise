<template>
  <div class="activity-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">AUDIT TRAIL</p>
        <h1>Recent Activity Logs</h1>
        <p class="subtitle">Riwayat login dan logout akun Staff & Cashier.</p>
      </div>
      <button class="back-button" type="button" @click="$emit('navigate', 'dashboard')">Kembali ke Dashboard</button>
    </header>

    <section class="log-panel">
      <div v-if="loading" class="empty-state">Memuat aktivitas...</div>
      <div v-else-if="errorMessage" class="empty-state error">{{ errorMessage }}</div>
      <div v-else-if="logs.length === 0" class="empty-state">Belum ada aktivitas login atau logout.</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Akun</th>
              <th>Role</th>
              <th>Aktivitas</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>
                <strong>{{ log.staff_name }}</strong>
                <span>{{ log.staff_email }}</span>
              </td>
              <td>{{ log.staff_role }}</td>
              <td><span class="action" :class="log.action">{{ log.action === 'login' ? 'Login' : 'Logout' }}</span></td>
              <td>{{ formatDate(log.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchAuthActivityLogs } from '../services/activityLogService'

const emit = defineEmits(['navigate'])
const logs = ref([])
const loading = ref(true)
const errorMessage = ref('')

function formatDate(value) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

onMounted(async () => {
  try {
    logs.value = await fetchAuthActivityLogs()
  } catch (error) {
    errorMessage.value = error.message || 'Log aktivitas gagal dimuat.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.activity-page {
  min-height: 100vh;
  padding: 42px 52px;
  background: #eef4f2;
  color: #18342d;
  font-family: 'Nunito', sans-serif;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin: 0 auto 24px;
  max-width: 1120px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2b9577;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

h1 {
  margin: 0;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 28px;
}

.subtitle {
  margin: 8px 0 0;
  color: #6b7f78;
  font-size: 14px;
}

.back-button {
  border: 1px solid #c8ddd6;
  border-radius: 8px;
  padding: 11px 16px;
  background: white;
  color: #247e68;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.log-panel {
  overflow: hidden;
  max-width: 1120px;
  margin: 0 auto;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 22px rgba(24, 70, 58, 0.06);
}

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 680px; }
th, td { padding: 17px 22px; border-bottom: 1px solid #e6efec; text-align: left; font-size: 13px; }
th { color: #6d807a; font-size: 11px; letter-spacing: .5px; text-transform: uppercase; }
td strong, td span { display: block; }
td span { margin-top: 4px; color: #7b8c86; font-size: 12px; }
.action { width: fit-content; margin: 0; border-radius: 999px; padding: 5px 10px; font-weight: 800; }
.action.login { background: #e5f5ef; color: #188063; }
.action.logout { background: #fff0e3; color: #a56a24; }
.empty-state { padding: 60px 24px; color: #71847d; text-align: center; }
.empty-state.error { color: #c65050; }

@media (max-width: 700px) {
  .activity-page { padding: 28px 18px; }
  .page-header { flex-direction: column; }
}
</style>
