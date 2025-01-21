<template>
    <v-card class="elevation-5 mt-5 ml-auto mr-auto" max-width="1100">
      <v-data-table
        v-if="workouts()"
        :headers="headers"
        :items="workouts()"
        :items-per-page="-1"
        hide-default-footer
        fixed-header
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Тренировки</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
  
            <v-spacer></v-spacer>
  
            <v-btn class="mb-2" color="primary" dark @click="openCreateDialog">
              Добавить
            </v-btn>
          </v-toolbar>
        </template>
        
        <template v-slot:item.action_see_exercises="{ item }">
            <v-btn size="small" color="green-darken-1" @click="seeExercises(item)">
                <v-icon>mdi-weight-lifter</v-icon>
            </v-btn>
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
    <v-dialog v-model="editDialog" max-width="450px">
      <v-card>
        <v-card-title class="text-h5">
          {{ editingWorkout ? "Редактировать" : "Создать" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="workoutForm" v-model="valid" @submit.prevent="saveWorkout">
            <v-text-field
              v-model="workoutForm.workout_name"
              label="Название"
              :rules="[rules.required]"
            ></v-text-field>
            
            <v-text-field
              v-model="workoutForm.workout_date"
              label="Дата тренировки"
              :rules="[rules.required]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeEditDialog()">Отмена</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveWorkout()">
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
          Вы уверены, что хотите удалить "{{ workoutToDelete?.workout_name }}"?
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
        workoutToDelete: null,
        editingWorkout: null,
        workoutForm: {
          workout_name: "",
          workout_date: "",
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
          { title: "Название", key: "workout_name" },
          
          { title: "Дата", key: "workout_date" },
          { title: "", key: "action_see_exercises", sortable: false },
          { title: "", key: "action_edit", sortable: false },
          { title: "", key: "action_delete", sortable: false },
        ];
      },
    },
    methods: {
      ...mapActions({
        getWorkouts: "workouts/getWorkouts",
        createWorkout: "workouts/createWorkout",
        updateWorkout: "workouts/updateWorkout",
        deleteWorkout: "workouts/deleteWorkout",
      }),
  
      workouts() {
        return this.$store.state.workouts.data;
      },
      openCreateDialog() {
        this.editingWorkout = null;
        this.workoutForm = { workout_name: "", workout_date: "" };
        this.editDialog = true;
      },
      openEditDialog(item) {
        this.editingWorkout = item;
        this.workoutForm = { ...item };
        this.editDialog = true;
      },
      closeEditDialog() {
        this.editDialog = false;
        this.workoutForm = { workout_name: "", workout_date: "" };
      },
      async saveWorkout() {
        const workoutData = { ...this.workoutForm };
        if (this.editingWorkout) {
          workoutData.workout_id = this.editingWorkout.workout_id;
          await this.updateWorkout(workoutData);
          await this.getWorkouts();
        } else {
          await this.createWorkout(workoutData);
          await this.getWorkouts();
        }
        this.closeEditDialog();
      },
      confirmDelete(item) {
        this.workoutToDelete = item;
        this.confirmDeleteDialog = true;
      },
      closeConfirmDialog() {
        this.confirmDeleteDialog = false;
        this.workoutToDelete = null;
      },
      async deleteConfirmed() {
        if (this.workoutToDelete) {
          await this.deleteWorkout(this.workoutToDelete.workout_id);
          await this.getWorkouts();
          this.closeConfirmDialog();
        }
      },
    },
    async created() {
      await this.getWorkouts();
    },
  };
  </script>
  