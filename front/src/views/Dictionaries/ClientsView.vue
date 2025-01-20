<template>
  <v-container width="600">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="Clients"
          item-value="client_id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Clients</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Add
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteItem(item.client_id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ form.client_id ? "Edit" : "Add" }} Client</span
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.client_name"
            label="Client Name"
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
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      form: { client_id: null, client_name: "" },
      headers: [
        { title: "Name", value: "client_name", width: "auto" },
        { title: "Actions", value: "actions", sortable: false, width: "auto" },
      ],
    };
  },
  computed: {
    ...mapState("clients", ["clients"]),
    Clients() {
      return this.clients || [];
    },
  },
  methods: {
    ...mapActions("clients", [
      "getAllClients",
      "createClient",
      "updateClient",
      "deleteClient",
    ]),
    openDialog(item = null) {
      this.form = item ? { ...item } : { client_id: null, client_name: "" };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveItem() {
      if (this.form.client_id) {
        await this.updateClient(this.form);
      } else {
        await this.createClient(this.form);
      }

      this.closeDialog();
      this.updateClientsTable();
    },
    async deleteItem(id) {
      await this.deleteClient({ client_id: id });
      this.updateClientsTable();
    },
    updateClientsTable() {
      this.getAllClients();
    },
  },
  created() {
    this.updateClientsTable();
  },
};
</script>
