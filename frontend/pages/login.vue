<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h5">
            Войти в аккаунт
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="onSubmit" ref="loginForm" v-slot="{ valid }">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
              />

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                :rules="[rules.required]"
              />

              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                block
                class="mt-4"
              >
                Вход в аккаунт
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center">
            <span>Нет аккаунта?</span>
            <v-btn to="/register" class="ml-2 text--primary text-decoration-underline">
              Зарегистрироваться
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

const email = ref('')
const password = ref('')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

// Simple validation rules
const rules = {
  required: v => !!v || 'Required.',
  email: v => /.+@.+\..+/.test(v) || 'Must be a valid email.',
}

async function onSubmit() {
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    alert('Login failed: check credentials')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Optional: override or add custom Vuetify styles here */
</style>
