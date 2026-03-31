export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.init()
  }

  if (to.meta.public) {
    if (auth.isAuthenticated && ['/login', '/signup'].includes(to.path)) {
      return navigateTo('/')
    }

    return
  }

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
