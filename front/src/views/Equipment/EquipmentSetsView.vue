<template>
  <v-container max-width="1400">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="filteredEquipmentSets"
          :group-by="groupBy"
          item-value="id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Комплекты оборудования</v-toolbar-title>
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
              <v-btn class="mb-2" color="primary" dark to="/set_types">
                Виды комплектов
              </v-btn>
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Добавить комплект
              </v-btn>
            </v-toolbar>
          </template>

          <template
            v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
          >
            <tr>
              <td :colspan="columns.length" @click="toggleGroup(item)">
                <v-btn
                  :icon="
                    isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'
                  "
                  size="small"
                  variant="text"
                ></v-btn>
                <span>{{ item.value }}</span>
              </td>
            </tr>
          </template>

          <template v-slot:item.actions_see_equipment="{ item }">
            <v-btn
              size="small"
              color="secondary"
              @click="goToSetEquipment(item)"
              prepend-icon="mdi-camera"
            >
              Оборудование
            </v-btn>
          </template>
          <template v-slot:item.actions_edit="{ item }">
            <v-btn size="small" color="blue-darken-1" @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.actions_delete="{ item }">
            <v-btn
              size="small"
              color="red-darken-1"
              @click="confirmDelete(item.equipment_set_id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Диалог добавления/изменения комплекта -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{
              form.equipment_set_id ? "Изменить" : "Добавить"
            }}
            комплект</span
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.equipment_set_name"
            label="Введите название комплекта"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.description"
            label="Введите описание комплекта"
            required
          ></v-text-field>
          <v-autocomplete
            v-model="form.set_type_name"
            label="Введите вид комплекта"
            :items="setTypeNames"
            clearable
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Cancel</v-btn>
          <v-btn color="primary" @click="saveItem()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить этот комплект?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeConfirmDialog()">Отмена</v-btn>
          <v-btn color="red" @click="deleteConfirmed()">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      confirmDeleteDialog: false,
      equipmentSetToDelete: null,
      search: "",
      form: {
        equipment_set_id: null,
        equipment_set_name: "",
        set_type_name: "",
        description: "",
      },
      headers: [
        { title: "Название", value: "equipment_set_name", sortable: true },
        { title: "Описание", value: "description", sortable: false },
        { title: "Оборудование", key: "actions_see_equipment", sortable: false },
        { title: "Изменить", value: "actions_edit", sortable: false },
        { title: "Удалить", value: "actions_delete", sortable: false },
      ],
    };
  },
  computed: {
    ...mapState("equipment_set", ["equipment_sets"]),
    ...mapState("set_types", ["setTypeNames"]),
    equipmentSets() {
      return this.equipment_sets || [];
    },
    groupBy() {
      return [
        { key: "type.set_type_name", order: "asc" },
      ];
    },
    filteredEquipmentSets() {
      if (!this.search) return this.equipmentSets;
      return this.equipmentSets.filter((item) =>
        item.equipment_set_name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    ...mapActions("equipment_set", [
      "getAllEquipmentSets",
      "createEquipmentSet",
      "updateEquipmentSet",
      "deleteEquipmentSet",
    ]),
    ...mapActions("set_types", ["getSetTypeNames"]),
    openDialog(item = null) {
      this.form = item
        ? { ...item, set_type_name: item.type.set_type_name }
        : { equipment_set_id: null, equipment_set_name: "", set_type_name: "", description: "" };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveItem() {
      if (this.form.equipment_set_id) {
        this.updateEquipmentSet(this.form);
      } else {
        this.createEquipmentSet(this.form);
      }
      this.closeDialog();
    },
    confirmDelete(id) {
      this.equipmentSetToDelete = id;
      this.confirmDeleteDialog = true;
    },
    closeConfirmDialog() {
      this.confirmDeleteDialog = false;
      this.equipmentSetToDelete = null;
    },
    deleteConfirmed() {
      if (this.equipmentSetToDelete) {
        this.deleteEquipmentSet({ equipment_set_id: this.equipmentSetToDelete });
      }
      this.closeConfirmDialog();
    },
    goToSetEquipment(item) {
      this.$router.push(`/equipment/${item.equipment_set_id}`);
    },
  },
  beforeMount() {
    this.getAllEquipmentSets();
    this.getSetTypeNames();
  },
};
</script>
