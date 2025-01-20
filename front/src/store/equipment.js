import instance from "@/middlewares";

export default {
  name: "equipment",
  state: () => ({
    equipment: null,
    editedEquipment: null,
  }),
  mutations: {
    setEquipment(state, equipment) {
      state.equipment = equipment;
    },
    setEditedEquipment(state, equipment) {
      state.editedEquipment = equipment;
    },
  },
  actions: {
    async getAllEquipment({ commit }) {
      try {
        const response = await instance.get(`/api/equipment`);
        if (response.status === 200) {
          return commit("setEquipment", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        window.alert("An error occurred while fetching equipment.");
      }
    },

    async getEquipmentBySetID({ commit }, set_id) {
      try {
        const response = await instance.get(`/api/equipment/set/${set_id}`);
        if (response.status === 200) {
          return commit("setEquipment", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching equipment by set ID:", error);
        window.alert("An error occurred while fetching equipment by set ID.");
      }
    },

    async getEquipmentByID({ commit }, equipment_id) {
      try {
        const response = await instance.get(`/api/equipment/search/${equipment_id}`);
        if (response.status === 200) {
          const formattedEquipment = {
            ...response.data,
            equipment_set_name: response.data.equipment_set.equipment_set_name,
            warehouse_name: response.data.storage.warehouse_name,
          };
          return commit("setEditedEquipment", formattedEquipment);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching equipment by ID:", error);
        window.alert("An error occurred while fetching equipment by ID.");
      }
    },

    async createEquipment({ commit }, equipment) {
      try {
        const response = await instance.post("/api/equipment", equipment);
        if (response.status === 201) {
          console.log("Equipment created successfully:", response.data);
          return;
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error creating equipment:", error);
        window.alert("An error occurred while creating equipment.");
      }
    },

    async updateEquipment({ commit }, equipment) {
      try {
        const response = await instance.put(`/api/equipment/${equipment.equipment_id}`, equipment);
        if (response.status === 200) {
          return commit("setEquipment", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error updating equipment:", error);
        window.alert("An error occurred while updating equipment.");
      }
    },

    async deleteEquipment({ commit }, equipment) {
      try {
        const response = await instance.delete(`/api/equipment/${equipment.equipment_id}`);
        if (response.status === 200) {
          console.log("Equipment deleted successfully:");
          // return commit("setEquipment", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error deleting equipment:", error);
        window.alert("An error occurred while deleting equipment.");
      }
    },
  },

  namespaced: true,
};
