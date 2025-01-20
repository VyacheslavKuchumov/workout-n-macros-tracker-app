import { createStore } from "vuex";
import auth from "@/store/auth";
import user from "@/store/user";
import stuff from "@/store/stuff";
import equipment from "@/store/equipment";
import shooting_equipment from "@/store/shooting_equipment";
import equipment_set from "@/store/equipment_set";
import warehouse from "@/store/warehouse";
import projects from "@/store/projects";
import clients from "@/store/clients";
import project_types from "@/store/project_types";
import set_types from "@/store/set_types";
import equipment_in_project from "@/store/equipment_in_project";
import drafts from "@/store/drafts";
import equipment_in_draft from "@/store/equipment_in_draft";

import excel_controller from "@/store/excel_controller";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: auth,
    user: user,
    stuff: stuff,
    equipment: equipment,
    shooting_equipment: shooting_equipment,
    equipment_set: equipment_set,
    warehouse: warehouse,
    projects: projects,
    clients: clients,
    project_types: project_types,
    set_types: set_types,
    excel_controller: excel_controller,
    equipment_in_project: equipment_in_project,
    drafts: drafts,
    equipment_in_draft: equipment_in_draft,
  },
});
