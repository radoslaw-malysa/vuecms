<template>
  <v-container class="pt-4 pb-16 mb-4">
    <v-card
      outlined
      class="nobg-dark pb-1 mt-4"
    >
      <v-list two-line>
        <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Narzędzia administracyjne</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Kino - import repertuaru</v-list-item-title>
              <v-list-item-subtitle>{{import_cinema_log.create_time || 'Nie wykonano'}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn depressed 
                @click="importCinema" 
                :loading="loadingCinema"
              >
                Importuj repertuar
              </v-btn>
            </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Kopia bezpieczeństwa bazy danych</v-list-item-title>

              <v-list-item-subtitle>{{db_backup_log.create_time || 'Nie wykonano'}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn depressed 
                @click="dbBackup" 
                :loading="loadingBackup" 
              >
                Wykonaj kopię
              </v-btn>


            </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { apiUrl } from '../api/api';
import cms from '../api/cms';
export default {
  name: 'Admin',
  data: () => ({
    tableName: 'admin',
    results: {},
    loading: false,
    backupUrl: apiUrl + '/execute/backup',
    loadingBackup: false,
    importCinemaUrl: apiUrl + '/execute/cinema',
    loadingCinema: false,

  }),
  computed: {
    items() {
      return this.results
    },
    db_backup_log() {
      return this.items.db_backup || {}
    },
    import_cinema_log() {
      return this.items.import_cinema || {}
    }
  },
  mounted() {
    this.getItems();
  },
  methods: {
    getItems() {
      this.loading = true;
      let params = {};
      cms.getItems(this.tableName, params)
      .then(response => {
        if (response.db_backup) {
          this.results = response;
        } else {
          this.results = {};
          if (response.error == 403) {
            this.$router.push({ path: '/login' })
          }
        }
        this.loading = false;
      });
    },
    dbBackup() {
      this.loadingBackup = true;
      return fetch(this.backupUrl, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(response => {
        this.loadingBackup = false;
        this.getItems();
      })
      .catch(() => console.log('response error'));
    },
    importCinema() {
      this.loadingCinema = true;
      return fetch(this.importCinemaUrl, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.loadingCinema = false;
        this.getItems();
      })
      .catch(() => console.log('response error'));
    },
  }



  
}
</script>