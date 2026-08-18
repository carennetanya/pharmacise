<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="form-modal">
      <div class="modal-header">
        <h2>Sesuaikan Stok</h2>
        <button class="close-btn" aria-label="Close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <p class="modal-sub">{{ item.name }} · Batch {{ item.batch }} · Stok saat ini {{ item.stock }}</p>

      <form @submit.prevent="handleSubmit">
        <div class="field-grid">
          <div class="field">
            <label>Jenis Pergerakan</label>
            <select v-model="form.direction">
              <option value="in">Stok Masuk (+)</option>
              <option value="out">Stok Keluar (-)</option>
            </select>
          </div>
          <div class="field">
            <label>Jumlah</label>
            <input v-model.number="form.qty" type="number" min="1" required />
          </div>
          <div class="field wide">
            <label>Alasan</label>
            <select v-model="form.reason">
              <option value="Penyiapan Resep">Penyiapan Resep (Prescription Prep)</option>
              <option value="Penerimaan Barang">Penerimaan Barang</option>
              <option value="Stok Rusak/Kedaluwarsa">Stok Rusak / Kedaluwarsa</option>
              <option value="Koreksi Stok Opname">Koreksi Stok Opname</option>
            </select>
          </div>
        </div>

        <div class="preview-line">
          Stok setelah penyesuaian: <strong>{{ resultStock }}</strong>
        </div>

        <div class="modal-actions">
          <div class="spacer"></div>
          <button type="button" class="cancel-btn" @click="$emit('close')">Batal</button>
          <button type="submit" class="save-btn" :disabled="resultStock < 0">Simpan Penyesuaian</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['close', 'save'])

const form = ref({ direction: 'out', qty: 1, reason: 'Penyiapan Resep' })

const resultStock = computed(() => {
  const delta = form.value.direction === 'in' ? Number(form.value.qty) || 0 : -(Number(form.value.qty) || 0)
  return props.item.stock + delta
})

function handleSubmit() {
  emit('save', { id: props.item.id, stock: resultStock.value, reason: form.value.reason })
}
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

.form-modal {
  background: white;
  border-radius: 16px;
  padding: 28px 32px 32px;
  width: 100%;
  max-width: 460px;
  font-family: 'Nunito', sans-serif;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #17332a;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.modal-sub {
  margin: 6px 0 22px;
  font-size: 12.5px;
  color: #6c7d76;
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
.field select {
  width: 100%;
  border: 1px solid rgba(15, 107, 82, 0.15);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

.preview-line {
  margin-top: 16px;
  font-size: 12.5px;
  color: #6c7d76;
}

.preview-line strong {
  color: #17332a;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
}

.spacer {
  flex: 1;
}

.cancel-btn {
  background: white;
  border: 1px solid rgba(15, 107, 82, 0.15);
  color: #33443d;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  background: #2f8f70;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
