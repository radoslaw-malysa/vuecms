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
              label="Szukaj w tytule"
              solo
              flat
              hide-details
              prepend-inner-icon="search"
              clearable
            ></v-text-field>
            <v-divider
              class="mx-4"
              vertical
            ></v-divider>
            <v-select
              :items="config.categories"
              item-text="title"
              item-value="id"
              v-model="filters.id_category"
              label="Kategoria"
              solo
              flat
              hide-details
              dense
            ></v-select>
            <v-divider
              class="mx-4"
              vertical
            ></v-divider>
            <v-autocomplete
              v-model="filters.id_tag"
              item-text="title"
              item-value="id"
              :loading="tagLoading"
              :items="tagItems"
              :search-input.sync="searchTag"
              cache-items
              flat
              hide-no-data
              hide-details
              label="Tag"
              prepend-inner-icon="tag"
              solo
              clearable
            ></v-autocomplete>
            <v-divider
              class="ml-4"
              vertical
            ></v-divider>
            <v-btn icon class="ml-1" color="primary">
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
        v-model="filters.state"
        :items="config.contentsStates"
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

      <v-select
        v-model="filters.id_user"
        :items="config.usersGroups"
        item-text="title"
        item-value="id"
        placeholder="Redaktor"
        clearable
        dense
        outlined
        rounded
        hide-details
        class="mr-2 user-select"
      ></v-select>

      <v-chip
        outlined
        filter
        :input-value="filters.ord == 2"
        @click="toggleSponsored()"
      >
        Sponsorowane
      </v-chip>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card
      outlined
      class="nobg-dark pb-1"
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
      >
        <template v-slot:item.image_url="{ item }">
          <img v-if="item.image_url" :src="imageServer + item.image_url" loading="lazy" class="thu" />
        </template>
        <template v-slot:item.title="{ item }">
          {{ item.title }}
          <v-chip v-if="item.ord == 3" class="mx-2 primary" small >Przypięty</v-chip>
          <v-chip v-else-if="item.ord == 2" class="mx-2 orange" small >Sponsor</v-chip>
        </template>
        <template v-slot:item.state="{ item }">
          {{ (item.state) ? contentsStates[item.state].title : '' }}
          <v-chip v-if="!item.state" class="danger" small >Nieokreślony</v-chip>
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

  </v-container>
</template>

<script>
  import cms from '../api/cms';
  import { mapGetters } from 'vuex'
  export default {
    name: 'Contents',
    data: () => ({
      tableName: 'contents',
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
        id_category: 1,
        q: '',
        ord: '',
        state: '',
        id_user: '',
        id_tag: null
      },
      
      //title ajax find
      q: '',
      qTimeout: null,

      //tag autocomplete
      tagLoading: false,
      tagItems: [],
      searchTag: null,

      //table
      headers: [
        { text: 'Obrazek',  align: 'start', sortable: false, value: 'image_url' },
        { text: 'Tytuł', align: 'start', sortable: true, value: 'title' },
        { text: 'Aktualizacja', align: 'start', sortable: true, value: 'update_time' },
        { text: 'Status', align: 'start', value: 'state' },
        { text: '', align: 'end', value: 'actions', sortable: false }
      ],
      
    }),
    computed: {
      ...mapGetters('config', ['config', 'contentsStates']),
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
      },
      imageServer() {
        return (this.filters.id_category == 1) ? 'http://blokpres/thumbs/180x120/' : 'http://blokpres/thumbs/60x60/'
      }
    },
    mounted() {
      this.stickFinderInit();
      //this.getItems();
    },
    watch: {
      options: {
        handler () {
          this.getItems()
        },
        deep: true
      },
      filters: {
        handler () {
          if (this.options.page == 1) {
            console.log('page=1');
            this.getItems();
            //this.options.page = 1;
          } else {
            console.log('page!=1');
            //this.options.page = 1;
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
      searchTag (val) {
        val && val !== this.filters.id_tag && this.findTag(val)
      },
    },
    methods: {
      getItems() {
        console.log(new Date().getTime());
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
      toggleSponsored() {
        this.filters.ord = (this.filters.ord == 2) ? '' : 2
        console.log(this.filters.ord);
      },
      findTag(q) {
        this.tagLoading = true;
        cms.autocomplete('tags', q)
        .then(response => {
          if (response) {
            this.tagItems = response;
          }
          this.tagLoading = false;
        });
      }
    }
  }
</script>
