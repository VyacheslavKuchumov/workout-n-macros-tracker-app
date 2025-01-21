import instance from "@/middlewares";


export default {
  name: "exercises_in_workout",
  state: () => ({
    data: null,

  }),
  mutations: {
    setData(state, data) {
      state.data = data;
    },

  },
  actions: {
    async getExercisesInWorkout({ commit }, workout_id) {
        try {
            const response = await instance.get(`/api/exercises_in_workout/${workout_id}`);
            
            if (response) return commit("setData", response.data);
        }
        catch (error) {
            console.log(error);
        }
      

    },
    async createExerciseInWorkout({}, input) {
        try {
            const { workout_id, exercise_id, set, reps, weight } = input;
            const response = await instance.post("/api/exercises_in_workout", { workout_id, exercise_id, set, reps, weight });
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    },

    async updateExerciseInWorkout({}, input) {
        try {
            const { exercise_in_workout_id, set, reps, weight } = input;
            const response = await instance.put("/api/exercises_in_workout", { exercise_in_workout_id, set, reps, weight });
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    },

    async deleteExerciseInWorkout({}, exercise_in_workout_id) {
        try {
            const response = await instance.delete(`/api/exercises_in_workout/${exercise_in_workout_id}`);
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    }


  },

  namespaced: true,
};
