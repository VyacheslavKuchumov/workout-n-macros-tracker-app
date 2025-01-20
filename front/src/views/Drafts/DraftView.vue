<template>
  <v-card class="elevation-5 mt-5 ml-auto mr-auto" max-width="1100">
    <v-data-table
      v-if="drafts"
      :headers="headers"
      :items="filteredDrafts"
      :items-per-page="-1"
      :search="search"
      hide-default-footer
      fixed-header
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Шаблоны</v-toolbar-title>
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

          <v-btn class="mb-2" color="primary" dark @click="openCreateDialog">
            Новый шаблон
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action_see_equipment="{ item }">
            <v-btn
              size="small"
              color="secondary"
              @click="goToDraftEquipment(item)"
              prepend-icon="mdi-camera"
            >
              Оборудование
            </v-btn>
      </template>
      <template v-slot:[`item.action_edit`]="{ item }">
        <v-btn size="small" color="blue-darken-1" @click="openEditDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.action_delete`]="{ item }">
        <v-btn size="small" color="red-darken-1" @click="confirmDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:no-data> Нет данных </template>
    </v-data-table>
  </v-card>

  <!-- Диалог создания/редактирования -->
  <v-dialog v-model="editDialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h5">
        {{ editingDraft ? "Редактировать шаблон" : "Создать шаблон" }}
      </v-card-title>
      <v-card-text>
        <v-form ref="draftForm" v-model="valid" @submit.prevent="saveDraft">
          <v-text-field
            v-model="draftForm.draft_name"
            label="Название"
            :rules="[rules.required]"
          ></v-text-field>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeEditDialog()">Отмена</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="saveDraft()">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Диалог подтверждения удаления -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить шаблон "{{ draftToDelete?.draft_name }}"?
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
      editDialog: false,
      draftToDelete: null,
      editingDraft: null,
      draftForm: {
        draft_name: "",
        
      },
      valid: false,
      rules: {
        required: (value) => !!value || "Это поле обязательно",
      },
    };
  },
  computed: {
    ...mapState("drafts", ["drafts"]),
    headers() {
      return [
        { title: "Название", key: "draft_name" },
        { title: "Оборудование", key: "action_see_equipment", sortable: false },
        { title: "Изменить", key: "action_edit", sortable: false },
        { title: "Удалить", key: "action_delete", sortable: false },
      ];
    },
    filteredDrafts() {
      if (!this.search) {
        return this.drafts;
      }
      const searchTerm = this.search.toLowerCase();
      return this.drafts.filter((item) =>
        item.draft_name.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    ...mapActions("drafts", ["getAllDrafts", "deleteDraft", "createDraft", "updateDraft"]),
    goToDraftEquipment(item) {
      this.$router.push(`/draft/${item.draft_id}`);
    },
    openCreateDialog() {
      this.editingDraft = null;
      this.draftForm = { draft_name: ""};
      this.editDialog = true;
    },
    openEditDialog(item) {
      this.editingDraft = item;
      this.draftForm = { ...item };
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
      this.draftForm = { draft_name: ""};
    },
    saveDraft() {
      const draftData = { ...this.draftForm };
      if (this.editingDraft) {
        draftData.draft_id = this.editingDraft.draft_id;
        this.updateDraft(draftData);
      }
      else {
        this.createDraft(draftData);
      }
      this.closeEditDialog();
      
    },
    confirmDelete(item) {
      this.draftToDelete = item;
      this.confirmDeleteDialog = true;
    },
    closeConfirmDialog() {
      this.confirmDeleteDialog = false;
      this.draftToDelete = null;
    },
    deleteConfirmed() {
      if (this.draftToDelete) {
        this.deleteDraft(this.draftToDelete.draft_id)
        this.closeConfirmDialog();
      }
    },
  },
  created() {
    this.getAllDrafts();
  },
};
</script>
