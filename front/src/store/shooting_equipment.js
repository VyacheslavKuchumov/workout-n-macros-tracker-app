import instance from "@/middlewares"

export default {
    name: 'shooting_equipment',
    state: () => ({
        shooting_equipment: null
    }),
    mutations: {
        setShootingEquipment(state, equipment) {
            state.shooting_equipment = equipment
        }
    },
    actions: {
        
        
        async addEquipmentInShootingByID({ commit }, equipment) {
                try {
                    
                const response = await instance.post('/api/shooting_equipment', equipment);
                if (response) return commit('setShootingEquipment', response.data)
                } catch (error) {
                    console.error('Error creating shooting_equipment:', error);
                }
        },
        async getAllEquipmentInShootingByID({ commit }, id) {
            try {
                
            const response = await instance.get(`/api/shooting_equipment/search/${id}`);
            if (response) return commit('setShootingEquipment', response.data)
            } catch (error) {
                console.error('Error creating shooting_equipment:', error);
            }
        },
        async deleteEquipmentInShootingByID({ commit }, input) {
            try {
                const {id, shooting_id} = input
                await instance.delete(`/api/shooting_equipment/${id}`);
                const response = await instance.get(`/api/shooting_equipment/search/${shooting_id}`);
                if (response) return commit('setShootingEquipment', response.data)
            } catch (error) {
                console.error('Error creating shooting_equipment:', error);
            }
        },
         
        
    },
    
    namespaced: true
};