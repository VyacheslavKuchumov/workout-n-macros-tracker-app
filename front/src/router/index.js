import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import EquipmentView from "@/views/Equipment/EquipmentView.vue";
import CreateEquipmentView from "@/views/Equipment/CreateEquipmentView.vue";
import EditEquipmentView from "@/views/Equipment/EditEquipmentView.vue";
import AboutView from "@/views/AboutView.vue";
import Register from "@/views/Auth/Register.vue";
import Login from "@/views/Auth/Login.vue";
import instance from "@/middlewares";

import EquipmentSetsView from "@/views/Equipment/EquipmentSetsView.vue";

import auth from "@/store/auth";
import WarehousesView from "@/views/Dictionaries/WarehousesView.vue";
import ProjectsView from "@/views/Project/ProjectsView.vue";
import ProjectTypesView from "@/views/Dictionaries/ProjectTypesView.vue";
import CreateProjectView from "@/views/Project/CreateProjectView.vue";
import EditProjectView from "@/views/Project/EditProjectView.vue";

import EquipmentInProjectView from "@/views/Project/EquipmentInProjectView.vue";
import SetTypesView from "@/views/Dictionaries/SetTypesView.vue";
import DraftView from "@/views/Drafts/DraftView.vue";
import EquipmentInDraftView from "@/views/Drafts/EquipmentInDraftView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { auth: true },
  },

  {
    path: "/drafts",
    name: "drafts",
    component: DraftView,
    meta: {auth: true}
  },
  {
    path: "/draft/:id",
    name: "equipment-in-draft",
    component: EquipmentInDraftView,
    meta: { auth: true },
    props: true,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { auth: false },
  },
  {
    path: "/equipment/:id",
    name: "equipment",
    component: EquipmentView,
    meta: { auth: true },
    props: true,
  },

  {
    path: "/equipment/create/:set_id",
    name: "create-equipment",
    component: CreateEquipmentView,
    meta: { auth: true },
  },

  {
    path: "/equipment/edit/:set_id/:id",
    name: "edit-equipment",
    component: EditEquipmentView,
    meta: { auth: true },
    props: true, // Pass route params as props to component
  },

  {
    path: "/equipment_sets",
    name: "equipment_types",
    component: EquipmentSetsView,
    meta: { auth: true },
  },

  {
    path: "/set_types",
    name: "set_types",
    component: SetTypesView,
    meta: { auth: true },
  },

  {
    path: "/warehouses",
    name: "warehouses",
    component: WarehousesView,
    meta: { auth: true },
  },

  {
    path: "/project/create",
    name: "create-projects",
    component: CreateProjectView,
    meta: { auth: true },
  },

  {
    path: "/project/edit/:id",
    name: "edit-projects",
    component: EditProjectView,
    meta: { auth: true },
  },

  {
    path: "/projects",
    name: "projects",
    component: ProjectsView,
    meta: { auth: true },
  },

  {
    path: "/project/:id",
    name: "equipment-in-project",
    component: EquipmentInProjectView,
    meta: { auth: true },
    props: true,
  },

  {
    path: "/project_types",
    name: "project_types",
    component: ProjectTypesView,
    meta: { auth: true },
  },

  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: { auth: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const requireAuth = to.matched.some((record) => record?.meta.auth);
    if (requireAuth) {
      const uid = localStorage.getItem("uid");
      const response = await instance.get(`/api/users/${uid}`);
      if (response.status == 200) {
        return next();
      } else if (response.status == 403) {
        return next("/login");
      }
    }
    return next();
  } catch (error) {
    return next("/login");
  }
});

export default router;
