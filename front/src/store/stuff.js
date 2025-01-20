import instance from "@/middlewares";

export default {
  name: 'stuff',
  state: () => ({
    data: null
  }),
  mutations: {
    setData(state, data) {
      state.data = data;
    }
  },
  actions: {
    async getUserStuff({ commit }) {
      try {
        const uid = localStorage.getItem('uid');
        const user = await instance.get(`/api/users/${uid}`);
        if (user) {
          console.log(user);
          const user_data = await instance.get(`/api/stuff/${user.data.id}`);
          if (user_data) {
            commit('setData', user_data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user stuff:", error);
      }
    },
    async postUserStuff({ state }, data ) {
      try {
        const uid = localStorage.getItem('uid');
        console.log(data);
        const user = await instance.get(`/api/users/${uid}`);
        const response = await instance.post(`/api/stuff/${user.data.id}`, data);
        if (response.status === 200) {
          console.log('ok');
        } else {
          console.error("Error posting user stuff:", response.statusText);
        }
      } catch (error) {
        console.error("Error posting user stuff:", error);
      }
    },
    async searchUserByName({ commit }, { name }) {
        const response = await instance.get(`/api/users/search/${name}`);
        commit('setData', response.data);
      },

      async getUserStuffByID({ commit }, {id}) {
        try {
          
          if (id) {
            console.log(id);
            const user_data = await instance.get(`/api/stuff/${id}`);
            if (user_data) {
              commit('setData', user_data.data);
            }
          }
        } catch (error) {
          console.error("Error fetching user stuff:", error);
        }
      },
  },
  namespaced: true
};
