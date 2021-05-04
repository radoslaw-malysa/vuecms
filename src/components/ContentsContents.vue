<template>
  <div>
    <v-autocomplete
      v-model="selected"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      @change="onChange"
      hide-details
      chips
      no-data-text="Zacznij pisać..."
      :label="label"
      item-text="title"
      item-value="id"
      
      return-object
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          close
          @click:close="remove(data.item.id)"
        >
          <v-avatar left>
            <v-img :src="imageServer + data.item.image_url"></v-img>
          </v-avatar>
          {{ data.item.title }}
        </v-chip>
      </template>
      <template v-slot:item="data">
          <v-list-item-avatar>
            <img :src="imageServer + data.item.image_url">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.title"></v-list-item-title>
          </v-list-item-content>
      </template>
    </v-autocomplete>
    <div>
      <v-chip-group
        column
      >
        <v-chip
          v-for="item in selection"
          :key="item.id"
          close
          @click:close="remove(item.id)"
        >
          <v-avatar left>
            <v-img :src="imageServer + item.image_url"></v-img>
          </v-avatar>
          {{ item.title }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script>
import cms from '../api/cms'
import { mapGetters } from 'vuex'
export default {
  name: "ContentsContents",
  props: {
    inputData: Array,
    id_category: Number
  },
  data () {
    return {
      isLoading: false,
      search: null,
      selected: null, //selected item
      items: [], //select list items: [{ id: 31, title: 'Biedronka', image_url: 'biedronka.jpg' }], 
      selection_: []
    }
  },
  computed: {
    ...mapGetters('config', ['config', 'categories']),
    imageServer() {
      return this.config.serverUrl + '/thumbs/60x60/'
    },
    selection:{
      get(){
        return this.inputData
      },
      set(val){
        this.$emit('update:inputData', val)
      }
    },
    innerValue:{
      get(){
        return this.inputData
      },
      set(val){
        this.$emit('update:inputData', val)
      }
    },
    label() {
      return this.categories[this.id_category].title
    }
  },
  watch: {
    search (val) {
      val && val !== this.select && this.queryItems(val)
    },
  },
  methods: {
    queryItems (q) {
      this.isLoading = true;
      cms.autocomplete('contents', q, { id_category: this.id_category })
      .then(res => {
        this.items = res
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoading = false))
    },
    onChange (e) {
      if (typeof e === 'object') {
        this.selection.push(e);
        //this.selected = null;
      }
      this.$nextTick(() => {
        this.selected = null
      });
    },
    remove (id) {
      let i = this.selection.map(function(it) { return it.id; }).indexOf(id);
      if (i >= 0) this.selection.splice(i, 1);
    }
  },
};
</script>
<!-- 
http://www.codestudyblog.com/questions/sf/0421191856.html
https://github.com/vuetifyjs/vuetify/issues/6635
-->