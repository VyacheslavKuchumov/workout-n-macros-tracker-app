import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),
  persist: true,  // requires @pinia/plugin-persistedstate
  actions: {
    async login({ email, password }) {
      const { $fetch } = useNuxtApp()
      const res = await $fetch('/api/accounts/token/', {
        method: 'POST',
        body: { username: email, password },
      })
      this.accessToken = res.access
      this.refreshToken = res.refresh
      await this.fetchUser()
    },
    async register({ email, password, firstName, lastName }) {
      const { $fetch } = useNuxtApp()
      // adjust endpoint if your backend differs
      await $fetch('/api/accounts/register/', {
        method: 'POST',
        body: {
          email, password, first_name: firstName, last_name: lastName
        },
      })
      // auto-login after register
      await this.login({ email, password })
    },
    async fetchUser() {
      if (!this.accessToken) return
      const { $fetch } = useNuxtApp()
      this.user = await $fetch('/api/accounts/me/', {
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
