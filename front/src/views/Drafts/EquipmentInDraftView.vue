<template>
    <v-card
      max-width="1100"
      class="elevation-5 mt-5 ml-auto mr-auto"
      v-if="draft"
    >
      <!-- Table for equipment in the draft -->
      <v-data-table
        :group-by="groupByInDraft"
        :headers="headers"
        :items="draft.draft.equipment"
        :items-per-page="-1"
        fixed-header
        hide-default-footer
        hide-default-header
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Шаблон "{{ draft.draft.draft_name }}"
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialog = true">
              Добавить оборудование
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
          <!-- for statuses if needed-->
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
            v-if="draft.sets_in_draft && sets_view"
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
              <!-- for statuses if needed-->
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
              <!-- for statuses if needed-->
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
        sets_view: true,
        searchSets: "",
        searchEquipment: "",
      };
    },
    computed: {
      ...mapState("equipment_in_draft", ["draft", "equipment"]),
      ...mapState("equipment_set", ["equipment_sets"]),
      filteredSets() {
        if (!this.searchSets) return this.draft.sets_in_draft || [];
        const search = this.searchSets.toLowerCase();
        return this.draft.sets_in_draft.filter((item) =>
          item.equipment_set_name.toLowerCase().includes(search)
        );
      },
      filteredEquipment() {
        if (!this.searchEquipment) return this.equipment || [];
        const search = this.searchEquipment.toLowerCase();
        return this.equipment.filter((item) =>
          item.equipment_name.toLowerCase().includes(search)
        );
      },
      headers() {
        return [
          { title: "Статус", key: "status", sortable: false },
          { title: "Название", key: "equipment_name" },
          { title: "", key: "action_add", sortable: false },
          { title: "", key: "action_delete", sortable: false },
        ];
      },
      setsHeaders() {
        return [
          { title: "Статус", key: "status", sortable: false },
          { title: "Название комплекта", key: "equipment_set_name" },
          { title: "Описание", key: "description", sortable: false },
          { title: "", key: "actions_see_equipment", sortable: false },
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
      groupByInDraft() {
        return [
          { key: "equipment_set.type.set_type_name", order: "asc" },
          { key: "equipment_set.equipment_set_name", order: "asc" },
        ];
      },
    },
    methods: {
      ...mapActions("equipment_in_draft", [
        "getDraftByID",
        "addEquipmentToDraft",
        "removeEquipmentFromDraft",
        "addSetToDraft",
        "removeSetFromDraft",
        "getAvailableEquipmentInSet",
      ]),
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
      showEquipment(item) {
        const data = {
          draft_id: this.draft.draft.draft_id,
          equipment_set_id: item.equipment_set_id,
        };
        this.getAvailableEquipmentInSet(data);
        this.sets_view = false;
      },
      deleteItem(item) {
        const data = {
          draft_id: this.draft.draft.draft_id,
          equipment_id: item.equipment_id,
        };
        this.removeEquipmentFromDraft(data);
      },
      addItem(item) {
        const data = {
          draft_id: this.draft.draft.draft_id,
          equipment_id: item.equipment_id,
          equipment_set_id: item.equipment_set_id,
        };
        this.addEquipmentToDraft(data);
      },
      addSet(item) {
        const data = {
          draft_id: this.draft.draft.draft_id,
          equipment_set_id: item.equipment_set_id,
        };
        this.addSetToDraft(data);
      },
      removeSet(item) {
        const data = {
          draft_id: this.draft.draft.draft_id,
          equipment_set_name: item.value,
        };
        this.removeSetFromDraft(data);
      },
      groupClassify(item) {
        return item.key === "equipment_set.type.set_type_name"
          ? "first-group"
          : "second-group";
      },
    },
    created() {
      const route = useRoute();
      const draftId = route.params.id;
      this.getAllEquipmentSets();
      this.getDraftByID(draftId);
      this.getAllEquipment();
    },
  };
  </script>
  