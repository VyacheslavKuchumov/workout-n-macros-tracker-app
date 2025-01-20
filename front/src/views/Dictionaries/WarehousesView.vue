<template>
  <v-container width="600">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="Warehouses"
          item-value="id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Склады</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Добавить
              </v-btn>
            </v-toolbar>
          </template>

          <!-- Кнопка редактирования -->
          <template v-slot:item.actions_edit="{ item }">
            <v-btn size="small" color="blue-darken-1" @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <!-- Кнопка удаления с подтверждением -->
          <template v-slot:item.actions_delete="{ item }">
            <v-btn
              size="small"
              color="red-darken-1"
              @click="openConfirmDialog(item.warehouse_id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Диалог добавления/редактирования склада -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ form.warehouse_id ? "Изменить" : "Добавить" }} склад
          </span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.warehouse_name"
            label="Warehouse Name"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Cancel</v-btn>
          <v-btn color="primary" @click="saveItem()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
        <v-card-text>Вы уверены, что хотите удалить этот склад?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">Отмена</v-btn>
          <v-btn color="red" text @click="confirmDelete()">Удалить</v-btn>
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
      dialog: false, // Диалог добавления/редактирования
      confirmDialog: false, // Диалог подтверждения удаления
      selectedId: null, // ID выбранного склада для удаления
      form: { warehouse_id: null, warehouse_name: "" },
      headers: [
        { title: "Name", value: "warehouse_name", width: "auto" },
        {
          title: "Изменить",
          value: "actions_edit",
          sortable: false,
          width: "20",
        },
        {
          title: "Удалить",
          value: "actions_delete",
          sortable: false,
          width: "20",
        },
      ],
    };
  },
  computed: {
    ...mapState("warehouse", ["warehouses"]),
    Warehouses() {
      return this.warehouses || [];
    },
  },
  methods: {
    ...mapActions("warehouse", [
      "getAllWarehouses",
      "createWarehouse",
      "updateWarehouse",
      "deleteWarehouse",
    ]),

    // Открыть диалог добавления/редактирования
    openDialog(item = null) {
      this.form = item
        ? { ...item }
        : { warehouse_id: null, warehouse_name: "" };
      this.dialog = true;
    },

    // Закрыть диалог добавления/редактирования
    closeDialog() {
      this.dialog = false;
    },

    // Сохранить изменения (добавить или обновить запись)
    async saveItem() {
      if (this.form.warehouse_id) {
        await this.updateWarehouse(this.form);
      } else {
        await this.createWarehouse(this.form);
      }
      this.getAllWarehouses();
      this.closeDialog();
    },

    // Открыть диалог подтверждения удаления
    openConfirmDialog(id) {
      this.selectedId = id; // Сохраняем ID для удаления
      this.confirmDialog = true; // Открываем диалог подтверждения
    },

    // Подтвердить и выполнить удаление
    confirmDelete() {
      if (this.selectedId) {
        this.deleteWarehouse({ warehouse_id: this.selectedId });
        this.getAllWarehouses();
      }
      this.confirmDialog = false; // Закрываем диалог
      this.selectedId = null; // Сбрасываем выбранный ID
    },
  },
  beforeMount() {
    this.getAllWarehouses();
  },
};
</script>
