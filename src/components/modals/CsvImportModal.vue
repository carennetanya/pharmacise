<template>
  <div class="modal-overlay" @click.self="handleOverlayClose">
    <div class="form-modal">
      <template v-if="step === 'select'">
        <div class="modal-header">
          <h2>Import {{ entityLabel }} via CSV</h2>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="modal-sub">Unggah file CSV berisi {{ entityType === 'inventory' ? 'data obat' : 'data item pesanan' }} untuk diimpor sekaligus.</p>

        <label class="dropzone" :class="{ dragging: isDragging }" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15V3M12 3L7 8M12 3L17 8" stroke="#2f8f70" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 15V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15" stroke="#2f8f70" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="dropzone-title">Klik untuk pilih file atau seret file CSV ke sini</p>
          <p class="dropzone-hint">Format .csv, maksimal 5MB</p>
          <input type="file" accept=".csv" class="hidden-input" @change="handleFileInput" />
        </label>

        <button type="button" class="template-btn" @click="downloadTemplate">⬇ Unduh Template CSV</button>

        <div class="modal-actions">
          <div class="spacer"></div>
          <button type="button" class="cancel-btn" @click="$emit('close')">Batal</button>
        </div>
      </template>

      <template v-else-if="step === 'parsing'">
        <div class="loading-state">
          <div class="spinner"></div>
          <h2>Memproses File CSV</h2>
          <p class="modal-sub">{{ loadingMessages[loadingIndex] }}</p>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="file-name">{{ fileName }}</p>
        </div>
      </template>

      <template v-else-if="step === 'review'">
        <div class="modal-header">
          <h2>Review &amp; Validasi Data</h2>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="modal-sub">Periksa hasil pembacaan file sebelum data disimpan ke {{ entityLabel.toLowerCase() }}.</p>

        <div class="review-summary">
          <div class="summary-chip ok">{{ validCount }} Baris Valid</div>
          <div class="summary-chip warn">{{ warningCount }} Perlu Diperiksa</div>
          <div class="summary-chip total">{{ rows.length }} Total Baris</div>
        </div>

        <div v-if="entityType === 'orders'" class="field wide distributor-field">
          <label>Distributor Tujuan</label>
          <select v-model="distributor" required>
            <option value="" disabled>Pilih distributor</option>
            <option v-for="s in ownerStore.suppliers" :key="s.id" :value="s.name">{{ s.name }}</option>
          </select>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Nama Obat</th>
              <th>Batch</th>
              <th>{{ entityType === 'inventory' ? 'Stok' : 'Qty' }}</th>
              <th>Harga</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="i" :class="{ 'row-warn': row.status === 'warning' }">
              <td><input v-model="row.name" type="text" /></td>
              <td><input v-model="row.batch" type="text" /></td>
              <td><input v-model.number="row.qty" type="number" min="0" /></td>
              <td><input v-model.number="row.price" type="number" min="0" /></td>
              <td>
                <span class="status-pill" :class="row.status">{{ row.status === 'warning' ? 'Perlu Diperiksa' : 'Valid' }}</span>
              </td>
              <td>
                <button type="button" class="remove-row-btn" @click="rows.splice(i, 1)">✕</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="step = 'select'">Kembali</button>
          <div class="spacer"></div>
          <button type="button" class="save-btn" :disabled="!canSave" @click="confirmSave">Konfirmasi &amp; Simpan</button>
        </div>
      </template>

      <template v-else-if="step === 'saving'">
        <div class="loading-state">
          <div class="spinner"></div>
          <h2>Menyimpan Data...</h2>
          <p class="modal-sub">Menulis {{ rows.length }} baris ke {{ entityLabel.toLowerCase() }}.</p>
        </div>
      </template>

      <template v-else>
        <div class="success-state">
          <div class="success-icon">✓</div>
          <h2>Import Berhasil</h2>
          <p class="modal-sub">{{ rows.length }} baris data {{ entityLabel.toLowerCase() }} berhasil disimpan.</p>
          <button type="button" class="save-btn full" @click="$emit('close')">Selesai</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ownerStore } from '../../store/ownerStore'

const props = defineProps({
  entityType: { type: String, default: 'inventory' } // 'inventory' | 'orders'
})

const emit = defineEmits(['close', 'imported'])

const step = ref('select')
const isDragging = ref(false)
const fileName = ref('')
const progress = ref(0)
const loadingIndex = ref(0)
const rows = ref([])
const distributor = ref('')

const entityLabel = computed(() => (props.entityType === 'inventory' ? 'Inventory' : 'Item Pesanan'))

const loadingMessages = [
  'Membaca isi file CSV...',
  'Memvalidasi kolom & format data...',
  'Mencocokkan referensi SKU / Batch...',
  'Menyusun ringkasan hasil impor...'
]

const validCount = computed(() => rows.value.filter((r) => r.status !== 'warning').length)
const warningCount = computed(() => rows.value.filter((r) => r.status === 'warning').length)
const canSave = computed(() => {
  if (rows.value.length === 0) return false
  if (props.entityType === 'orders' && !distributor.value) return false
  return true
})

