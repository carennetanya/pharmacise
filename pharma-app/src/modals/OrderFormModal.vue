<template>
  <div class="modal-overlay" @click.self="handleOverlayClose">
    <div class="form-modal">
      <template v-if="step === 'form'">
        <div class="modal-header">
          <h2>Buat Pesanan Baru</h2>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="modal-sub">Susun Purchase Order (PO) untuk dikirimkan ke distributor pilihan Anda.</p>

        <div class="field-grid">
          <div class="field wide">
            <label>Distributor (PBF)</label>
            <select v-model="form.distributor" required>
              <option value="" disabled>Pilih distributor</option>
              <option v-for="s in suppliers" :key="s.id" :value="s.name">{{ s.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Estimasi Tiba</label>
            <input v-model="form.eta" type="text" placeholder="cth: 2 Ags 2026" />
          </div>
          <div class="field">
            <label>Catatan (opsional)</label>
            <input v-model="form.note" type="text" placeholder="cth: Prioritaskan stok kritis" />
          </div>
        </div>

        <div class="items-header">
          <h3>Item Pesanan</h3>
          <button type="button" class="add-row-btn" @click="addRow">+ Tambah Item</button>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Nama Obat</th>
              <th>Qty</th>
              <th>Harga Satuan</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in form.items" :key="i">
              <td><input v-model="row.name" type="text" placeholder="Nama obat" /></td>
              <td><input v-model.number="row.qty" type="number" min="1" /></td>
              <td><input v-model.number="row.price" type="number" min="0" /></td>
              <td class="subtotal">{{ formatCurrency(row.qty * row.price) }}</td>
              <td>
                <button type="button" class="remove-row-btn" @click="removeRow(i)">✕</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="total-row">
          <span>Total Estimasi</span>
          <span class="total-value">{{ formatCurrency(orderTotal) }}</span>
        </div>

        <div class="modal-actions">
          <div class="spacer"></div>
          <button type="button" class="cancel-btn" @click="$emit('close')">Batal</button>
          <button type="button" class="save-btn" :disabled="!canContinue" @click="step = 'confirm'">Lanjut ke Konfirmasi</button>
        </div>
      </template>

      <template v-else-if="step === 'confirm'">
        <div class="modal-header">
          <h2>Konfirmasi &amp; Simpan</h2>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="modal-sub">Periksa kembali detail pesanan sebelum dikirimkan ke distributor.</p>

        <div class="summary-card">
          <div class="summary-line"><span>Distributor</span><strong>{{ form.distributor }}</strong></div>
          <div class="summary-line"><span>Estimasi Tiba</span><strong>{{ form.eta || '-' }}</strong></div>
          <div class="summary-line" v-if="form.note"><span>Catatan</span><strong>{{ form.note }}</strong></div>
        </div>

        <table class="items-table readonly">
          <thead>
            <tr>
              <th>Nama Obat</th>
              <th>Qty</th>
              <th>Harga Satuan</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in form.items" :key="i">
              <td>{{ row.name }}</td>
              <td>{{ row.qty }}</td>
              <td>{{ formatCurrency(row.price) }}</td>
              <td class="subtotal">{{ formatCurrency(row.qty * row.price) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-row">
          <span>Total Estimasi</span>
          <span class="total-value">{{ formatCurrency(orderTotal) }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="step = 'form'">Kembali</button>
          <div class="spacer"></div>
          <button type="button" class="save-btn" @click="submitOrder">Konfirmasi &amp; Kirim PO</button>
        </div>
      </template>

      <template v-else-if="step === 'saving'">
        <div class="loading-state">
          <div class="spinner"></div>
          <h2>Menyimpan Pesanan...</h2>
          <p class="modal-sub">Mengirimkan PO ke {{ form.distributor }}.</p>
        </div>
      </template>

      <template v-else>
        <div class="success-state">
          <div class="success-icon">✓</div>
          <h2>Pesanan Berhasil Dibuat</h2>
          <p class="modal-sub">PO ke {{ form.distributor }} telah tersimpan dan menunggu approval.</p>
          <button type="button" class="save-btn full" @click="$emit('close')">Selesai</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ownerStore } from '../store/ownerStore'

const emit = defineEmits(['close', 'created'])

const step = ref('form')
const suppliers = ownerStore.suppliers

const form = ref({
  distributor: '',
  eta: '',
  note: '',
  items: [{ name: '', qty: 1, price: 0 }]
})

const orderTotal = computed(() =>
  form.value.items.reduce((sum, row) => sum + (Number(row.qty) || 0) * (Number(row.price) || 0), 0)
)

const canContinue = computed(() => {
  if (!form.value.distributor) return false
  return form.value.items.some((row) => row.name.trim() && row.qty > 0)
})

function addRow() {
  form.value.items.push({ name: '', qty: 1, price: 0 })
}

function removeRow(i) {
  if (form.value.items.length === 1) return
  form.value.items.splice(i, 1)
}

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function submitOrder() {
  step.value = 'saving'
  setTimeout(() => {
    emit('created', {
      distributor: form.value.distributor,
      eta: form.value.eta || 'Menunggu Konfirmasi',
      total: formatCurrency(orderTotal.value),
      items: form.value.items.filter((row) => row.name.trim())
    })
    step.value = 'done'
  }, 1400)
}

function handleOverlayClose() {
  if (step.value === 'form' || step.value === 'confirm') {
    emit('close')
  }
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
  max-width: 640px;
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
  margin-bottom: 22px;
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

.items-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.items-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #17332a;
}

.add-row-btn {
  background: none;
  border: none;
  color: #0f6b52;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
  padding: 0;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 14px;
}

.items-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #6c7d76;
  padding: 8px 6px;
  border-bottom: 1px solid rgba(15, 107, 82, 0.1);
}

.items-table td {
  padding: 6px;
  border-bottom: 1px solid rgba(15, 107, 82, 0.06);
  font-size: 13px;
}

.items-table.readonly td {
  padding: 10px 6px;
  color: #33443d;
}

.items-table input {
  width: 100%;
  border: 1px solid rgba(15, 107, 82, 0.15);
  border-radius: 6px;
  padding: 7px 8px;
  font-size: 12.5px;
  outline: none;
  font-family: inherit;
}

.items-table td.subtotal {
  font-weight: 700;
  color: #17332a;
  white-space: nowrap;
}

.remove-row-btn {
  background: none;
  border: none;
  color: #d9534f;
  cursor: pointer;
  font-size: 13px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #17332a;
}

.total-value {
  font-size: 17px;
  font-family: 'Poppins', 'Nunito', sans-serif;
}

.summary-card {
  background: #f3f6f5;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6c7d76;
  padding: 4px 0;
}

.summary-line strong {
  color: #17332a;
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

.save-btn.full {
  width: 100%;
}

.loading-state,
.success-state {
  text-align: center;
  padding: 30px 10px;
}

.loading-state h2,
.success-state h2 {
  margin: 18px 0 4px;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 17px;
  color: #17332a;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(47, 143, 112, 0.15);
  border-top-color: #2f8f70;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(47, 143, 112, 0.12);
  color: #2f8f70;
  font-size: 26px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
