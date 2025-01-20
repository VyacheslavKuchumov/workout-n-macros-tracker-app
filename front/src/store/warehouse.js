import instance from "@/middlewares";

export default {
  name: "warehouse",
  state: () => ({
    warehouses: null,
    warehouseNames: [],
  }),
  mutations: {
    setWarehouses(state, warehouses) {
      state.warehouses = warehouses;
    },
    setWarehouseNames(state, names) {
      state.warehouseNames = names;
    },
  },
  actions: {
    async getAllWarehouseNames({ commit }) {
      const warehouses = await instance.get(`/api/warehouse`);
      if (warehouses) {
        const names = warehouses.data.map(
          ({ warehouse_name }) => warehouse_name
        );
        return commit("setWarehouseNames", names);
      }
    },
    async getAllWarehouses({ commit }) {
      try {
        const warehouses = await instance.get(`/api/warehouse`);
        console.log(warehouses.data);
        if (warehouses) return commit("setWarehouses", warehouses.data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    },

    async getWarehouseByID({ commit }, warehouse_id) {
      try {
        const warehouse = await instance.get(`/api/warehouse/${warehouse_id}`);
        if (warehouse) return commit("setWarehouses", warehouse.data);
      } catch (error) {
        console.error("Error fetching warehouse by ID:", error);
      }
    },

    async createWarehouse({ commit }, warehouse) {
      try {
        const response = await instance.post("/api/warehouse", warehouse);
        if (response) return commit("setWarehouses", response.data);
      } catch (error) {
        console.error("Error creating warehouse:", error);
      }
    },

    async updateWarehouse({ commit }, warehouse) {
      try {
        const response = await instance.put(
          `/api/warehouse/${warehouse.warehouse_id}`,
          warehouse
        );
        if (response) return commit("setWarehouses", response.data);
      } catch (error) {
        console.error("Error updating warehouse:", error);
      }
    },

    async deleteWarehouse({ commit }, warehouse) {
      try {
        const response = await instance.delete(
          `/api/warehouse/${warehouse.warehouse_id}`
        );
        if (response) return commit("setWarehouses", response.data);
      } catch (error) {
        console.error("Error deleting warehouse:", error);
      }
    },
  },

  namespaced: true,
};
