import { createStore } from "vuex";
import auth from "@/store/auth";
import user from "@/store/user";


export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: auth,
    user: user,
  },
});
