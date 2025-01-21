<template>
    
    <v-card class="elevation-5 mt-5 ml-auto mr-auto" max-width="1100">
      <v-data-table
        v-if="exercises()"
        :headers="headers"
        :items="exercises()"
        :items-per-page="-1"

        hide-default-footer
        fixed-header
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Упражнения</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
  
            
            
            <v-spacer></v-spacer>
  
            <v-btn class="mb-2" color="primary" dark @click="openCreateDialog">
              Добавить
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.action_edit="{ item }">
          <v-btn size="small" color="blue-darken-1" @click="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          
        </template>

        <template v-slot:item.action_delete="{ item }">
          
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
          {{ editingDraft ? "Редактировать" : "Создать" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="exerciseForm" v-model="valid" @submit.prevent="saveExercise">
            <v-text-field
              v-model="exerciseForm.exercise_name"
              label="Название"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="exerciseForm.exercise_description"
              label="Описание"
              
            ></v-text-field>
            <v-text-field
              v-model="exerciseForm.muscle_group"
              label="Группа мышц"
              
            ></v-text-field>
  
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeEditDialog()">Отмена</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveExercise()">
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
          Вы уверены, что хотите удалить "{{ exerciseToDelete?.exercise_name }}"?
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
        exerciseToDelete: null,
        editingExercise: null,
        exerciseForm: {
          exercise_name: "",
          exercise_description: "",
          muscle_group: "",
        },
        valid: false,
        rules: {
          required: (value) => !!value || "Это поле обязательно",
        },
      };
    },
    computed: {
      
      headers() {
        return [
            { title: "Название", key: "exercise_name" },
            { title: "Описание", key: "exercise_description" },
            { title: "Группа мышц", key: "muscle_group" },
            { title: "", key: "action_edit", sortable: false },
            { title: "", key: "action_delete", sortable: false },
        ];
      },
      
    },
    methods: {
        ...mapActions({
            getExercises: "exercises/getExercises",
            createExercise: "exercises/createExercise",
            updateExercise: "exercises/updateExercise",
            deleteExercise: "exercises/deleteExercise",
        }),
      
        exercises(){
            return this.$store.state.exercises.data;
        },
        openCreateDialog() {
            this.editingExercise = null;
            this.exerciseForm = { exercise_name: "", exercise_description: "", muscle_group: ""};
            this.editDialog = true;
        },
        openEditDialog(item) {
            this.editingExercise = item;
            this.exerciseForm = { ...item };
            this.editDialog = true;
        },
        closeEditDialog() {
            this.editDialog = false;
            this.exerciseForm = { exercise_name: "", exercise_description: "", muscle_group: ""};
        },
        async saveExercise() {
            const exerciseData = { ...this.exerciseForm };
            if (this.editingExercise) {
                exerciseData.exercise_id = this.editingExercise.exercise_id;
                await this.updateExercise(exerciseData);
                await this.getExercises();
            }
            else {
                await this.createExercise(exerciseData);
                await this.getExercises();
            }
            this.closeEditDialog();
        
        },
        confirmDelete(item) {
            this.exerciseToDelete = item;
            this.confirmDeleteDialog = true;
        },
        closeConfirmDialog() {
            this.confirmDeleteDialog = false;
            this.exerciseToDelete = null;
        },
        async deleteConfirmed() {
            if (this.exerciseToDelete) {
                await this.deleteExercise(this.exerciseToDelete.exercise_id);
                await this.getExercises();
                this.closeConfirmDialog();
            }
        },
    },
    async created() {
      await this.getExercises();
    },
  };
  </script>