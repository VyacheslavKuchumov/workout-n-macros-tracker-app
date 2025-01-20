<template>
  <v-container v-if="editedEquipment">
    <v-card>
      <v-card-title>
        <span class="text-h5"
          >Изменить оборудование "{{ editedEquipment.equipment_name }}"</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedEquipment.equipment_name"
                label="Название оборудования"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedEquipment.description"
                label="Описание"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedEquipment.serial_number"
                label="Серийный номер"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-select
                v-model="editedEquipment.warehouse_name"
                :items="warehouseNames"
                label="Место хранения"
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                clearable
                v-model="editedEquipment.current_storage_name"
                :items="warehouseNames"
                label="Настоящее место хранения"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-select
                v-model="editedEquipment.equipment_set_name"
                :items="equipmentSetNames"
                label="Комплект"
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-switch
                color="red"
                v-model="editedEquipment.needs_maintenance"
                label="Требует обслуживания"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                prepend-icon="mdi-calendar"
                label="Дата покупки"
                v-model="editedEquipment.date_of_purchase"
                @click="dialog = true"
              />
              <v-dialog v-model="dialog" width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerDate" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialog = false"
                      >Закрыть</v-btn
                    >
                    <v-btn text color="primary" @click="updateDate">OK</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedEquipment.cost_of_purchase"
                label="Стоимость покупки"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="save">
          Сохранить
        </v-btn>
        <v-btn color="red-darken-1" variant="text" @click="cancel">
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  data() {
    return {
      dialog: false,
      set_id: null,
      datePickerDate: new Date(),
    };
  },
  computed: {
    ...mapState("equipment", ["editedEquipment"]),
    ...mapState("equipment_set", ["equipmentSetNames"]),
    ...mapState("warehouse", ["warehouseNames"]),
  },
  methods: {
    ...mapActions("equipment", ["updateEquipment", "getEquipmentByID"]),
    ...mapActions("equipment_set", ["getAllEquipmentSetNames"]),
    ...mapActions("warehouse", ["getAllWarehouseNames"]),

    async save() {
      await this.updateEquipment(this.editedEquipment);
      window.location.href = `/equipment/${this.set_id}`;
    },
    cancel() {
      this.$router.push(`/equipment/${this.set_id}`);
    },
    updateDate() {
      const date = new Date(this.datePickerDate);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.editedEquipment.date_of_purchase = date.toISOString().split("T")[0]; // Russian formatting
      this.dialog = false;
    },
  },
  async created() {
    const route = useRoute();
    const equipmentId = route.params.id;
    this.set_id = route.params.set_id;
    this.getEquipmentByID(equipmentId);

    this.getAllWarehouseNames();
    this.getAllEquipmentSetNames();
  },
};
</script>
