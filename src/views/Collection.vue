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
              :items="artFields"
              item-text="title"
              item-value="id"
              v-model="filters.field_of_art"
              label="Typ obiektu"
              solo
              flat
              hide-details
              dense
            ></v-select>
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
              class="ml-4"
              vertical
            ></v-divider>
            <!--<v-select
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
            ></v-divider>-->
            
            <v-btn icon class="ml-1 btn-primary" @click="editItem({id:0})">
              <v-icon color="#ffffff">add</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </div>
    </div>

    <v-toolbar
      flat
      class="filter-toolbar nobg-dark my-2  h-56"
    >
      <v-chip
        v-for="(item) in artFields"
        :key="item.id"
        :color="(filters.field_of_art == item.id) ? 'primary' : ''"
        @click="filters.field_of_art == item.id ? filters.field_of_art = null : filters.field_of_art = item.id"
        class="mr-2"
      >
        {{item.title}}
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
        @click:row="editItem"
      >
        <template v-slot:item.image_url="{ item }">
          <img v-if="item.image_url" :src="imageServer + item.image_url" loading="lazy" class="thu" />
        </template>
        <template v-slot:item.title="{ item }">
          {{ item.title }}
          <v-chip v-if="item.ord == 3" class="mx-1 primary" small >Przypięty</v-chip>
        </template>
        <template v-slot:item.event_date="{ item }">
          {{ item.event_date }}<br />{{ item.event_date_end }}
        </template>
        <template v-slot:item.state="{ item }">
          <v-chip v-if="item.state == 1 && item.archive && item.archive < 0" color="red" text-color="white" small >Archiwum</v-chip>
          <span v-else>{{ (item.state) ? contentsStates[item.state].title : '' }}</span>
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
    name: 'Collection',
    data: () => ({
      tableName: 'artworks',
      results: [], 
      totalItems: 0,
      itemsPerPage: 50,
      page: 1,
      pageCount: 0,

      loading: false,
      //editDialog: false,
      //editId: 0,

      //finder bar stick
      finderTop: 0,
      finderSticked: false,

      //filters
      options: {},
      filters: {
        id_category: '',
        q: '',
        ord: '',
        state: '',
        id_user: '',
        field_of_art: null,
        affiliate_url: '',
        id_lang: 1
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
        { text: 'Autor', align: 'start', sortable: true, value: 'author'  },
        { text: 'Tytuł', align: 'start', sortable: true, value: 'title' },
        { text: 'Data powstania', align: 'start', sortable: true, value: 'year_of_creation_start' },
        { text: 'Pozyskano', align: 'start', sortable: true, value: 'year_of_acquisition', width: '120'  },
        { text: 'Status', align: 'start', value: 'state' }
      ],
      artFields: [
        { id: 'Malarstwo', title: 'Malarstwo' },
        { id: 'Fotografia', title: 'Fotografia' },
        { id: 'Grafika komputerowa', title: 'Grafika komputerowa' },
        { id: 'Grafika warsztatowa', title: 'Grafika warsztatowa' },
        { id: 'Muzealia Pozaartystyczne', title: 'Muzealia Pozaartystyczne' },
        { id: 'Rysunek', title: 'Rysunek' },
        { id: 'Rzeźba', title: 'Rzeźba' },
        { id: 'Zapisy Cyfrowe', title: 'Zapisy Cyfrowe' }
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
        return this.config.serverUrl + '/thumbs/60x60/zbiory/'
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
            if (response.error == 403) {
              this.$router.push({ path: '/login' })
            }
          }
          this.loading = false;
        });
      },
      editItem(item) {
        //this.editId = id;
        //this.editDialog = true;
        let id = item.id

        let editRoute = this.$router.resolve({ 
          name: 'Art',
          params: { id: id },
        });

        let url = editRoute.href;
        if (id == 0) { url += '?id_category=' + this.filters.id_category; }
        
        window.open(url, '_blank');
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
      /*toggleSponsored() {
        this.filters.ord = (this.filters.ord == 2) ? '' : 2
      },
      toggleAffiliated() {
        this.filters.affiliate_url = (this.filters.affiliate_url == 1) ? '' : 1
      },*/
      findTag(q) {
        this.tagLoading = true;
        cms.autocomplete('tags', q)
        .then(response => {
          if (response) {
            this.tagItems = response;
          }
          this.tagLoading = false;
        });
      },
      
    }
  }
</script>

<style>
  .v-btn.btn-primary {
    background-color: #1976d2;
    color: #fff;
  }
  .v-data-table tbody tr {
    cursor: pointer;
  }
</style>