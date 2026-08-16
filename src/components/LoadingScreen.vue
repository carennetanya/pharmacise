<template>
  <div class="loading-screen">
    <div class="glow"></div>

    <div class="content">
      <div class="logo-row">
        <img src="/logo.png" alt="Pharmacise logo" class="logo-icon" />
        <div class="brand-text">
          <h1>PHARMACISE</h1>
          <p class="cn">问医</p>
        </div>
      </div>

      <div class="loading-info">
        <span>Loading...</span>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  duration: { type: Number, default: 2200 } // ms
})
const emit = defineEmits(['done'])

const progress = ref(0)
let rafId = null
let startTime = null

function tick(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  progress.value = Math.min(100, (elapsed / props.duration) * 100)

  if (progress.value < 100) {
    rafId = requestAnimationFrame(tick)
  } else {
    setTimeout(() => emit('done'), 200)
  }
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fbfa;
  overflow: hidden;
  z-index: 9999;
}

.glow {
  position: absolute;
  width: 620px;
  height: 620px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(45, 179, 149, 0.35) 0%, rgba(45, 179, 149, 0.12) 45%, rgba(45, 179, 149, 0) 70%);
  filter: blur(10px);
  pointer-events: none;
  animation: float-glow 6s ease-in-out infinite;
}

@keyframes float-glow {
  0% {
    transform: translate(-40px, -20px) scale(1);
  }
  25% {
    transform: translate(30px, 20px) scale(1.08);
  }
  50% {
    transform: translate(10px, -30px) scale(0.95);
  }
  75% {
    transform: translate(-30px, 15px) scale(1.05);
  }
  100% {
    transform: translate(-40px, -20px) scale(1);
  }
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.logo-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.brand-text h1 {
  margin: 0;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #0f6b52;
}

.brand-text .cn {
  margin: 2px 0 0;
  font-size: 12px;
  color: #4b9c85;
  letter-spacing: 4px;
  text-align: center;
}

.loading-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.loading-info span {
  font-size: 12px;
  color: #6b8f84;
  font-family: 'Nunito', sans-serif;
}

.progress-track {
  width: 160px;
  height: 3px;
  background: rgba(15, 107, 82, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #14b88a, #0d8f6b);
  border-radius: 999px;
  transition: width 0.1s linear;
}
</style>