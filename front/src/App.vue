<template>
  <v-app>
    
    <v-app-bar color="primary">
      <v-toolbar-title>WorkoutNotepad</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      app
      temporary
    >
      <v-list>
        <v-list-item-group>
          <v-list-item v-if="isAuth" to="/">
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuth" to="/workouts">
            <v-list-item-title>Тренировки</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuth" to="/exercises">
            <v-list-item-title>Упражнения</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuth" to="/statistics">
            <v-list-item-title>Статистика</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuth" to="/profile">
            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuth" @click="logout()">
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      drawer: false, // State for navigation drawer
    };
  },
  
  methods: {
    ...mapActions({
      logout: "auth/logout",
    }),
  },
  mounted() {
    const uid = localStorage.getItem("uid");
    uid
      ? this.$store.commit("auth/setAuth", true)
      : this.$store.commit("auth/setAuth", false);
  },

  computed: {
    ...mapState({
      isAuth: (state) => state.auth.isAuth,
    }),
  },
};
</script>


