<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5"
          >Новое оборудование для комплекта
          {{ this.one_set.equipment_set_name }}</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                clearable
                v-model="newEquipment.equipment_name"
                label="Название оборудования"
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                clearable
                v-model="newEquipment.description"
                label="Описание"
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                clearable
                v-model="newEquipment.serial_number"
                label="Серийный номер"
              />
            </v-col>

            <!-- <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                clearable
                label="Название комплекта"
                v-model="newEquipment.equipment_set_name"
                :items="equipmentSetNames"
              ></v-autocomplete>
            </v-col> -->

            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                clearable
                v-model="newEquipment.warehouse_name"
                :items="warehouseNames"
                label="Место хранения"
              ></v-autocomplete>
            </v-col>
            <!-- <v-col cols="12" md="6" sm="6">
              <v-switch v-model="newEquipment.needs_maintenance" label="Требует обслуживания" />
            </v-col> -->
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                clearable
                prepend-icon="mdi-calendar"
                label="Дата покупки"
                v-model="newEquipment.date_of_purchase"
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
                clearable
                v-model="newEquipment.cost_of_purchase"
                label="Стоимость покупки"
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
import { mapActions, mapState } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  data() {
    return {
      dialog: false,
      datePickerDate: new Date(),
      set_id: null,
      newEquipment: {
        equipment_name: "",
        description: "",
        serial_number: "",
        equipment_set_name: "", // Changed to hold the selected equipment type object
        warehouse_name: "", // Changed to hold the selected warehouse object
        needs_maintenance: false,
        date_of_purchase: "",
        cost_of_purchase: "",
      },
    };
  },
  computed: {
    ...mapState("equipment_set", ["equipmentSetNames", "one_set"]),
    ...mapState("warehouse", ["warehouseNames"]),
  },
  methods: {
    ...mapActions("equipment", ["createEquipment"]),
    ...mapActions("equipment_set", [
      "getAllEquipmentSets",
      "getAllEquipmentSetNames",
      "getEquipmentSetByID",
    ]),
    ...mapActions("warehouse", ["getAllWarehouses", "getAllWarehouseNames"]),

    // Updating the date using date picker
    updateDate() {
      const date = new Date(this.datePickerDate);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.newEquipment.date_of_purchase = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.dialog = false;
    },

    // Save method
    save() {
      this.newEquipment.equipment_set_name = this.one_set.equipment_set_name;
      this.createEquipment(this.newEquipment);
      window.location.href = `/equipment/${this.set_id}`;
      
    },

    cancel() {
      this.$router.push(`/equipment/${this.set_id}`);
    },
  },
  created() {
    const route = useRoute();

    this.set_id = route.params.set_id;
    const setId = route.params.set_id;
    this.getEquipmentSetByID(setId);

    this.getAllWarehouseNames();
    this.getAllEquipmentSetNames();
  },
};
</script>
