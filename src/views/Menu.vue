<template>
  <v-container class="pt-4 pb-16 mb-4" v-scroll="onScroll">
    
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
              v-model="q"
              label="Szukaj tagu"
              solo
              flat
              hide-details
              prepend-inner-icon="tag"
              clearable
            ></v-text-field>
            <v-divider
              class="mx-4"
              vertical
            ></v-divider>
            <v-select
              :items="config.langs"
              item-text="title"
              item-value="id"
              v-model="filters.id_lang"
              label="Język"
              solo
              flat
              hide-details
              dense
            ></v-select>
            <v-divider
              class="mx-4"
              vertical
            ></v-divider>
            <v-btn icon color="primary" @click="editItem(0)">
              <v-icon>add</v-icon>
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
        v-model="filters.active"
        :items="[{id: 1, title: 'Aktywny'},{id: 2, title: 'Nieaktywny'}]"
        item-text="title"
        item-value="id"
        placeholder="Status"
        clearable
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
        :items-per-page="itemsPerPage"
        :options.sync="options"
        :page.sync="page"
        :server-items-length="totalItems"
        hide-default-footer
        :loading="loading"
        loading-text="Pobieram dane..."
        @page-count="pageCount = $event"
        class="nobg-dark"
        item-class="css"
      >
        <template v-slot:item.id_lang="{ item }">
          {{ (item.id_lang == 2) ? 'EN' : 'PL' }}
        </template>
        <template v-slot:item.state="{ item }">
          {{ (item.state == 1) ? 'Aktywna' : 'Nieaktywna' }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            @click="editItem(item.id)"
          >
            <v-icon>
              edit
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          Nic nie znaleziono
        </template>
      </v-data-table>

      <div v-if="pageCount > 1" class="paginate-bar py-1" v-bind:class="{ sticked: finderSticked }">
        <v-pagination
          v-model="page"
          :length="pageCount"
          total-visible="10"
        ></v-pagination>
      </div>
    </v-card>
    <pages-edit v-bind:id="editId" v-bind:dialog="editDialog" v-on:close-edit="editDialog = false" v-on:edit-updated="editUpdated" />
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cms from '../api/cms'
  import MenuEdit from '../components/MenuEdit.vue';
  export default {
    name: 'Menu',
    components: {
      MenuEdit
    },
    data: () => ({
      tableName: 'menu',
      results: [], 
      totalItems: 0,
      itemsPerPage: 50,
      page: 1,
      pageCount: 0,

      loading: false,
      editDialog: false,
      editId: 0,

      //finder bar stick
      finderTop: 0,
      finderSticked: false,

      //filters
      options: {},
      filters: {
        q: '',
        state: '',
        id_lang: 1
      },
      
      //title ajax find
      q: '',
      qTimeout: null,
      
      //table
      headers: [
        { text: 'Nazwa',  align: 'start', sortable: true, value: 'title' },
        { text: 'Kolejność', align: 'start', sortable: true, value: 'ord' },
        { text: 'Status', align: 'start', value: 'state' },
        { text: 'Język', align: 'start', value: 'id_lang' },
        { text: '', align: 'end', value: 'actions', sortable: false }
      ],
      
      itemsx: ['Kategoria', 'Foo', 'Bar', 'Fizz', 'Buzz'],
      selectTag: null,
      ord: false,
      
    }),
    computed: {
      ...mapGetters('config', ['config', 'categories']),
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
    },
    watch: {
      options: {
        handler () {
          this.getItems()
        },
        deep: true,
      },
      filters: {
        handler () {
          if (this.options.page == 1) {
            this.getItems();
          } else {
            this.page = 1;
          }
        },
        deep: true,
      },
      q(newVal) {
        if (this.qTimeout) {
          clearTimeout(this.qTimeout);
        }
        this.qTimeout = setTimeout(() => {
          this.filters.q = newVal
        }, 550);
      },
    },
    methods: {
      getItems() {
        // console.log(new Date().getTime());
        this.loading = true;
        let params = {...this.options, ...this.filters};
        cms.getItems(this.tableName, params)
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
