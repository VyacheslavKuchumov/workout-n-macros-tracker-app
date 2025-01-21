import instance from "@/middlewares";
import user from "./user";

export default {
  name: "user_info",
  state: () => ({
    data: null,

  }),
  mutations: {
    setData(state, data) {
      state.data = data;
    },

  },
  actions: {
    async getUserInfo({ commit }) {
      const user_uid = localStorage.getItem("uid");
      const response = await instance.get(`/api/user_info/${user_uid}`);
      
      if (response) return commit("setData", response.data);
      

    },

    async updateUserInfo({}, { sex, weight, height, date_of_birth}) {
        const user_uid = localStorage.getItem("uid");
        const response = await instance.put("/api/user_info", { user_uid, sex, weight, height, date_of_birth });
        if (response.ok) return console.log("ok");
    },

    async createUserInfo({}, { sex, weight, height, date_of_birth}) {
        const user_uid = localStorage.getItem("uid");
        const response = await instance.post("/api/user_info", { user_uid, sex, weight, height, date_of_birth });
        if (response.ok) return console.log("ok");
    }
  },

  namespaced: true,
};
