<template>
    <v-card  v-if="user()" class="mx-auto" prepend-icon="mdi-account" max-width="400">
      <template v-slot:title>
        <span class="font-black">Мой профиль</span>
      </template>

      
      <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-title>Имя: {{ user().name }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="hasUserInfo">
              <v-list-item-title>Пол: {{ user_info().sex }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="hasUserInfo">
              <v-list-item-title>Рост: {{ user_info().height }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="hasUserInfo">
              <v-list-item-title>Вес: {{ user_info().weight }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="hasUserInfo">
              <v-list-item-title>Дата рождения: {{ user_info().date_of_birth }}</v-list-item-title>
            </v-list-item>
          </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          v-if="!hasUserInfo" 
          color="primary" 
          @click="handleCreateUserInfo"
        >
          Создать информацию
        </v-btn>
        <v-btn 
          v-if="hasUserInfo" 
          color="secondary" 
          @click="handleEditUserInfo"
        >
          Редактировать информацию
        </v-btn>
      </v-card-actions>
     
      
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
      user_info() {
        return this.$store.state.user_info.data;
      },
  
      async handleCreateUserInfo(data) {
        try {
          await this.createUserInfo(data);
          await this.getUserInfo();
          this.hasUserInfo = true;
        } catch (error) {
          console.error("Failed to create user info:", error);
        }
      },
      async handleEditUserInfo(data) {
        try {
          await this.updateUserInfo(data);
          await this.getUserInfo(); // Refresh the data after update
        } catch (error) {
          console.error("Failed to update user info:", error);
        }
      },
    },
    watch: {},
    async mounted() {
      this.uid = localStorage.getItem("uid");
  
      if (this.uid) {
        await this.getUser();
        try {
          await this.getUserInfo();
          this.hasUserInfo = true;
        } catch (e) {
          this.hasUserInfo = false;
        }
      }
    },
  };
  </script>
  