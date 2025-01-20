<template>
  <v-card max-width="1600" class="elevation-5 mt-5 mx-auto">
    <v-data-table
      v-if="equipment && one_set"
      :headers="headers"
      :items="filteredEquipment"
      :items-per-page="-1"
      :search="search"
      class="elevation-1"
      fixed-header
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
            >Комплект {{ one_set.equipment_set_name }}</v-toolbar-title
          >
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
          <v-btn class="mb-2" color="primary" dark to="/warehouses">
            Склады
          </v-btn>
          <v-btn class="mb-2" color="primary" dark to="/equipment_sets">
            Комплекты
          </v-btn>
          <v-btn class="mb-2" color="primary" dark @click="goToCreatePage()">
            Новое оборудование
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td align="center">
            <v-icon v-if="item.needs_maintenance" color="orange"
              >mdi-tools</v-icon
            >
            <v-icon v-if="item.current_storage" color="yellow"
              >mdi-warehouse</v-icon
            >
            <v-icon
              v-if="!item.needs_maintenance && !item.current_storage"
              color="green"
              >mdi-check-circle</v-icon
            >
          </td>
          <td>{{ item.equipment_name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.serial_number }}</td>
          <td>{{ item.storage?.warehouse_name || "N/A" }}</td>
          <td>{{ item.current_storage || "N/A" }}</td>
          <td>{{ item.needs_maintenance ? "Да" : "Нет" }}</td>
          <td>{{ item.date_of_purchase }}</td>
          <td>{{ item.cost_of_purchase }}</td>
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
        Вы уверены, что хотите удалить оборудование "{{ equipmentToDelete?.equipment_name }}"?
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
import { useRouter, useRoute } from "vue-router";

export default {
  data() {
    return {
      set_id: null,
      search: "",
      confirmDeleteDialog: false,
      equipmentToDelete: null,
    };
  },
  computed: {
    ...mapState("equipment", ["equipment"]),
    ...mapState("equipment_set", ["one_set"]),
    headers() {
      return [
        { title: "Статус", key: "status", sortable: false },
        { title: "Название", key: "equipment_name" },
        { title: "Описание", key: "description" },
        { title: "Серийный номер", key: "serial_number" },
        { title: "Место хранения", key: "storage.warehouse_name" },
        { title: "Текущее место хранения", key: "current_storage" },
        { title: "Требует обслуживания", key: "needs_maintenance" },
        { title: "Дата покупки", key: "date_of_purchase" },
        { title: "Стоимость покупки", key: "cost_of_purchase" },
        { title: "Изменить", key: "action_edit", sortable: false },
        { title: "Удалить", key: "action_delete", sortable: false },
      ];
    },

    filteredEquipment() {
      if (!this.search) {
        return this.equipment;
      }
      const searchTerm = this.search.toLowerCase();
      return this.equipment.filter((item) =>
        item.equipment_name.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    ...mapActions("equipment", ["getEquipmentBySetID", "deleteEquipment"]),
    ...mapActions("equipment_set", ["getEquipmentSetByID"]),

    goToEditPage(item) {
      this.$router.push(`/equipment/edit/${this.set_id}/${item.equipment_id}`);
    },
    goToCreatePage() {
      this.$router.push(`/equipment/create/${this.set_id}`);
    },

    confirmDelete(item) {
      this.equipmentToDelete = item; // Сохраняем оборудование для удаления
      this.confirmDeleteDialog = true; // Открываем диалог подтверждения
    },
    closeConfirmDialog() {
      this.confirmDeleteDialog = false;
      this.equipmentToDelete = null;
    },
    deleteConfirmed() {
      if (this.equipmentToDelete) {
        this.deleteEquipment(this.equipmentToDelete); // Выполняем удаление
        this.getEquipmentBySetID(this.set_id); // Обновляем список оборудования
        window.location.href = `/equipment/${this.set_id}`;
      }
      this.closeConfirmDialog();
    },
  },

  created() {
    const route = useRoute();
    const setId = route.params.id;
    this.set_id = route.params.id;
    this.getEquipmentBySetID(setId);
    this.getEquipmentSetByID(setId);
  },
};
</script>
