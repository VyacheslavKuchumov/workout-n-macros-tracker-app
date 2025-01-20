<template>
  <v-card v-if="project" max-width="800" class="elevation-0 mt-5 ml-auto mr-auto">
    <v-card-title
      align="center"
      v-if="project.project.shooting_start_date !== project.project.shooting_end_date"
    >
      Съёмка "{{ project.project.project_name }}" ({{ formatDate(project.project.shooting_start_date) }} - {{ formatDate(project.project.shooting_end_date) }})
    </v-card-title>
    <v-card-title align="center" v-else>
      Съёмка
      "{{ project.project.project_name }}" 
      ({{ formatDate(project.project.shooting_start_date) }})
    </v-card-title>
  </v-card>
  <v-card
    max-width="1100"
    class="elevation-5 mt-5 ml-auto mr-auto"
    v-if="project"
  >
    <!-- {{ conflictingSetNames }} -->
    
  
    <!-- Table for equipment in the project -->
    <v-data-table
      v-if="project.equipment_in_project"
      :group-by="groupByInProject"
      :headers="headers"
      :items="project.equipment_in_project"
      :items-per-page="-1"
      fixed-header
      hide-default-footer
      hide-default-header
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Оборудование в съёмке
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogDrafts = true">
            Добавить шаблон
          </v-btn>
          <v-btn color="primary" @click="dialog = true">
            Добавить оборудование
          </v-btn>
          <v-btn color="red" @click="dialogReset = true">
            Сбросить
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:group-header="{
        item,
        columns,
        toggleGroup,
        isGroupOpen,
      }">
        <tr>
          <td :colspan="columns.length" @click="toggleGroup(item)">
            <v-btn
              :class="groupClassify(item)"
              :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
              size="small"
              variant="text"
            ></v-btn>
            <v-icon
              v-if="checkSetName(item.value)"
              color="blue"
            >
              mdi-camera
            </v-icon>
            <span :class="groupClassify(item)">{{ item.value }}</span> 
               
            <v-btn
              v-if="groupClassify(item) != 'first-group'"
              class="ml-5"
              size="small"
              color="red-darken-1"
              @click.stop="removeSet(item)"
              
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:item.status="{ item }">
        <v-icon v-if="checkEquipmentID(item.equipment_id)" color="blue">mdi-camera</v-icon>
        <v-icon v-if="item.needs_maintenance" color="orange"
              >mdi-tools</v-icon
            >
        <v-icon v-if="item.current_storage" color="yellow"
              >mdi-warehouse</v-icon
        >

      </template>

      <template v-slot:item.action_delete="{ item }">
        <v-btn
          class="mr-5"
          size="small"
          color="red-darken-1"
          @click="deleteItem(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:no-data>Нет данных</template>
    </v-data-table>

     <!-- Диалог подтверждения сброса проекта -->
     <v-dialog v-model="dialogReset" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Подтвердите сброс проекта</v-card-title>
        <v-card-text>
          Вы уверены, что хотите сбросить проект? Все изменения будут потеряны.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogReset = false">Отмена</v-btn>
          <v-btn color="red darken-1" text @click="confirmReset">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDrafts" max-width="400">
      <v-card>
        <v-data-table 
          :headers="draftHeaders"
          :items="drafts"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
          hide-default-header>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Шаблоны</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="dialogDrafts = false">Закрыть</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.action_add="{ item }">
            <v-btn
              class="mr-5"
              size="small"
              color="blue-darken-1"
              @click="addDraft(item)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>

          </template>
        </v-data-table>
      </v-card>
    </v-dialog>

    <!-- Dialog for available equipment -->
    <v-dialog v-model="dialog" max-width="600">
      
      <v-card>
        <v-toolbar flat>
          
          <v-toolbar-title>Добавить оборудование</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="!sets_view" @click="sets_view = true" class="mb-2" color="red" dark>
            Назад
          </v-btn>
          
        </v-toolbar>
        <v-text-field
        v-if="sets_view"
                v-model="searchSets"
                label="Поиск комплектов"
                prepend-icon="mdi-magnify"
                clearable
                placeholder="Panasonic..."
                class="mt-2 ml-2"
                max-width="500"
              ></v-text-field>
        <v-text-field
        v-else
                v-model="searchEquipment"
                label="Поиск оборудования"
                prepend-icon="mdi-magnify"
                clearable
                placeholder="Камера..."
                class="mt-2 ml-2"
                max-width="500"
              ></v-text-field>
        <v-data-table
          v-if="project.sets_in_project && sets_view"
          :group-by="groupBySets"
          :headers="setsHeaders"
          :items="filteredSets"
          :items-per-page="-1"
          hide-default-header
          hide-default-footer
        >
          <template v-slot:group-header="{
            item,
            columns,
            toggleGroup,
            isGroupOpen,
          }">
            <tr>
              <td :colspan="columns.length" @click="toggleGroup(item)">
                <v-btn
                  
                  :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                  size="small"
                  variant="text"
                ></v-btn>
                
                
                <span>{{ item.value }}</span>
                
              </td>
            </tr>
          </template>

          <template v-slot:item.status="{ item }">
            <v-icon v-if="checkSetName(item.equipment_set_name)" color="blue">mdi-camera</v-icon>
            

          </template>

          <template v-slot:item.actions_see_equipment="{ item }">
            <v-btn
              class="mr-5"
              size="small"
              color="secondary"
              @click="showEquipment(item)"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </template>


          <template v-slot:item.action_add="{ item }">
            <v-btn
              class="mr-5"
              size="small"
              color="blue-darken-1"
              @click="addSet(item)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>

          

          <template v-slot:no-data>Нет данных</template>
        </v-data-table>


        <v-data-table
          v-if="equipment && !sets_view"
          :headers="equipmentHeaders"
          :items="filteredEquipment"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
          hide-default-header
        >
          
          <template v-slot:item.status="{ item }">
            <v-icon v-if="checkEquipmentID(item.equipment_id)" color="blue">mdi-camera</v-icon>
            <v-icon v-if="item.needs_maintenance" color="orange"
              >mdi-tools</v-icon
            >
            <v-icon v-if="item.current_storage" color="yellow"
                  >mdi-warehouse</v-icon
            >

          </template>

          <template v-slot:item.action_add="{ item }">
            <v-btn
              class="mr-5"
              size="small"
              color="blue-darken-1"
              @click="addItem(item)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>

          

          <template v-slot:no-data>Нет данных</template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      dialog: false,
      dialogReset: false,
      dialogDrafts: false,
      sets_view: true,
      searchSets: "",
      searchEquipment: "",
    };
  },
  computed: {
    
    ...mapState("equipment_in_project", ["project", "equipment", "conflictingEquipmentIDs", "conflictingSetNames"]),
    ...mapState("equipment_set", ["equipment_sets"]),
    ...mapState("drafts", ["drafts"]),
    filteredSets() {
    // Filter sets based on search input
    if (!this.searchSets) return this.project.sets_in_project || [];
    const search = this.searchSets.toLowerCase();
    return this.project.sets_in_project.filter((item) =>
      item.equipment_set_name.toLowerCase().includes(search)
    );
  },
  filteredEquipment() {
    // Filter equipment based on search input
    if (!this.searchEquipment) return this.equipment || [];
    const search = this.searchEquipment.toLowerCase();
    return this.equipment.filter((item) =>
      item.equipment_name.toLowerCase().includes(search)
    );
  },

    headers() {
      return [
        {title: "Статус", key: "status", sortable: false },
        { title: "Название", key: "equipment_name" },
        { title: "", key: "action_add", sortable: false },
        { title: "", key: "action_delete", sortable: false },
      ];
    },
    draftHeaders() {
      return [
        { title: "Название", key: "draft_name" },
        { title: "Добавить", key: "action_add", sortable: false },
      ];
    },
    setsHeaders() {
      return [
        { title: "Статус", key: "status", sortable: false },
        { title: "Название комплекта", key: "equipment_set_name" },
        { title: "Описание", key: "description", sortable: false },
        {
          title: "",
          key: "actions_see_equipment",
          sortable: false,
        },
        { title: "", key: "action_add", sortable: false },
        
      ];
    },
    groupBySets() {
      return [
        { key: "type.set_type_name", order: "asc" },
        
      ];
    },
    equipmentHeaders() {
      return [
        { title: "Статус", key: "status", sortable: false },
        { title: "Название", key: "equipment_name" },
        { title: "", key: "action_add", sortable: false },
      ];
    },
    groupByEquipment() {
      return [
        { key: "set.set_type_name", order: "asc" },
      ];
    },

    groupByInProject() {
      return [
        { key: "equipment_set.type.set_type_name", order: "asc" },
        { key: "equipment_set.equipment_set_name", order: "asc" },
      ];
    },
    
  },
  methods: {
    ...mapActions("equipment_in_project", [
      "getProjectByID",
      "addEquipmentToProject",
      "removeEquipmentFromProject",
      "addSetToProject",
      "removeSetFromProject",
      "getAvailableEquipmentInSet",
      "getConflictingEquipment",
      "resetEquipmentInProject",
      "addDraftToProject"
    ]),
    ...mapActions("drafts", ["getAllDrafts"]),
    ...mapActions("equipment", [
      "getAllEquipment",
      "getEquipmentBySetID"
    ]),
    
    ...mapActions("equipment_set", [
      "getAllEquipmentSets",
      "createEquipmentSet",
      "updateEquipmentSet",
      "deleteEquipmentSet",
    ]),
    showEquipment(item){
      const data = {
        project_id: this.project.project.project_id,
        equipment_set_id: item.equipment_set_id,
      }
      this.getAvailableEquipmentInSet(data)
      this.sets_view = false
    },
    resetProject() {
      // Логика сброса проекта
      this.resetEquipmentInProject(this.project.project.project_id);
      location.reload();
    },
    confirmReset() {
      this.resetProject();
      this.dialogReset = false; // Закрыть диалог
    },

    checkSetName(item){
      return this.conflictingSetNames.includes(item)
    },

    checkEquipmentID(item){
      return this.conflictingEquipmentIDs.includes(item)
    },

    deleteItem(item) {
      const data = {
        project_id: this.project.project.project_id,
        equipment_id: item.equipment_id,
      };
      this.removeEquipmentFromProject(data);
    },
    addDraft(item) {
      const data = {
        project_id: this.project.project.project_id,
        draft_id: item.draft_id,
      };
      this.addDraftToProject(data);
      location.reload();
    },
    addItem(item) {
      const data = {
        project_id: this.project.project.project_id,
        equipment_id: item.equipment_id,
        equipment_set_id: item.equipment_set_id,
      };
      this.addEquipmentToProject(data);
    },
    addSet(item) {
      console.log(item)
      const data = {
        project_id: this.project.project.project_id,
        equipment_set_id: item.equipment_set_id,
      };
      
      this.addSetToProject(data);
      
    },
    removeSet(item) {
      console.log(item);
      
      const data = {
        project_id: this.project.project.project_id,
        equipment_set_name: item.value,
      };
      this.removeSetFromProject(data);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("ru", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    groupClassify(item) {
      return item.key === "equipment_set.type.set_type_name"
        ? "first-group"
        : "second-group";
    },
  },
  created() {
    const route = useRoute();
    const projectId = route.params.id;
    this.getAllEquipmentSets();
    this.getProjectByID(projectId);
    this.getAllEquipment()
    this.getConflictingEquipment(projectId)
    this.getAllDrafts();
  },
};
</script>

<style scoped>
.second-group {
  margin-left: 20px;
}
.first-group {
  font-weight: bolder;
}
</style>
