import instance from "@/middlewares";

export default {
  name: "set_types",
  state: () => ({
    setTypes: null,
    setTypeNames: [],
  }),
  mutations: {
    setSetTypes(state, setTypes) {
      state.setTypes = setTypes;
    },
    setSetTypeNames(state, names) {
      state.setTypeNames = names;
    },
  },

  actions: {
    async getSetTypeNames({ commit }) {
      try {
        const response = await instance.get("/api/set_types");
        if (response) {
          const names = response.data.map(({ set_type_name }) => set_type_name);
          console.log(names);
          return commit("setSetTypeNames", names);
        }
      } catch (error) {
        console.error("Error fetching set type names:", error);
      }
    },

    async getAllSetTypes({ commit }) {
      try {
        const response = await instance.get("/api/set_types");
        console.log(response.data);
        if (response) return commit("setSetTypes", response.data);
      } catch (error) {
        console.error("Error fetching set types:", error);
      }
    },

    async getSetTypeByID({ commit }, set_type_id) {
      try {
        const response = await instance.get(`/api/set_types/${set_type_id}`);
        if (response) return commit("setSetTypes", [response.data]); // Wrap in array for consistency
      } catch (error) {
        console.error("Error fetching set type by ID:", error);
      }
    },

    async createSetType({ commit }, setType) {
      try {
        const response = await instance.post("/api/set_types", setType);
        if (response) return commit("setSetTypes", response.data);
      } catch (error) {
        console.error("Error creating set type:", error);
      }
    },

    async updateSetType({ commit }, setType) {
      try {
        const response = await instance.put(`/api/set_types/${setType.set_type_id}`, setType);
        if (response) return commit("setSetTypes", response.data);
      } catch (error) {
        console.error("Error updating set type:", error);
      }
    },

    async deleteSetType({ commit }, setType) {
      try {
        const response = await instance.delete(`/api/set_types/${setType.set_type_id}`);
        if (response) return commit("setSetTypes", response.data);
      } catch (error) {
        console.error("Error deleting set type:", error);
      }
    },
  },

  namespaced: true,
};
