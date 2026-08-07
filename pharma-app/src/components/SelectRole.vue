<template>
  <div class="select-role-page">
    <nav class="navbar">
      <span class="brand">PHARMACISE</span>
    </nav>

    <div class="main">
      <div class="hero">
        <div class="glow"></div>
        <div class="hero-content">
          <h1>Select Role</h1>
          <p>Pick your role to get started with your daily tasks.</p>
        </div>
      </div>

      <div class="role-grid">
        <button
          v-for="role in roles"
          :key="role.id"
          class="role-card"
          @click="selectRole(role)"
        >
          <h2>{{ role.title }}</h2>
          <p>{{ role.description }}</p>
          <span class="arrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L18 12L6 20V4Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['select'])

const roles = [
  {
    id: 'owner',
    title: 'Owner',
    description: 'Manages all operational policies and financial decisions with full access.'
  },
  {
    id: 'pharmacy-technician',
    title: 'Pharmacy Technician',
    description: 'A daily operational role focused on medicine stock movement and prescription preparation.'
  },
  {
    id: 'cashier',
    title: 'Cashier',
    description: 'Processes final patient transactions and operates the POS system.'
  }
]

function selectRole(role) {
  emit('select', role.id)
}
</script>

<style scoped>
.select-role-page {
  min-height: 100vh;
  background: #f7fbfa;
  display: flex;
  flex-direction: column;
  animation: fade-in 0.6s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.navbar {
  border-bottom: 1px solid rgba(15, 107, 82, 0.1);
  padding: 20px 40px;
}

.brand {
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  color: #0f6b52;
  font-size: 14px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 100px;
}

.hero {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 20px 40px;
}

.glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 640px;
  height: 640px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(45, 179, 149, 0.35) 0%, rgba(45, 179, 149, 0.15) 35%, rgba(45, 179, 149, 0) 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-content {
  position: relative;
  text-align: center;
}

.hero-content h1 {
  margin: 0;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 44px;
  color: #0f6b52;
}

.hero-content p {
  margin: 10px 0 0;
  font-size: 14px;
  color: #4b9c85;
}

.role-grid {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 0 40px;
  flex-wrap: wrap;
}

.role-card {
  position: relative;
  width: 260px;
  min-height: 170px;
  background: #ffffff;
  border: 1px solid rgba(15, 107, 82, 0.15);
  border-radius: 14px;
  padding: 24px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  font-family: 'Nunito', sans-serif;
}

.role-card:hover {
  border-color: #14b88a;
  box-shadow: 0 8px 24px rgba(20, 184, 138, 0.15);
  transform: translateY(-2px);
}

.role-card h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f6b52;
}

.role-card p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #5b7d73;
  flex: 1;
}

.arrow {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(20, 184, 138, 0.12);
  color: #0f6b52;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow svg {
  width: 12px;
  height: 12px;
}
</style>