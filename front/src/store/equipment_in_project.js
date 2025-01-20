import instance from "@/middlewares";


export default {
  name: "equipment_in_project",
  state: () => ({
    project: null,
    equipment: null,
    conflictingEquipmentIDs: null,
    conflictingSetNames: null,
  }),
  mutations: {
    setProject(state, project) {
      state.project = project;
    },
    setEquipment(state, equipment) {
      state.equipment = equipment;
    },
    setProjectAndEquipment(state, data) {
      state.project = data.project;
      state.equipment = data.equipment;
    },
    setConflictingEquipment(state, data) {
      state.conflictingEquipmentIDs = data.equipmentIDs;
      state.conflictingSetNames = data.setNames;
    },
    

  },
  actions: {

    async addDraftToProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          draft_id: input.draft_id,
        };
        console.log("sending draft to project");
        console.log(body);
        const data = await instance.post(`/api/equipment_in_project/add_draft`, body);
        
        
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async resetEquipmentInProject({commit}, project_id) {
      try {
        const response = await instance.delete(
          `/api/equipment_in_project/reset/${project_id}`
        );
        if (response) {
          console.log(response.data);
          
        }
      } catch (error) {
        console.error("Error resetting equipment in project:", error);
      }
    },

    async getConflictingEquipment({ commit }, project_id) {
      try {
        const body = {
          project_id: project_id,
        };
        const response = await instance.post(
          `/api/equipment_in_project/conflicting`, body
        );

        
          const conflictingEquipmentIDs = response.data.map(item => item.equipment_id);
          const conflictingSetNames = [...new Set(response.data.map(item => item.equipment_set_name))];
          console.log(conflictingEquipmentIDs);
          console.log(conflictingSetNames);
          const data = { equipmentIDs: conflictingEquipmentIDs, setNames: conflictingSetNames };
          commit("setConflictingEquipment", data);
        
      } catch (error) {
        console.error("Error fetching conflicting equipment:", error);
      }
    },

    async getProjectByID({ commit }, project_id) {
        try {
          const response = await instance.get(
            `/api/equipment_in_project/${project_id}`
          );
          if (response) {
            console.log(response.data);
            
            
            commit("setProject", response.data); // Setting as an array to maintain consistency
          }
        } catch (error) {
          console.error("Error fetching project by ID:", error);
        }
      },
    
    async addEquipmentToProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_id: input.equipment_id,
          equipment_set_id: input.equipment_set_id,
        };

        const data = await instance.post(`/api/equipment_in_project/add`, body);
        commit("setProjectAndEquipment", data.data);
        
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async removeEquipmentFromProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_id: input.equipment_id,
        };
        const data = await instance.put(`/api/equipment_in_project/del`, body);
        commit("setProject", data.data);
        
        
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async addSetToProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_set_id: input.equipment_set_id,
        };

        const data = await instance.post(`/api/equipment_in_project/add_set`, body);
        console.log(data.data);
        commit("setProject", data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async removeSetFromProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_set_name: input.equipment_set_name,
        };
        const data = await instance.put(`/api/equipment_in_project/del_set`, body);
        commit("setProject", data.data);
        
        
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getAvailableEquipmentInSet({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_set_id: input.equipment_set_id,
        };
        const response = await instance.post(
          `/api/equipment_in_project/equipment_in_set`, body
        );
        if (response) {
          console.log(response.data);
          commit("setEquipment", response.data);
        }
      } catch (error) {
        console.error("Error fetching equipment in set:", error);
      }
    },

    
  },
  namespaced: true,
};
