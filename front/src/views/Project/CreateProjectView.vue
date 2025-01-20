<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Новая съёмка</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="newProject.project_name"
                label="Название"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                v-model="newProject.project_type_name"
                :items="projectTypeNames"
                label="Площадка"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="newProject.shooting_start_date"
                label="Дата начала съемок"
                prepend-icon="mdi-calendar"
                @click="dialogStart = true"
                readonly
                clearable
              />
              <v-dialog v-model="dialogStart" width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerStartDate" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogStart = false"
                      >Закрыть</v-btn
                    >
                    <v-btn text color="primary" @click="updateStartDate"
                      >OK</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>

            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="newProject.shooting_end_date"
                label="Дата конца съемок"
                prepend-icon="mdi-calendar"
                @click="dialogEnd = true"
                readonly
                clearable
              />
              <v-dialog v-model="dialogEnd" width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerEndDate" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogEnd = false"
                      >Закрыть</v-btn
                    >
                    <v-btn text color="primary" @click="updateEndDate"
                      >OK</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                v-model="newProject.chief_engineer_name"
                :items="userNames"
                label="Главный инженер"
                clearable
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" @click="cancel">Отменить</v-btn>
        <v-btn color="blue-darken-1" @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogStart: false,
      dialogEnd: false,
      datePickerStartDate: new Date(),
      datePickerEndDate: new Date(),
      newProject: {
        project_name: "",
        archived: false,
        project_type_name: "",
        chief_engineer_name: "",
        shooting_start_date: "",
        shooting_end_date: "",
      },
    };
  },
  computed: {
    ...mapState("project_types", ["projectTypes", "projectTypeNames"]),

    ...mapState("user", ["user", "userNames"]),
  },
  methods: {
    ...mapActions("projects", ["createProject"]),
    ...mapActions("project_types", [
      "getProjectTypeNames",
      "getAllProjectTypes",
      "createProjectType",
      "updateProjectType",
      "deleteProjectType",
    ]),

    ...mapActions("user", ["getAllUsers", "getAllUserNames"]),

    // Update the date using date picker
    updateStartDate() {
      const date = new Date(this.datePickerStartDate);

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.newProject.shooting_start_date = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.newProject.shooting_end_date = date.toISOString().split("T")[0];
      this.dialogStart = false;
    },

    updateEndDate() {
      const date = new Date(this.datePickerEndDate);

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.newProject.shooting_end_date = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.dialogEnd = false;
    },

    // Save method
    save() {
      this.createProject(this.newProject);
      this.$router.push("/projects");
    },

    cancel() {
      this.$router.push("/projects");
    },
  },
  created() {
    // Fetch all necessary data
    this.getProjectTypeNames();
    this.getAllUserNames();
  },
};
</script>
