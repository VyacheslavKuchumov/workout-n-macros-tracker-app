import instance from "@/middlewares";


export default {
  name: "exercises",
  state: () => ({
    data: null,

  }),
  mutations: {
    setData(state, data) {
      state.data = data;
    },

  },
  actions: {
    async getExercises({ commit }) {
        try {
            const response = await instance.get(`/api/exercises`);
            
            if (response) return commit("setData", response.data);
        }
        catch (error) {
            console.log(error);
        }
      

    },
    async createExercise({}, input) {
        try {
            const { exercise_name, exercise_description, muscle_group } = input;
            const response = await instance.post("/api/exercises", { exercise_name, exercise_description, muscle_group });
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    },

    async updateExercise({}, input) {
        try {
            const { exercise_id, exercise_name, exercise_description, muscle_group } = input;
            const response = await instance.put("/api/exercises", { exercise_id, exercise_name, exercise_description, muscle_group });
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    },

    async deleteExercise({}, exercise_id) {
        try {
            const response = await instance.delete(`/api/exercises/${exercise_id}`);
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    }
    


  },

  namespaced: true,
};
