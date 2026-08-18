<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="form-modal">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Edit Supplier' : 'Add Supplier' }}</h2>
        <button class="close-btn" aria-label="Close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <p class="modal-sub">Lengkapi data distributor (PBF) untuk {{ isEdit ? 'memperbarui' : 'menambahkan' }} mitra pemasok.</p>

      <form @submit.prevent="handleSubmit">
        <div class="field-grid">
          <div class="field wide">
            <label>Nama Distributor (PBF)</label>
            <input v-model="form.name" type="text" placeholder="cth: PT Kimia Farma Trading" required />
          </div>
          <div class="field">
            <label>Kontak Person</label>
            <input v-model="form.contact" type="text" placeholder="cth: Hendra Saputra" required />
          </div>
          <div class="field">
            <label>No. Telepon</label>
            <input v-model="form.phone" type="text" placeholder="+62 21-5550-1122" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="nama@distributor.co.id" required />
          </div>
          <div class="field">
            <label>Produk Disuplai</label>
            <input v-model="form.products" type="text" placeholder="cth: 128 SKU" />
          </div>
          <div class="field wide">
            <label>Status Kemitraan</label>
            <select v-model="form.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button v-if="isEdit" type="button" class="delete-btn" @click="$emit('delete', supplier.id)">Hapus Supplier</button>
          <div class="spacer"></div>
          <button type="button" class="cancel-btn" @click="$emit('close')">Batal</button>
          <button type="submit" class="save-btn">{{ isEdit ? 'Simpan Perubahan' : 'Tambahkan Supplier' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  supplier: { type: Object, default: null }
})

const emit = defineEmits(['close', 'save', 'delete'])

const isEdit = computed(() => !!props.supplier)

const form = ref({
  name: props.supplier?.name || '',
  contact: props.supplier?.contact || '',
  phone: props.supplier?.phone || '',
  email: props.supplier?.email || '',
  products: props.supplier?.products || '',
  status: props.supplier?.status || 'Active'
})

function handleSubmit() {
  emit('save', { id: props.supplier?.id, ...form.value })
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
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
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
  font-size: 19px;
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
  font-size: 13px;
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
  color: #223;
  outline: none;
  font-family: inherit;
}

.field input:focus,
.field select:focus {
  border-color: #2f8f70;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 26px;
}

.spacer {
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  color: #d9534f;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
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
</style>
