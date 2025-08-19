import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),
  persist: true,  // requires @pinia/plugin-persistedstate
  actions: {
    async login({ username, password }) {
      const config = useNuxtApp().$config
      const res = await $fetch(`${config.public.BACKEND_URL}/api/accounts/token/`, {
        method: 'POST',
        body: { username, password },
      })
      this.accessToken = res.access
      this.refreshToken = res.refresh
      await this.fetchUser()
    },
    async signup({ username, password }) {
      const config = useNuxtApp().$config
      await $fetch(`${config.public.BACKEND_URL}/api/accounts/signup/`, {
        method: 'POST',
        body: {
          username, password
        },
      })
      // auto-login after register
      await this.login({ username, password })
    },
    async fetchUser() {
      const config = useNuxtApp().$config
      if (!this.accessToken) return
      this.user = await $fetch(`${config.public.BACKEND_URL}/api/accounts/me/`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      })
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
    }
  }
})
