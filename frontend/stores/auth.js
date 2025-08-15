import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),
  persist: true,  // requires @pinia/plugin-persistedstate
  actions: {
    async login({ email, password }) {
      const config = useNuxtApp().$config
      const res = await $fetch(`${config.public.BACKEND_URL}/api/accounts/token/`, {
        method: 'POST',
        body: { username: email, password },
      })
      this.accessToken = res.access
      this.refreshToken = res.refresh
      await this.fetchUser()
    },
    async register({ email, password, firstName, lastName }) {
      const config = useNuxtApp().$config
      await $fetch(`${config.public.BACKEND_URL}/api/accounts/register/`, {
        method: 'POST',
        body: {
          email, password, first_name: firstName, last_name: lastName
        },
      })
      // auto-login after register
      await this.login({ email, password })
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
