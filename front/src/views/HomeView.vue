<template>
  <v-card v-if="user()" class="mx-auto" prepend-icon="mdi-account" width="400">
    <template v-slot:title>
      <span class="font-black">Пользователь {{ user().name }}</span>
    </template>
    <template v-slot:subtitle>
      {{ user().role }}
    </template>

    
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "HomeView",
  data() {
    return {
      likes: 0,
      text: "",
      uid: "",
      name: "",
    };
  },
  computed: {},
  methods: {
    ...mapActions({
      getUser: "user/getUserByUid",
    }),

    user() {
      return this.$store.state.user.user;
    },
  },
  watch: {},
  async mounted() {
    this.uid = localStorage.getItem("uid");

    if (this.uid) {
      await this.getUser();
    }
  },
};
</script>
