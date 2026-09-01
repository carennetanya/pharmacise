import { reactive } from 'vue'

export const sessionStore = reactive({
  user: null,
  staff: null,
  pharmacy: null,
  role: null
})

export function setSession(access) {
  sessionStore.user = access.user
  sessionStore.staff = access.staff || null
  sessionStore.pharmacy = access.pharmacy || null
  sessionStore.role = access.role
}

export function clearSession() {
  sessionStore.user = null
  sessionStore.staff = null
  sessionStore.pharmacy = null
  sessionStore.role = null
}
