<template>
    <v-card class="elevation-5 mt-5 ml-auto mr-auto" max-width="1100">
      <v-data-table
        v-if="exercisesInWorkout()"
        :headers="headers"
        :items="exercisesInWorkout()"
        :items-per-page="-1"
        hide-default-footer
        fixed-header
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Упражнения в тренировке</v-toolbar-title>
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
  
      <!-- Create/Edit Dialog -->
      <v-dialog v-model="editDialog" max-width="450px">
        <v-card>
          <v-card-title class="text-h5">
            {{ editingEntry ? "Редактировать" : "Создать" }}
          </v-card-title>
          <v-card-text>
            <v-form ref="exerciseInWorkoutForm" v-model="valid" @submit.prevent="saveEntry">
              <v-select
                v-model="form.exercise_id"
                :items="availableExercises"
                item-text="exercise_name"
                item-value="exercise_id"
                label="Упражнение"
                :rules="[rules.required]"
              ></v-select>
              <v-text-field
                v-model="form.weight"
                label="Вес"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="form.reps"
                label="Повторения"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="form.set"
                label="Подход"
                type="number"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeEditDialog()">Отмена</v-btn>
            <v-btn color="primary" :disabled="!valid" @click="saveEntry()">
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Confirm Delete Dialog -->
      <v-dialog v-model="confirmDeleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
          <v-card-text>
            Вы уверены, что хотите удалить это упражнение из тренировки?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeConfirmDialog()">Отмена</v-btn>
            <v-btn color="red" @click="deleteConfirmed()">Удалить</v-btn>
          </v-card-actions>
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
        confirmDeleteDialog: false,
        editDialog: false,
        entryToDelete: null,
        editingEntry: null,
        form: {
          exercise_id: null,
          weight: null,
          reps: null,
          set: null,
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
          { title: "Упражнение", key: "exercise_id", sortable: false },
          { title: "Вес (кг)", key: "weight" },
          { title: "Повторения", key: "reps" },
          { title: "Подходы", key: "set" },
          { title: "", key: "action_edit", sortable: false },
          { title: "", key: "action_delete", sortable: false },
        ];
      },
      
    },
    methods: {
      exercisesInWorkout() {
        return this.$store.state.exercises_in_workout.data;
      },
      ...mapActions({
        getEntries: "exercises_in_workout/getExercisesInWorkout",
        createEntry: "exercises_in_workout/createExerciseInWorkout",
        updateEntry: "exercises_in_workout/updateExerciseInWorkout",
        deleteEntry: "exercises_in_workout/deleteExerciseInWorkout",
      }),
      openCreateDialog() {
        this.editingEntry = null;
        this.form = { exercise_id: null, weight: null, reps: null, set: null };
        this.editDialog = true;
      },
      openEditDialog(item) {
        this.editingEntry = item;
        this.form = { ...item };
        this.editDialog = true;
      },
      closeEditDialog() {
        this.editDialog = false;
        this.form = { exercise_id: null, weight: null, reps: null, set: null };
      },
      async saveEntry() {
        const entryData = { ...this.form };
        if (this.editingEntry) {
          entryData.exercise_in_workout_id = this.editingEntry.exercise_in_workout_id;
          await this.updateEntry(entryData);
        } else {
          await this.createEntry(entryData);
        }
        await this.getEntries();
        this.closeEditDialog();
      },
      confirmDelete(item) {
        this.entryToDelete = item;
        this.confirmDeleteDialog = true;
      },
      closeConfirmDialog() {
        this.confirmDeleteDialog = false;
        this.entryToDelete = null;
      },
      async deleteConfirmed() {
        if (this.entryToDelete) {
          await this.deleteEntry(this.entryToDelete.exercise_in_workout_id);
          await this.getEntries();
          this.closeConfirmDialog();
        }
      },
    },
    async created() {
      const route = useRoute();
      const workout_id = route.params.id;
      await this.getEntries(workout_id);
    },
  };
  </script>
  