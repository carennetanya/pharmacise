<template>
  <div class="modal-overlay" @click.self="handleOverlayClose">
    <div class="form-modal">
      <template v-if="step === 'capture'">
        <div class="modal-header">
          <h2>Scan Faktur (OCR)</h2>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="modal-sub">Ambil foto faktur pembelian atau unggah gambar untuk dibaca otomatis dengan OCR.</p>

        <div class="capture-options">
          <label class="capture-card">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8C4 6.9 4.9 6 6 6H7.5L8.5 4H15.5L16.5 6H18C19.1 6 20 6.9 20 8V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V8Z" stroke="#2f8f70" stroke-width="1.7" stroke-linejoin="round" />
              <circle cx="12" cy="12.5" r="3.4" stroke="#2f8f70" stroke-width="1.7" />
            </svg>
            <span class="capture-title">Ambil Foto</span>
            <span class="capture-hint">Gunakan kamera perangkat</span>
            <input type="file" accept="image/*" capture="environment" class="hidden-input" @change="handleFile" />
          </label>

          <label class="capture-card">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V3M12 3L7 8M12 3L17 8" stroke="#2f8f70" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M4 15V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15" stroke="#2f8f70" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="capture-title">Unggah Gambar</span>
            <span class="capture-hint">Pilih dari galeri / file</span>
            <input type="file" accept="image/*" class="hidden-input" @change="handleFile" />
          </label>
        </div>

        <div class="modal-actions">
          <div class="spacer"></div>
          <button type="button" class="cancel-btn" @click="$emit('close')">Batal</button>
        </div>
      </template>

      <template v-else-if="step === 'preview'">
        <div class="modal-header">
          <h2>Pratinjau Faktur</h2>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="modal-sub">Pastikan gambar faktur jelas dan seluruh tabel item terlihat sebelum diproses.</p>

        <div class="preview-frame">
          <img :src="imagePreview" alt="Pratinjau faktur" />
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="step = 'capture'">Ambil Ulang</button>
          <div class="spacer"></div>
          <button type="button" class="save-btn" @click="startProcessing">Proses dengan OCR</button>
        </div>
      </template>

      <template v-else-if="step === 'processing'">
        <div class="loading-state">
          <div class="spinner"></div>
          <h2>Membaca Faktur...</h2>
          <p class="modal-sub">{{ loadingMessages[loadingIndex] }}</p>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </template>

      <template v-else-if="step === 'review'">
        <div class="modal-header">
          <h2>Review Hasil OCR</h2>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#6c7d76" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="modal-sub">Periksa dan perbaiki data hasil pembacaan otomatis sebelum stok diperbarui.</p>

        <div class="field-grid">
          <div class="field">
            <label>No. Faktur</label>
            <input v-model="invoice.invoiceNo" type="text" />
          </div>
          <div class="field">
            <label>Tanggal Faktur</label>
            <input v-model="invoice.date" type="text" />
          </div>
          <div class="field wide">
            <label>Distributor (PBF)</label>
            <select v-model="invoice.distributor">
              <option value="" disabled>Pilih distributor</option>
              <option v-for="s in ownerStore.suppliers" :key="s.id" :value="s.name">{{ s.name }}</option>
            </select>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Nama Obat</th>
              <th>Batch</th>
              <th>Qty Diterima</th>
              <th>Harga Satuan</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in items" :key="i" :class="{ 'row-warn': row.confidence < 85 }">
              <td><input v-model="row.name" type="text" /></td>
              <td><input v-model="row.batch" type="text" /></td>
              <td><input v-model.number="row.qty" type="number" min="0" /></td>
              <td><input v-model.number="row.price" type="number" min="0" /></td>
              <td>
                <span class="confidence-pill" :class="{ low: row.confidence < 85 }">{{ row.confidence }}%</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="total-row">
          <span>Total Faktur</span>
          <span class="total-value">{{ formatCurrency(invoiceTotal) }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="step = 'capture'">Scan Ulang</button>
          <div class="spacer"></div>
          <button type="button" class="save-btn" :disabled="!invoice.distributor" @click="step = 'confirm'">Lanjut ke Konfirmasi</button>
        </div>
      </template>

      <template v-else-if="step === 'confirm'">
        <div class="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7L12 3L20 7V17L12 21L4 17V7Z" stroke="#2f8f70" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
        </div>
        <h2 class="confirm-title">Konfirmasi Penerimaan Barang</h2>
        <p class="modal-sub center">
          {{ items.length }} item dari faktur <strong>{{ invoice.invoiceNo || '-' }}</strong> ({{ invoice.distributor }}) akan menambah stok inventory Anda.
        </p>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="step = 'review'">Kembali</button>
          <div class="spacer"></div>
          <button type="button" class="save-btn" @click="submitReceipt">Konfirmasi &amp; Simpan</button>
        </div>
      </template>

      <template v-else-if="step === 'saving'">
        <div class="loading-state">
          <div class="spinner"></div>
          <h2>Memperbarui Stok...</h2>
          <p class="modal-sub">Menyimpan penerimaan barang ke inventory.</p>
        </div>
      </template>

      <template v-else>
        <div class="success-state">
          <div class="success-icon">✓</div>
          <h2>Penerimaan Barang Tersimpan</h2>
          <p class="modal-sub">Stok untuk {{ items.length }} item telah diperbarui di inventory.</p>
          <button type="button" class="save-btn full" @click="$emit('close')">Selesai</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ownerStore } from '../store/ownerStore'

