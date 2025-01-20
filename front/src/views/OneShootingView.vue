<template>
  
  <v-card class="elevation-5 mt-5">
    <v-toolbar flat>
      <v-toolbar-title>Съёмка</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-btn v-if="!isScanning" class="mb-2" color="primary" @click="barcodeScan" >
        Сканировать Оборудование
      </v-btn>
      <v-btn v-else class="mb-2" color="red" @click="barcodeScan" >
        Остановить скан
      </v-btn>
    </v-toolbar>

    <!-- Select Equipment Section -->
    <v-card class="pa-4">
      <v-form v-if="equipment">
        <v-select
          v-model="selection"
          :items="equipment"
          item-title="equipment_name"
          item-value="id"
          label="Select an option"
          multiple
          
        ></v-select>
        <v-btn class="mt-4" color="primary" @click="addEquipmentToShooting">
          Добавить оборудование в съемку
        </v-btn>
      </v-form>
    </v-card>
    <v-card>
      <v-data-table v-if="shooting_equipment" :headers="headers" :items="shooting_equipment">
        <template v-slot:item.actions="{ item }">
          <v-btn color="red" @click="deleteRow(item.id)">
            Убрать
          </v-btn>
        </template>
        <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    </v-card>
    
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    data() {
      return {
        barcodeData: "",
        buffer: "",
        isScanning: false,
        selection: [],
        // items: [
        //   {"id":1, "equipment_name": "test equipment"}
        // ],
        
      };
    },
    computed: {
      // Map the state to fetch equipment from Vuex store
      ...mapState('equipment', ['equipment']),
      ...mapState('shooting_equipment', ['shooting_equipment']),
      headers() {
        return [
          { title: 'ID', key: 'id' },
          { title: 'НАЗВАНИЕ', key: 'equipment.equipment_name' },
          { title: 'СЕРИЙНЫЙ НОМЕР', key: 'equipment.serial_number' },
          { title: 'ПОДТВЕРЖДЕН', key: 'flag', sortable: false },
          { title: '', key: 'actions', sortable: false },
        ];
      },
    },
    methods: {
      barcodeScan(){
        if (!this.isScanning){
          window.addEventListener('keypress', this.handleKeypress);
        }else{
          
          // Clean up listener
          window.removeEventListener('keypress', this.handleKeypress);
          this.buffer = ""; // Reset buffer when stopping
        }
        
        this.isScanning = !this.isScanning
      },
      processBarcode(data){
        console.log(this.barcodeData) // BARCODE DATA
      },
      handleKeypress(event) {
        if (!this.isScanning) return; // Ignore keypresses when not scanning

        if (event.key === 'Enter') {
          this.barcodeData = this.buffer; // Assign buffer to barcodeData
          
          this.processBarcode(this.barcodeData)
          this.buffer = ""; // Reset the buffer
          
          return;
        }
        this.buffer += event.key;
      },
      ...mapActions('equipment', ['getAllEquipment']), // Action to load equipment
      ...mapActions('shooting_equipment', ['addEquipmentInShootingByID', 'getAllEquipmentInShootingByID', 'deleteEquipmentInShootingByID']),
      addEquipmentToShooting(){
        Object.values(this.selection).forEach(element => {
          this.addEquipmentInShootingByID({ "equipment_id": element,
          "shooting_id": "1"}) // HARDCODED shooting_id NEEDS TO BE CHANGED
        });
        this.getAllEquipmentInShootingByID(1) // HARDCODED shooting_id NEEDS TO BE CHANGED
        this.selection = []
      },
      deleteRow(id){
        this.deleteEquipmentInShootingByID({id:id, shooting_id: 1}) // HARDCODED shooting_id NEEDS TO BE CHANGED
        this.getAllEquipmentInShootingByID(1) // HARDCODED shooting_id NEEDS TO BE CHANGED
        
      }
    

      
    },
    beforeMount() {
      this.getAllEquipment()
      this.getAllEquipmentInShootingByID(1)
    },
    beforeUnmount(){
      // Clean up listener
      window.removeEventListener('keypress', this.handleKeypress);
      this.buffer = ""; // Reset buffer when stopping
    }
  };
</script>
