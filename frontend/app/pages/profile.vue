<script setup lang="ts">
const auth = useAuthStore()
const toast = useToast()

if (import.meta.client && !auth.user) {
  await auth.fetchUser()
}

const profileState = reactive({
  username: auth.user?.username ?? '',
  email: auth.user?.email ?? '',
  first_name: auth.user?.first_name ?? '',
  last_name: auth.user?.last_name ?? '',
  target_weight_kg: auth.user?.target_weight_kg ? Number(auth.user.target_weight_kg) : 0,
  weekly_workout_goal: auth.user?.weekly_workout_goal ?? 4,
  bio: auth.user?.bio ?? ''
})

const passwordState = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const isSavingProfile = ref(false)
const isSavingPassword = ref(false)

watch(
  () => auth.user,
  (user) => {
    if (!user) {
      return
    }

    profileState.username = user.username
    profileState.email = user.email
    profileState.first_name = user.first_name
    profileState.last_name = user.last_name
    profileState.target_weight_kg = user.target_weight_kg ? Number(user.target_weight_kg) : 0
    profileState.weekly_workout_goal = user.weekly_workout_goal
    profileState.bio = user.bio
  },
  { immediate: true }
)

async function saveProfile() {
  isSavingProfile.value = true

  try {
    const updatedUser = await auth.updateProfile({
      username: profileState.username,
      email: profileState.email,
      first_name: profileState.first_name,
      last_name: profileState.last_name,
      target_weight_kg: profileState.target_weight_kg > 0 ? profileState.target_weight_kg.toFixed(2) : null,
      weekly_workout_goal: profileState.weekly_workout_goal,
      bio: profileState.bio
    })

    profileState.username = updatedUser.username
    profileState.email = updatedUser.email
    profileState.first_name = updatedUser.first_name
    profileState.last_name = updatedUser.last_name
    profileState.target_weight_kg = updatedUser.target_weight_kg ? Number(updatedUser.target_weight_kg) : 0
    profileState.weekly_workout_goal = updatedUser.weekly_workout_goal
    profileState.bio = updatedUser.bio

    toast.add({
      title: 'Profile updated',
      description: 'Your personal settings are saved.',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Could not save profile',
      description: error instanceof Error ? error.message : 'Please review your information and try again.',
      color: 'error'
    })
  } finally {
    isSavingProfile.value = false
  }
}

async function changePassword() {
  if (passwordState.new_password !== passwordState.confirm_password) {
    toast.add({
      title: 'Passwords do not match',
      description: 'Please make sure the new password is confirmed correctly.',
      color: 'error'
    })
    return
  }

  isSavingPassword.value = true

  try {
    await auth.changePassword(passwordState)

    passwordState.current_password = ''
    passwordState.new_password = ''
    passwordState.confirm_password = ''

    toast.add({
      title: 'Password updated',
      description: 'Use your new password the next time you sign in.',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Could not change password',
      description: error instanceof Error ? error.message : 'Please try again.',
      color: 'error'
    })
  } finally {
    isSavingPassword.value = false
  }
}
</script>

<template>
  <div class="page-stack">
    <UCard class="page-card">
      <div class="page-header">
        <UBadge color="neutral" variant="soft" class="pill-badge">Profile settings</UBadge>
        <h1 class="page-title">Keep your account details and training goals current.</h1>
        <p class="page-description">
          Your goal weight and workout target help frame the dashboard while your account details stay available for future account management.
        </p>
      </div>
    </UCard>

    <div class="profile-grid profile-grid--sidebar">
      <UCard class="page-card">
        <template #header>
          <div class="page-header">
            <h2 class="section-title">Account information</h2>
            <p class="note-text">These details are used across the app.</p>
          </div>
        </template>

        <form class="form-stack" @submit.prevent="saveProfile">
          <div class="form-grid">
            <UFormField label="First name">
              <UInput v-model="profileState.first_name" class="field-control" />
            </UFormField>

            <UFormField label="Last name">
              <UInput v-model="profileState.last_name" class="field-control" />
            </UFormField>
          </div>

          <div class="form-grid">
            <UFormField label="Username" required>
              <UInput v-model="profileState.username" class="field-control" />
            </UFormField>

            <UFormField label="Email">
              <UInput v-model="profileState.email" class="field-control" type="email" />
            </UFormField>
          </div>

          <div class="form-grid">
            <UFormField label="Target body weight (kg)">
              <UInput v-model="profileState.target_weight_kg" class="field-control" type="number" min="0" step="0.1" />
            </UFormField>

            <UFormField label="Weekly workout goal">
              <UInput v-model="profileState.weekly_workout_goal" class="field-control" type="number" min="1" max="14" step="1" />
            </UFormField>
          </div>

          <UFormField label="Bio">
            <UTextarea v-model="profileState.bio" class="field-control" :rows="5" placeholder="Training focus, current block, injury notes, motivation..." />
          </UFormField>

          <UButton type="submit" color="primary" class="fit-button" :loading="isSavingProfile">
            Save profile
          </UButton>
        </form>
      </UCard>

      <UCard class="page-card">
        <template #header>
          <div class="page-header">
            <h2 class="section-title">Change password</h2>
            <p class="note-text">Update your credentials when needed.</p>
          </div>
        </template>

        <form class="form-stack" @submit.prevent="changePassword">
          <UFormField label="Current password" required>
            <UInput v-model="passwordState.current_password" class="field-control" type="password" />
          </UFormField>

          <UFormField label="New password" required>
            <UInput v-model="passwordState.new_password" class="field-control" type="password" />
          </UFormField>

          <UFormField label="Confirm new password" required>
            <UInput v-model="passwordState.confirm_password" class="field-control" type="password" />
          </UFormField>

          <UButton
            type="submit"
            color="neutral"
            variant="outline"
            class="fit-button"
            :loading="isSavingPassword"
            :disabled="!passwordState.current_password || passwordState.new_password.length < 8"
          >
            Update password
          </UButton>
        </form>
      </UCard>
    </div>
  </div>
</template>