function handleFileInput(e) {
  const file = e.target.files?.[0]
  if (file) startParsing(file.name)
}

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) startParsing(file.name)
}

function mockInventoryRows() {
  return [
    { name: 'Cetirizine 10mg', batch: 'CT0521', qty: 250, price: 3200, status: 'ok' },
    { name: 'Omeprazole 20mg', batch: 'OM0521', qty: 180, price: 6700, status: 'ok' },
    { name: 'Ibuprofen 400mg', batch: 'IB0521', qty: 40, price: 4100, status: 'warning' },
    { name: 'Metformin 500mg', batch: 'MF0521', qty: 320, price: 5200, status: 'ok' },
    { name: 'Loratadine 10mg', batch: 'LR0521', qty: 12, price: 3800, status: 'warning' }
  ]
}

function mockOrderRows() {
  return [
    { name: 'Paracetamol 500mg', batch: 'PC0421', qty: 300, price: 2500, status: 'ok' },
    { name: 'Amoxicillin 500mg', batch: 'AM0421', qty: 150, price: 12000, status: 'ok' },
    { name: 'Vitamin C 1000mg', batch: 'VC0421', qty: 90, price: 18500, status: 'warning' }
  ]
}

function startParsing(name) {
  fileName.value = name
  step.value = 'parsing'
  progress.value = 0
  loadingIndex.value = 0

  const totalDuration = 2600
  const startTime = performance.now()

  function tick(now) {
    const elapsed = now - startTime
    progress.value = Math.min(100, (elapsed / totalDuration) * 100)
    loadingIndex.value = Math.min(
      loadingMessages.length - 1,
      Math.floor((elapsed / totalDuration) * loadingMessages.length)
    )

    if (progress.value < 100) {
      requestAnimationFrame(tick)
    } else {
      rows.value = (props.entityType === 'inventory' ? mockInventoryRows() : mockOrderRows()).map((r) => ({ ...r }))
      step.value = 'review'
    }
  }

  requestAnimationFrame(tick)
}

function confirmSave() {
  step.value = 'saving'
  setTimeout(() => {
    emit('imported', { rows: rows.value, distributor: distributor.value })
    step.value = 'done'
  }, 1300)
}

function downloadTemplate() {
  const header =
    props.entityType === 'inventory'
      ? 'name,batch,category,expired,stock,unit,price\n'
      : 'name,batch,qty,price\n'
  const blob = new Blob([header], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.entityType === 'inventory' ? 'template-inventory.csv' : 'template-order-items.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function handleOverlayClose() {
  if (step.value === 'select' || step.value === 'review') {
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
  max-width: 680px;
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

.dropzone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 2px dashed rgba(47, 143, 112, 0.35);
  border-radius: 12px;
  padding: 36px 20px;
  cursor: pointer;
  text-align: center;
  background: #f7fbfa;
}

.dropzone.dragging {
  border-color: #2f8f70;
  background: rgba(47, 143, 112, 0.08);
}

.dropzone svg {
  width: 28px;
  height: 28px;
  margin-bottom: 6px;
}

.dropzone-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #17332a;
}

.dropzone-hint {
  margin: 0;
  font-size: 11.5px;
  color: #8a9a94;
}

.hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.template-btn {
  display: block;
  margin: 14px auto 0;
  background: none;
  border: none;
  color: #0f6b52;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
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
  padding: 26px 10px;
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

.progress-track {
  width: 220px;
  height: 4px;
  background: rgba(15, 107, 82, 0.12);
  border-radius: 999px;
  overflow: hidden;
  margin: 18px auto 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #14b88a, #0d8f6b);
  border-radius: 999px;
  transition: width 0.1s linear;
}

.file-name {
  margin: 0;
  font-size: 11.5px;
  color: #8a9a94;
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

.review-summary {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.summary-chip {
  font-size: 12px;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 999px;
}

.summary-chip.ok {
  background: rgba(47, 143, 112, 0.12);
  color: #2f8f70;
}

.summary-chip.warn {
  background: rgba(224, 163, 44, 0.16);
  color: #b8940f;
}

.summary-chip.total {
  background: #eef2f0;
  color: #6c7d76;
}

.distributor-field {
  margin-bottom: 16px;
}

.distributor-field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6c7d76;
  margin-bottom: 6px;
}

.distributor-field select {
  width: 100%;
  border: 1px solid rgba(15, 107, 82, 0.15);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
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

.items-table tr.row-warn {
  background: rgba(224, 163, 44, 0.06);
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

.status-pill {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.status-pill.ok {
  background: rgba(47, 143, 112, 0.12);
  color: #2f8f70;
}

.status-pill.warning {
  background: rgba(224, 163, 44, 0.16);
  color: #b8940f;
}

.remove-row-btn {
  background: none;
  border: none;
  color: #d9534f;
  cursor: pointer;
  font-size: 13px;
}
</style>
