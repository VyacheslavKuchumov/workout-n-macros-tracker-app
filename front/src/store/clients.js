import instance from "@/middlewares";

export default {
  name: 'clients',
  state: () => ({
    clients: null
  }),
  mutations: {
    setClients(state, clients) {
      state.clients = clients;
    }
  },
  actions: {
    async getAllClients({ commit }) {
      try {
        const response = await instance.get(`/api/clients`);
        console.log(response.data);
        if (response) return commit('setClients', response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },

    async getClientByID({ commit }, client_id) {
      try {
        const response = await instance.get(`/api/clients/${client_id}`);
        if (response) return commit('setClients', [response.data]); // Wrap in array for consistency
      } catch (error) {
        console.error('Error fetching client by ID:', error);
      }
    },

    async createClient({ commit }, client) {
      try {
        const response = await instance.post('/api/clients', client);
        if (response) return commit('setClients', response.data);
      } catch (error) {
        console.error('Error creating client:', error);
      }
    },

    async updateClient({ commit }, client) {
      try {
        const response = await instance.put(`/api/clients/${client.client_id}`, client);
        if (response) return commit('setClients', response.data);
      } catch (error) {
        console.error('Error updating client:', error);
      }
    },

    async deleteClient({ commit }, client) {
      try {
        const response = await instance.delete(`/api/clients/${client.client_id}`);
        if (response) return commit('setClients', response.data);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  },
  
  namespaced: true
};
