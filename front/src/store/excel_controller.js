import instance from "@/middlewares";

export default {
  name: "excel_controller",
  state: () => ({
    database: null,
  }),
  mutations: {
    setDatabase(state, data) {
      state.database = data;
    },
  },
  actions: {
    async getDatabase({ commit }) {
      try {
        const current_db = await instance.get(`/api/admin/excel`);
        if (current_db.data) {
          console.log(current_db.data);
          return commit("setDatabase", current_db.data);
        }
      } catch (error) {
        console.error("Error fetching database:", error);
        // Handle the error, e.g., show a message to the user or take other actions
      }
    },

    async postDatabase({ commit }, new_db) {
      try {
        // const backup_db = await instance.get(`/api/admin/excel`);
        try {
          const response = await instance.post(`/api/admin/excel`, new_db);
          console.log(response);
        } catch (error) {
          console.error("Error posting database:", error);
          // Handle the error, e.g., show a message to the user or take other actions
        }
        // if (backup_db) {
        //   return commit("setDatabase", backup_db);
        // }
      } catch (error) {
        console.error("Error fetching database backup:", error);
        // Handle the error, e.g., show a message to the user or take other actions
      }
    },
  },

  namespaced: true,
};
