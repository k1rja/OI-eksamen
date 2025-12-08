// src/stores/authState.js
import { ref, computed } from 'vue'

// 'guest' | 'user' | 'admin'
export const role = ref('guest')

export const isLoggedIn = computed(() => role.value !== 'guest')

export function loginAsUser () {
  role.value = 'user'
}

export function loginAsAdmin () {
  role.value = 'admin'
}

export function logout () {
  role.value = 'guest'
}