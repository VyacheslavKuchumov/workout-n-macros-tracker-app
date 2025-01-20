<template>
  <v-card class="elevation-5 mt-5 ml-auto mr-auto" max-width="1100">
    <v-data-table
      v-if="projects"
      :headers="headers"
      :items="filteredProjects"
      :items-per-page="-1"
      :search="search"
      hide-default-footer
      fixed-header
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Съёмки</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            v-model="search"
            label="Поиск"
            prepend-icon="mdi-magnify"
            clearable
            placeholder="Search..."
            class="mt-2"
            width="100"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="mb-2" color="primary" dark to="/project_types">
            Площадки
          </v-btn>
          <v-btn class="mb-2" color="primary" dark to="/project/create">
            Новая съёмка
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <!-- Status Column -->
          <td align="center">
            <v-icon
              v-if="projectsWithSharedEquipment.has(item.project_id)"
              color="blue"
            >
              mdi-camera
            </v-icon>
            <v-icon v-else color="green">mdi-check-circle</v-icon>
          </td>
          <td v-if="item.shooting_start_date !== item.shooting_end_date">
            с {{ item.shooting_start_date }} по {{ item.shooting_end_date }}
          </td>
          <td v-else>{{ item.shooting_start_date }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.type.project_type_name }}</td>
          <td>{{ item.chiefEngineer.name }}</td>
          <td>
            <v-btn
              size="small"
              color="secondary"
              @click="goToProjectEquipment(item)"
              prepend-icon="mdi-camera"
            >
              Оборудование
            </v-btn>
          </td>
          <td>
            <v-btn
              class="mr-5"
              size="small"
              color="blue-darken-1"
              @click="goToEditPage(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </td>
          <td>
            <v-btn size="small" color="red-darken-1" @click="confirmDelete(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:no-data> Нет данных </template>
    </v-data-table>
  </v-card>

  <!-- Диалог подтверждения удаления -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить проект "{{ projectToDelete?.project_name }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeConfirmDialog()">Отмена</v-btn>
        <v-btn color="red" @click="deleteConfirmed()">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      search: "",
      confirmDeleteDialog: false,
      projectToDelete: null, // Хранит информацию о проекте для удаления
    };
  },
  computed: {
    ...mapState("projects", ["projects"]),
    headers() {
      return [
        { title: "Статус", key: "status", sortable: false },
        { title: "Дата съёмки" },
        { title: "Название", key: "project_name" },
        { title: "Площадка", key: "type.project_type_name" },
        { title: "Главный инженер", key: "chiefEngineer.name" },
        { title: "Оборудование", key: "action_see_equipment", sortable: false },
        { title: "Изменить", key: "action_edit", sortable: false },
        { title: "Удалить", key: "action_delete", sortable: false },
      ];
    },
    filteredProjects() {
      if (!this.search) {
        return this.projects;
      }
      const searchTerm = this.search.toLowerCase();
      return this.projects.filter((item) =>
        item.project_name.toLowerCase().includes(searchTerm)
      );
    },
    projectsWithSharedEquipment() {
      const equipmentDateMap = {};
      this.projects.forEach((project) => {
        project.equipment.forEach((eq) => {
          const key = `${eq.equipment_id}_${project.shooting_date}`;
          if (!equipmentDateMap[key]) {
            equipmentDateMap[key] = [];
          }
          equipmentDateMap[key].push(project.project_id);
        });
      });

      const sharedProjectIds = new Set();
      Object.values(equipmentDateMap).forEach((projectIds) => {
        if (projectIds.length > 1) {
          projectIds.forEach((id) => sharedProjectIds.add(id));
        }
      });

      return sharedProjectIds;
    },
  },
  methods: {
    ...mapActions("projects", ["getAllProjects", "deleteProject"]),
    initialize() {
      this.getAllProjects();
    },
    goToEditPage(item) {
      this.$router.push(`/project/edit/${item.project_id}`);
    },
    goToProjectEquipment(item) {
      this.$router.push(`/project/${item.project_id}`);
    },

    // Открыть диалог подтверждения
    confirmDelete(item) {
      this.projectToDelete = item; // Сохраняем проект для удаления
      this.confirmDeleteDialog = true; // Открываем диалог
    },

    // Закрыть диалог
    closeConfirmDialog() {
      this.confirmDeleteDialog = false;
      this.projectToDelete = null;
    },

    // Подтверждение удаления
    deleteConfirmed() {
      if (this.projectToDelete) {
        this.deleteProject(this.projectToDelete.project_id); // Удаляем проект
        this.getAllProjects(); // Обновляем список проектов
      }
      this.closeConfirmDialog();
    },
  },
  created() {
    this.initialize();
  },
};
</script>
