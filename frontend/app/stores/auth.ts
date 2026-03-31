import type { LoginPayload, PasswordChangePayload, SignupPayload, UserProfile } from '~/types/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken)
  },
  persist: {
    pick: ['accessToken', 'refreshToken', 'user']
  },
  actions: {
    getApiBase() {
      const config = useRuntimeConfig()
      return config.public.apiBase
    },
    clearAuth() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
    },
    async init() {
      if (this.initialized) {
        return
      }

      if (!this.accessToken && !this.refreshToken) {
        this.initialized = true
        return
      }

      try {
        if (!this.accessToken && this.refreshToken) {
          await this.refreshAccessToken()
        }

        if (this.accessToken) {
          await this.fetchUser()
        }
      } catch {
        this.clearAuth()
      } finally {
        this.initialized = true
      }
    },
    async login(payload: LoginPayload) {
      const response = await $fetch<{ access: string, refresh: string }>(
        `${this.getApiBase()}/accounts/token/`,
        {
          method: 'POST',
          body: payload
        }
      )

      this.accessToken = response.access
      this.refreshToken = response.refresh
      await this.fetchUser()
    },
    async signup(payload: SignupPayload) {
      await $fetch(`${this.getApiBase()}/accounts/signup/`, {
        method: 'POST',
        body: payload
      })

      await this.login({
        username: payload.username,
        password: payload.password
      })
    },
    async refreshAccessToken() {
      if (!this.refreshToken) {
        throw new Error('Missing refresh token.')
      }

      const response = await $fetch<{ access: string }>(
        `${this.getApiBase()}/accounts/token/refresh/`,
        {
          method: 'POST',
          body: {
            refresh: this.refreshToken
          }
        }
      )

      this.accessToken = response.access
      return response.access
    },
    async fetchUser() {
      const { $api } = useNuxtApp()
      this.user = await $api<UserProfile>('/accounts/me/')
      return this.user
    },
    async updateProfile(payload: Partial<UserProfile>) {
      const { $api } = useNuxtApp()
      this.user = await $api<UserProfile>('/accounts/me/', {
        method: 'PATCH',
        body: payload
      })
      return this.user
    },
    async changePassword(payload: PasswordChangePayload) {
      const { $api } = useNuxtApp()
      await $api('/accounts/password/', {
        method: 'POST',
        body: payload
      })
    },
    async logout(redirectTo = '/login') {
      this.clearAuth()

      if (import.meta.client) {
        await navigateTo(redirectTo)
      }
    }
  }
})
