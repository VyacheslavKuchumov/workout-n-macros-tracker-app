<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>UltraliveDatabase</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="isAuth" text to="/">Главная</v-btn>
      <v-btn v-if="isAuth" text to="/drafts">Шаблоны</v-btn>

      <v-btn v-if="isAuth" text to="/equipment_sets"
        >Комплекты оборудования</v-btn
      >

      <v-btn v-if="isAuth" text to="/projects">Съёмки</v-btn>
      <v-btn v-if="isAuth" @click="logout()">Выйти</v-btn>
    </v-app-bar>
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
      username: null,
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

<style></style>
