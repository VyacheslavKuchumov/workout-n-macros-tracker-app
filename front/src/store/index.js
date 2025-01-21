import { createStore } from "vuex";
import auth from "@/store/auth";
import user from "@/store/user";
import user_info from "@/store/user_info";


export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: auth,
    user: user,
    user_info: user_info,
  },
});
