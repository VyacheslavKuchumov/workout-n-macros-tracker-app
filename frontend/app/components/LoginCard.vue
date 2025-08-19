<!-- Login.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-xl font-semibold">Войти в аккаунт</h2>
      </template>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <UFormGroup label="Username" required>
          <UInput
            v-model="username"
            placeholder="Введите имя пользователя"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Пароль" required>
          <UInput
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            :disabled="loading"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          Вход в аккаунт
        </UButton>
      </form>

      <template #footer>
        <div class="text-center">
          Нет аккаунта?
          <NuxtLink to="/signup" class="text-primary underline ml-1">
            Зарегистрироваться
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const username = ref('')
const password = ref('')
const loading  = ref(false)

const auth   = useAuthStore()
const router = useRouter()

async function onSubmit() {
  loading.value = true
  try {
    await auth.login({ username: username.value, password: password.value })
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Login failed: check credentials')
  } finally {
    loading.value = false
  }
}
</script>
