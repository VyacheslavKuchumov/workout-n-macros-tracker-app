import instance from "@/middlewares";


export default {
  name: "equipment_in_draft",
  state: () => ({
    draft: null,
    equipment: null,

  }),
  mutations: {
    setDraft(state, draft) {
      state.draft = draft;
    },
    setEquipment(state, equipment) {
      state.equipment = equipment;
    },
    setDraftAndEquipment(state, data) {
      state.draft = data.draft;
      state.equipment = data.equipment;
    },

  },
  actions: {

    async getDraftByID({ commit }, draft_id) {
      try {
        const response = await instance.get(
          `/api/equipment_in_draft/${draft_id}`
        );
        if (response) {
          console.log(response.data);
          commit("setDraft", response.data);
        }
      } catch (error) {
        console.error("Error fetching draft by ID:", error);
      }
    },

    async addEquipmentToDraft({ commit }, input) {
      try {
        const body = {
          draft_id: input.draft_id,
          equipment_id: input.equipment_id,
          equipment_set_id: input.equipment_set_id,
        };

        const data = await instance.post(`/api/equipment_in_draft/add`, body);
        commit("setDraftAndEquipment", data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async removeEquipmentFromDraft({ commit }, input) {
      try {
        const body = {
          draft_id: input.draft_id,
          equipment_id: input.equipment_id,
        };
        const data = await instance.put(`/api/equipment_in_draft/del`, body);
        commit("setDraft", data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async addSetToDraft({ commit }, input) {
      try {
        const body = {
          draft_id: input.draft_id,
          equipment_set_id: input.equipment_set_id,
        };

        const data = await instance.post(`/api/equipment_in_draft/add_set`, body);
        console.log(data.data);
        commit("setDraft", data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async removeSetFromDraft({ commit }, input) {
      try {
        const body = {
          draft_id: input.draft_id,
          equipment_set_name: input.equipment_set_name,
        };
        const data = await instance.put(`/api/equipment_in_draft/del_set`, body);
        commit("setDraft", data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getAvailableEquipmentInSet({ commit }, input) {
      try {
        const body = {
          draft_id: input.draft_id,
          equipment_set_id: input.equipment_set_id,
        };
        const response = await instance.post(
          `/api/equipment_in_draft/equipment_in_set`, body
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
