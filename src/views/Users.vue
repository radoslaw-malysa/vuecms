<template>
  <v-container class="pt-4 pb-10" v-scroll="onScroll">
    
    <div class="h-56">
      <div id="finder" class="find-container" v-bind:class="{ sticked: finderSticked }">
        <div class="container">
          <v-toolbar
            flat
            outlined
            rounded
            :height="finderHeight"
            class="rounded-pill find-toolbar nob-dark"
          >
            <v-text-field
              label="Adres e-mail"
              solo
              flat
              hide-details
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-divider
              class="mx-4"
              vertical
            ></v-divider>
            <v-select
              :items="itemsx"
              label="Grupa robocza"
              solo
              flat
              hide-details
            ></v-select>
            <v-divider
              class="ml-4"
              vertical
            ></v-divider>
            <v-btn icon class="ml-1" color="primary" @click="editItem(0)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </div>
    </div>

    <v-toolbar
      flat
      height="56px"
      class="filter-toolbar nobg-dark my-3 mb-12"
    >
      <v-select
        :items="itemsx"
        placeholder="Status"
        dense
        outlined
        rounded
        hide-details
        class="mr-2 state-select"
      ></v-select>
      <v-spacer></v-spacer>
     </v-toolbar>

    <v-card
      outlined
      class="nobg-dark"
    >
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="50"
        :options.sync="options"
        :server-items-length="totalItems"
        :footer-props="{
          itemsPerPageOptions: [50, 100],
          'items-per-page-text': 'Pokaż na stronie'
        }"
        :loading="loading"
        loading-text="Pobieram dane..."
        class="nobg-dark"
        :hide-default-footer="countItems == 0"
        :hide-default-header="countItems == 0"
      >
        <template v-slot:item.id_group="{ item }">
          {{ groups[item.id_group].name }}
        </template>
        <template v-slot:item.state="{ item }">
          {{ states[item.state].name }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            @click="editItem(item.id)"
          >
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          Nic nie znaleziono
        </template>
      </v-data-table>
    </v-card>
    <users-edit v-bind:id="editId" v-bind:dialog="editDialog" v-on:close-edit="editDialog = false" v-on:edit-updated="editUpdated" />
  </v-container>
</template>

<script>
  import cms from '../api/cms'
  import UsersEdit from '../components/UsersEdit.vue';
  export default {
    name: 'Users',
    components: {
      UsersEdit
    },
    data: () => ({
      tableName: 'users',
      results: [], //from cms
      totalItems: 0, //from cms
      loading: false,
      editDialog: false,
      editId: 0,

      finderTop: 0, //finder
      finderSticked: false, //finder

      options: {}, //filters for async fetch/paginate
      headers: [
        { text: 'Email',  align: 'start', sortable: true, value: 'email' },
        { text: 'Grupa', align: 'start', sortable: true, value: 'id_group' },
        { text: 'Utworzony', align: 'start', sortable: true, value: 'create_time' },
        { text: 'Status', align: 'start', value: 'state' },
        { text: '', align: 'start', value: 'actions', sortable: false }
      ],
      state: '',
      states: [
        { id: 0, name: 'Nieaktywny', color: 'accent' },
        { id: 1, name: 'Aktywny', color: 'secondary' },
      ],
      group: '',
      groups: [
        { id: 1, name: 'Administratorzy' },
        { id: 2, name: 'Redaktorzy' },
      ],
      
      

      itemsx: ['Kategoria', 'Foo', 'Bar', 'Fizz', 'Buzz'],
      selectTag: null,
      ord: false,
      
    }),
    computed: {
      finderHeight() {
        return (this.finderSticked) ? 64 : 56
      },
      items() {
        return this.results
      },
      itemsTotal() {
        return this.totalItems
      },
      countItems() {
        return this.items.length
      }
    },
    mounted() {
      this.stickFinderInit();
      this.getItems();
    },
    watch: {
      options: {
        handler () {
          this.getItems()
        },
        deep: true,
      },
    },
    methods: {
      getItems() {
        const { page, itemsPerPage, sortBy, sortDesc } = this.options;
        let queryOptions = {
          page, 
          itemsPerPage,
          orderBy: (sortBy[0] !== undefined) ? sortBy[0] : '',
          orderDesc: (sortDesc[0] === true) ? 1 : 0,
        }
        if (this.state) { queryOptions.state = this.state }
        if (this.email) { queryOptions.email = this.email }
        if (this.group) { queryOptions.id_group = this.group }

        this.loading = true;
        cms.getItems(this.tableName, queryOptions)
        .then(response => {
          if (response.results) {
            this.results = response.results;
            this.totalItems = response.totalItems;
          } else {
            this.results = [];
            this.totalItems = 0;
          }
          this.loading = false;
        });
      },
      editItem(id) {
        this.editId = id;
        this.editDialog = true;
      },
      editUpdated() {
        this.editDialog = false;
        this.getItems();
      },
      stickFinderInit() {
        const finder = document.getElementById("finder");
        var rect = finder.getBoundingClientRect(),
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.finderTop = rect.top + scrollTop;
      },
      onScroll () {
        let scrollT = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollT > this.finderTop) {
          this.finderSticked = true;
        } else {
          this.finderSticked = false;
        }
      },
    }
  }
</script>
