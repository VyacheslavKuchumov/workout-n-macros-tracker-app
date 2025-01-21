import instance from "@/middlewares";


export default {
  name: "workouts",
  state: () => ({
    data: null,

  }),
  mutations: {
    setData(state, data) {
      state.data = data;
    },

  },
  actions: {
    async getWorkouts({ commit }) {
        try {
            const response = await instance.get(`/api/workouts`);
            
            if (response) return commit("setData", response.data);
        }
        catch (error) {
            console.log(error);
        }
      

    },
    async createWorkout({}, input) {
        try {
            const user_uid = localStorage.getItem("uid");
            const { workout_name,  workout_date } = input;
            const response = await instance.post("/api/workouts", { workout_name, workout_date, user_uid });
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    },

    async updateWorkout({}, input) {
        try {
            const user_uid = localStorage.getItem("uid");
            const { workout_id, workout_name, workout_date } = input;
            const response = await instance.put("/api/workouts", { workout_id, workout_name, workout_date, user_uid });
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    },

    async deleteWorkout({}, workout_id) {
        try {
            const response = await instance.delete(`/api/workouts/${workout_id}`);
            if (response.ok) return console.log("ok");
        }
        catch (error) {
            console.log(error);
        }
    }
    


  },

  namespaced: true,
};
