import type { FetchContext, FetchOptions } from 'ofetch'

function isAuthRequest(request: FetchContext['request']) {
  return typeof request === 'string' && request.includes('/accounts/token/')
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    async onRequest({ options }) {
      const auth = useAuthStore()

      if (!auth.accessToken) {
        return
      }

      const headers = new Headers(options.headers ?? {})
      headers.set('Authorization', `Bearer ${auth.accessToken}`)
      options.headers = headers
    },
    async onResponseError(context) {
      const auth = useAuthStore()
      const options = context.options as FetchOptions & { _retried?: boolean }

      if (
        context.response.status !== 401 ||
        options._retried ||
        !auth.refreshToken ||
        isAuthRequest(context.request)
      ) {
        return
      }

      try {
        const nextAccessToken = await auth.refreshAccessToken()
        const headers = new Headers(options.headers ?? {})
        headers.set('Authorization', `Bearer ${nextAccessToken}`)

        return await api(context.request, {
          ...options,
          _retried: true,
          headers
        })
      } catch {
        auth.clearAuth()
        if (import.meta.client) {
          await navigateTo('/login')
        }
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