const emit = defineEmits(['close', 'received'])

const step = ref('capture')
const imagePreview = ref('')
const progress = ref(0)
const loadingIndex = ref(0)

const invoice = ref({
  invoiceNo: '',
  date: '',
  distributor: ''
})

const items = ref([])

const loadingMessages = [
  'Mendeteksi tepi & orientasi dokumen...',
  'Membersihkan noise pada gambar...',
  'Mengenali teks pada faktur (OCR)...',
  'Mengidentifikasi nama produk & kuantitas...',
  'Mencocokkan produk dengan data SKU...',
  'Menghitung subtotal & PPN...',
  'Menyusun draft penerimaan barang...'
]

const invoiceTotal = computed(() =>
  items.value.reduce((sum, row) => sum + (Number(row.qty) || 0) * (Number(row.price) || 0), 0)
)

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function handleFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = reader.result
    step.value = 'preview'
  }
  reader.readAsDataURL(file)
}

function startProcessing() {
  step.value = 'processing'
  progress.value = 0
  loadingIndex.value = 0

  const totalDuration = 3600
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
      invoice.value = {
        invoiceNo: `INV-${Math.floor(10000 + Math.random() * 89999)}`,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        distributor: ownerStore.suppliers[0]?.name || ''
      }
      items.value = [
        { name: 'Paracetamol 500mg', batch: 'PC0521', qty: 200, price: 2500, confidence: 96 },
        { name: 'Amoxicillin 500mg', batch: 'AM0521', qty: 100, price: 12000, confidence: 91 },
        { name: 'Vitamin C 1000mg', batch: 'VC0521', qty: 60, price: 18500, confidence: 78 }
      ]
      step.value = 'review'
    }
  }

  requestAnimationFrame(tick)
}

function submitReceipt() {
  step.value = 'saving'
  setTimeout(() => {
    emit('received', { items: items.value, meta: invoice.value })
    step.value = 'done'
  }, 1400)
}

function handleOverlayClose() {
  if (step.value === 'capture' || step.value === 'review') {
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
  text-align: left;
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

.modal-sub.center {
  text-align: center;
}

.capture-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.capture-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 1.5px solid rgba(47, 143, 112, 0.25);
  border-radius: 12px;
  padding: 30px 16px;
  cursor: pointer;
  background: #f7fbfa;
  text-align: center;
}

.capture-card:hover {
  border-color: #2f8f70;
}

.capture-card svg {
  width: 30px;
  height: 30px;
  margin-bottom: 8px;
}

.capture-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #17332a;
}

.capture-hint {
  font-size: 11.5px;
  color: #8a9a94;
}

.hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.preview-frame {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(15, 107, 82, 0.12);
  max-height: 340px;
  display: flex;
  justify-content: center;
  background: #eef2f0;
}

.preview-frame img {
  max-width: 100%;
  max-height: 340px;
  object-fit: contain;
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
  width: 240px;
  height: 4px;
  background: rgba(15, 107, 82, 0.12);
  border-radius: 999px;
  overflow: hidden;
  margin: 18px auto 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #14b88a, #0d8f6b);
  border-radius: 999px;
  transition: width 0.1s linear;
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

.confirm-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: rgba(47, 143, 112, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-icon svg {
  width: 28px;
  height: 28px;
}

.confirm-title {
  margin: 0 0 6px;
  text-align: center;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #17332a;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
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

.confidence-pill {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(47, 143, 112, 0.12);
  color: #2f8f70;
  white-space: nowrap;
}

.confidence-pill.low {
  background: rgba(224, 163, 44, 0.16);
  color: #b8940f;
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
</style>
