<template>
  <div class="login-page">
    <div class="left-panel">
      <nav class="navbar">
        <img src="/logo.png" alt="Pharmacise logo" class="logo-icon" />
        <span class="brand">PHARMACISE</span>
      </nav>

      <div class="mascot-area">
        <div class="glow"></div>
        <img src="/mascot.png" alt="Pharmacise mascot" class="mascot" />
      </div>
    </div>
    <div class="right-panel">
      <div class="form-wrap">
        <h1>Welcome back!</h1>
        <p class="subtitle">Enter your credentials to access your account.</p>

        <form @submit.prevent="handleSubmit">
          <label class="field-label" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="field-input"
            placeholder="example@gmail.com"
            required
          />

          <label class="field-label" for="password">Password</label>
          <div class="password-wrap">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="........"
              required
            />
            <button
              type="button"
              class="toggle-visibility"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C3.6 7.5 7.4 5 12 5C16.6 5 20.4 7.5 22 12C20.4 16.5 16.6 19 12 19C7.4 19 3.6 16.5 2 12Z" stroke="white" stroke-width="1.6" />
                <circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.6" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C3.6 7.5 7.4 5 12 5C16.6 5 20.4 7.5 22 12C20.4 16.5 16.6 19 12 19C7.4 19 3.6 16.5 2 12Z" stroke="white" stroke-width="1.6" />
                <circle cx="12" cy="12" r="3" stroke="white" stroke-width="1.6" />
                <line x1="3" y1="21" x2="21" y2="3" stroke="white" stroke-width="1.6" />
              </svg>
            </button>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Memproses...' : 'Log In' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

defineProps({
  errorMessage: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)

function handleSubmit() {
  emit('login', { email: email.value, password: password.value })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  font-family: 'Nunito', sans-serif;
  background: #f7fbfa;
}

/* Left panel */
.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7fbfa;
}

.navbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 40px;
  border-bottom: 1px solid rgba(15, 107, 82, 0.1);
}

.logo-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.brand {
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #0f6b52;
  font-size: 14px;
}

.mascot-area {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glow {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(45, 179, 149, 0.28) 0%, rgba(45, 179, 149, 0.1) 45%, rgba(45, 179, 149, 0) 70%);
  filter: blur(30px);
  pointer-events: none;
}

.mascot {
  position: relative;
  width: 240px;
  height: auto;
  display: block;
  animation: float-mascot 4s ease-in-out infinite;
}

@keyframes float-mascot {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Right panel */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #1d7a5f, #2f8f70 60%, #3aa383);
  border-radius: 32px 0 0 32px;
  padding: 40px;
}

.form-wrap {
  width: 100%;
  max-width: 360px;
}

.form-wrap h1 {
  margin: 0;
  color: white;
  font-family: 'Poppins', 'Nunito', sans-serif;
  font-size: 30px;
  font-weight: 800;
  text-align: center;
}

.subtitle {
  margin: 8px 0 36px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  text-align: center;
}

.field-label {
  display: block;
  color: white;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 14px;
  margin-bottom: 22px;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.field-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.field-input[type='password']::-ms-reveal,
.field-input[type='password']::-ms-clear {
  display: none;
}

.field-input[type='password']::-webkit-textfield-decoration-container {
  display: none;
}

.field-input:focus {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.2);
}

.password-wrap {
  position: relative;
}

.password-wrap .field-input {
  padding-right: 44px;
}

.toggle-visibility {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: -11px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-visibility svg {
  width: 18px;
  height: 18px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: white;
  color: #1d7a5f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.error-message {
  margin: -8px 0 16px;
  color: #ffd6d6;
  font-size: 12px;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  .right-panel {
    border-radius: 32px 32px 0 0;
  }
  .mascot-area {
    padding: 20px 0;
  }
}
</style>