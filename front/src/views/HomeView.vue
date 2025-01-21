<template>
  <v-card  v-if="user()" class="mx-auto" max-width="400">
    <template v-slot:title>
      <span class="font-black">Главная страница</span>
    </template>

    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel nisl sed massa venenatis consequat. Integer auctor mollis ex eu imperdiet. Praesent at vehicula sem. Nulla facilisi. Sed ultrices scelerisque ex eu maximus. Duis vulputate lobortis nisl a ullamcorper. Nullam ultrices ultrices lectus, quis varius ex porta nec.
    </v-card-text>
    
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "HomeView",
  data() {
    return {
      hasUserInfo: false,

    };
  },
  computed: {},
  methods: {
    ...mapActions({
      getUser: "user/getUserByUid",
      getUserInfo: "user_info/getUserInfo",
      createUserInfo: "user_info/createUserInfo",
      updateUserInfo: "user_info/updateUserInfo",
    }),

    user() {
      return this.$store.state.user.user;
    },
    // user_info() {
    //   return this.$store.state.user_info.data;
    // },

    // async handleCreateUserInfo(data) {
    //   try {
    //     await this.createUserInfo(data);
    //     await this.getUserInfo();
    //     this.hasUserInfo = true;
    //   } catch (error) {
    //     console.error("Failed to create user info:", error);
    //   }
    // },
    // async handleEditUserInfo(data) {
    //   try {
    //     await this.updateUserInfo(data);
    //     await this.getUserInfo(); // Refresh the data after update
    //   } catch (error) {
    //     console.error("Failed to update user info:", error);
    //   }
    // },
  },
  watch: {},
  async mounted() {
    this.uid = localStorage.getItem("uid");

    if (this.uid) {
      await this.getUser();
      // try {
      //   await this.getUserInfo();
      //   this.hasUserInfo = true;
      // } catch (e) {
      //   this.hasUserInfo = false;
      // }
    }
  },
};
</script>
