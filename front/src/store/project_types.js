import instance from "@/middlewares";

export default {
  name: "project_types",
  state: () => ({
    projectTypes: null,
    projectTypeNames: [],
  }),
  mutations: {
    setProjectTypes(state, projectTypes) {
      state.projectTypes = projectTypes;
    },
    setProjectTypeNames(state, names) {
      state.projectTypeNames = names;
    },
  },

  actions: {
    async getProjectTypeNames({ commit }) {
      try {
        const response = await instance.get(`/api/project_types`);
        if (response.status === 200) {
          const names = response.data.map(
            ({ project_type_name }) => project_type_name
          );
          console.log(names);
          return commit("setProjectTypeNames", names);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching project types:", error);
        window.alert("An error occurred while fetching project type names.");
      }
    },

    async getAllProjectTypes({ commit }) {
      try {
        const response = await instance.get(`/api/project_types`);
        console.log(response.data);
        if (response.status === 200) {
          return commit("setProjectTypes", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching project types:", error);
        window.alert("An error occurred while fetching all project types.");
      }
    },

    async getProjectTypeByID({ commit }, project_type_id) {
      try {
        const response = await instance.get(
          `/api/project_types/${project_type_id}`
        );
        if (response.status === 200) {
          return commit("setProjectTypes", [response.data]); // Wrap in array for consistency
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching project type by ID:", error);
        window.alert("An error occurred while fetching project type by ID.");
      }
    },

    async createProjectType({ commit }, projectType) {
      try {
        const response = await instance.post("/api/project_types", projectType);
        if (response.status === 201) {
          console.log("Project type created successfully:", response.data);
          return commit("setProjectTypes", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error creating project type:", error);
        window.alert("An error occurred while creating the project type.");
      }
    },

    async updateProjectType({ commit }, projectType) {
      try {
        const response = await instance.put(
          `/api/project_types/${projectType.project_type_id}`,
          projectType
        );
        if (response.status === 200) {
          return commit("setProjectTypes", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error updating project type:", error);
        window.alert("An error occurred while updating the project type.");
      }
    },

    async deleteProjectType({ commit }, projectType) {
      try {
        const response = await instance.delete(
          `/api/project_types/${projectType.project_type_id}`
        );
        if (response.status === 200) {
          return commit("setProjectTypes", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error deleting project type:", error);
        window.alert("An error occurred while deleting the project type.");
      }
    },
  },

  namespaced: true,
};
