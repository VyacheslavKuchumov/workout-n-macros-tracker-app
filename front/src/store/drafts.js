import instance from "@/middlewares";

export default {
  name: "drafts",
  state: () => ({
    drafts: null,
    editedDraft: null,
  }),
  mutations: {
    setDrafts(state, drafts) {
      state.drafts = drafts;
    },
    setEditedDraft(state, draft) {
      state.editedDraft = draft;
    },
  },
  actions: {
    cleanStore({ commit }) {
      commit("setDrafts", null);
    },
    async addEquipmentToDraft({ commit }, input) {
      try {
        const body = {
          draft_id: input.draft_id,
          equipment_id: input.equipment_id,
        };

        await instance.post(`/api/drafts/equipment`, body);
        const response = await instance.get(
          `/api/drafts/search/${body.draft_id}`
        );
        if (response) {
          console.log(response.data);
          const formattedDraft = response.data;
          commit("setEditedDraft", formattedDraft);
        }
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
        await instance.put(`/api/drafts/equipment/del`, body);

        const response = await instance.get(
          `/api/drafts/search/${body.draft_id}`
        );
        if (response) {
          console.log(response.data);
          const formattedDraft = response.data;
          commit("setEditedDraft", formattedDraft);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getAllDrafts({ commit }) {
      try {
        const response = await instance.get(`/api/drafts`);
        if (response) {
          commit("setDrafts", response.data);
        }
      } catch (error) {
        console.error("Error fetching drafts:", error);
      }
    },
    async getDraftByID({ commit }, draft_id) {
      try {
        const response = await instance.get(
          `/api/drafts/search/${draft_id}`
        );
        if (response) {
          console.log(response.data);
          const formattedDraft = response.data;
          commit("setEditedDraft", formattedDraft);
        }
      } catch (error) {
        console.error("Error fetching draft by ID:", error);
      }
    },
    async createDraft({ commit }, draft) {
      try {
        const response = await instance.post("/api/drafts", draft);
        if (response) {
          commit("setDrafts", response.data);
        }
      } catch (error) {
        console.error("Error creating draft:", error);
      }
    },
    async updateDraft({ commit }, draft) {
      try {
        console.log(draft);
        const response = await instance.put(
          `/api/drafts/${draft.draft_id}`,
          draft
        );
        if (response) {
          commit("setDrafts", response.data);
        }
      } catch (error) {
        console.error("Error updating draft:", error);
      }
    },
    async deleteDraft({ commit }, draft_id) {
      try {
        const response = await instance.delete(`/api/drafts/${draft_id}`);
        if (response) {
          commit("setDrafts", response.data);
        }
      } catch (error) {
        console.error("Error deleting draft:", error);
      }
    },
  },
  namespaced: true,
};
