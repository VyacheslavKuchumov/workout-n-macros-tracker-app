import type { UseFetchOptions } from 'nuxt/app'

export function useApiFetch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
  const { $api } = useNuxtApp()

  return useFetch<T>(url, {
    server: false,
    ...options,
    $fetch: $api as typeof $fetch
  })
}
