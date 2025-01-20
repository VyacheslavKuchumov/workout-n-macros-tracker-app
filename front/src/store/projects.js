import instance from "@/middlewares";
import equipment from "./equipment";

export default {
  name: "projects",
  state: () => ({
    projects: null,
    editedProject: null,
  }),
  mutations: {
    setProjects(state, projects) {
      state.projects = projects;
    },
    setEditedProject(state, project) {
      state.editedProject = project;
    },
  },
  actions: {
    cleanStore({ commit }) {
      commit("setProjects", null);
    },
    async addEquipmentToProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_id: input.equipment_id,
        };

        await instance.post(`/api/projects/equipment`, body);
        const response = await instance.get(
          `/api/projects/search/${body.project_id}`
        );
        if (response) {
          console.log(response.data);
          const formattedProject = {
            project_id: response.data.project_id,
            project_name: response.data.project_name,
            project_type_name: response.data.type.project_type_name,
            chief_engineer_name: response.data.chiefEngineer.name,
            shooting_date: response.data.shooting_date,
            equipment: response.data.equipment,
          };
          commit("setEditedProject", formattedProject);
        }
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
        await instance.put(`/api/projects/equipment/del`, body);

        const response = await instance.get(
          `/api/projects/search/${body.project_id}`
        );
        if (response) {
          console.log(response.data);
          const formattedProject = {
            project_id: response.data.project_id,
            project_name: response.data.project_name,
            project_type_name: response.data.type.project_type_name,
            chief_engineer_name: response.data.chiefEngineer.name,
            shooting_date: response.data.shooting_date,
            equipment: response.data.equipment,
          };
          commit("setEditedProject", formattedProject);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getAllProjects({ commit }) {
      try {
        const response = await instance.get(`/api/projects`);
        if (response) {
          commit("setProjects", response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async getProjectByID({ commit }, project_id) {
      try {
        const response = await instance.get(
          `/api/projects/search/${project_id}`
        );
        if (response) {
          console.log(response.data);
          const formattedProject = {
            project_id: project_id,
            project_name: response.data.project_name,
            archived: response.data.archived,
            project_type_name: response.data.type.project_type_name,
            chief_engineer_name: response.data.chiefEngineer.name,
            shooting_start_date: response.data.shooting_start_date,
            shooting_end_date: response.data.shooting_end_date,
            equipment: response.data.equipment,
          };
          commit("setEditedProject", formattedProject); // Setting as an array to maintain consistency
        }
      } catch (error) {
        console.error("Error fetching project by ID:", error);
      }
    },
    async createProject({ commit }, project) {
      try {
        const response = await instance.post("/api/projects", project);
        if (response) {
          commit("setProjects", response.data);
        }
      } catch (error) {
        console.error("Error creating project:", error);
      }
    },
    async updateProject({ commit }, project) {
      try {
        console.log(project);
        const response = await instance.put(
          `/api/projects/${project.project_id}`,
          project
        );
        if (response) {
          commit("setProjects", response.data);
        }
      } catch (error) {
        console.error("Error updating project:", error);
      }
    },
    async deleteProject({ commit }, project_id) {
      try {
        const response = await instance.delete(`/api/projects/${project_id}`);
        if (response) {
          commit("setProjects", response.data);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
  },
  namespaced: true,
};
