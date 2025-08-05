<template>
    <v-navigation-drawer
        expand-on-hover
        rail
      >


        <v-list density="compact"` nav>
          <v-list-item 
            v-for="link in links"
            :key="link.value"
            :to="`/${link.value}`"
            
            :prepend-icon="link.icon"
          >
            {{ link.title }}
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<script setup>

const links = [
    { title: 'Главная', value: '', icon: 'mdi-home' },
    { title: 'Тренировки', value: 'workouts', icon: 'mdi-dumbbell' },
    { title: 'Упражнения', value: 'exercises', icon: 'mdi-database' },
    { title: 'Профиль', value: 'profile', icon: 'mdi-account' },

]

</script>