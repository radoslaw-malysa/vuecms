<template>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="960px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="warning"
          dark
          icon
          v-bind="attrs"
          v-on="on"
          title="Historia zmian"
        >
          <v-icon>history</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-space-between">
          <span>Historia zmian</span>
          <v-btn text icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 350px;">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Czas
                  </th>
                  <th class="text-left">
                    Operacja
                  </th>
                  <th class="text-left">
                    Użytkownik
                  </th>
                  <th class="text-left">
                    Opis zmian
                  </th>
                  <th class="text-left">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                >
                  <td>{{ item.create_time }}</td>
                  <td>{{ item.operation_name }}</td>
                  <td>{{ item.user_name }}</td>
                  <td>{{ item.notes }}</td>
                  <td>{{ item.create_ip }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-if="items.length === 0" class="d-flex justify-center pt-4 font-weight-bold">Nie zarejestrowano zmian</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Zamknij
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import cms from '../api/cms'
  export default {
    name: 'LogDialog',
    props: ['id_record', 'table_name'],
    data () {
      return {
        dialog: false,
        loading: false,
        tableName: 'log',
        items: []
      }
    },
    watch: {
      dialog: function (newVal) {
        if (newVal == true) {
          if (this.id != 0) {
            this.loadItem();
          }
        } else {
          //this.resetItem()
        }
      }
    },
    methods: {
      loadItem() {
        this.loading = true;
        cms.getLog(this.table_name, this.id_record, {})
        .then(response => {
          
            this.items = [...response];
          
          this.loading = false;
        });
      },
      resetItem() {
        this.items = []
      }
    }
  }
</script>