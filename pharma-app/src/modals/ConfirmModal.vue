<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="confirm-modal">
      <div class="confirm-icon" :class="{ danger }">
        <svg v-if="danger" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L22 20H2L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
          <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          <circle cx="12" cy="16.2" r="1" fill="currentColor" />
        </svg>
      </div>

      <h2>{{ title }}</h2>
      <p class="confirm-message">{{ message }}</p>

      <div class="confirm-actions">
        <button class="cancel-btn" @click="$emit('cancel')">{{ cancelLabel }}</button>
        <button class="confirm-btn" :class="{ danger }" @click="$emit('confirm')">{{ confirmLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Apakah Anda yakin ingin melanjutkan tindakan ini?' },
  confirmLabel: { type: String, default: 'Ya, Lanjutkan' },
  cancelLabel: { type: String, default: 'Batal' },
  danger: { type: Boolean, default: false }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 30, 27, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.confirm-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  font-family: 'Nunito', sans-serif;
}

.confirm-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: rgba(47, 143, 112, 0.12);
  color: #2f8f70;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-icon svg {
  width: 26px;
  height: 26px;
}

.confirm-icon.danger {
  background: rgba(217, 83, 79, 0.12);
  color: #d9534f;
}

.confirm-modal h2 {
  margin: 0 0 8px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #17332a;
}

.confirm-message {
  margin: 0;
  font-size: 13px;
  color: #6c7d76;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.cancel-btn {
  flex: 1;
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.15);
  color: #33443d;
  font-weight: 700;
  font-size: 13px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.confirm-btn {
  flex: 1;
  background: #2f8f70;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 13px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.confirm-btn.danger {
  background: #d9534f;
}
</style>
