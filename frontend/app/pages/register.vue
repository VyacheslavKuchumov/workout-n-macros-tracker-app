<!-- <template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h5">
            Регистрация
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="onSubmit" ref="registerForm" v-slot="{ valid }">
              <v-text-field
                v-model="firstName"
                label="First Name"
                required
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="lastName"
                label="Last Name"
                required
                :rules="[rules.required]"
              />

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
                Регистрация
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center">
            <span>Уже есть аккаунт?</span>
            <v-btn to="/login" class="ml-2 text--primary text-decoration-underline">
              Войти в аккаунт
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>


const firstName = ref('')
const lastName  = ref('')
const email     = ref('')
const password  = ref('')
const loading   = ref(false)

const auth   = useAuthStore()
const router = useRouter()

// Validation rules
const rules = {
  required: v => !!v || 'Required.',
  email:    v => /.+@.+\..+/.test(v) || 'Must be a valid email.',
}

async function onSubmit() {
  loading.value = true
  try {
    await auth.register({
      firstName: firstName.value,
      lastName:  lastName.value,
      email:     email.value,
      password:  password.value,
    })
    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    alert('Registration failed: please try again')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Add any custom overrides here */
</style> -->

<template>
  <PlaceholderCard />
</template>