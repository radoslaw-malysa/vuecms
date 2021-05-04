<template>
  <div>
    <v-autocomplete
      v-model="selected"
      :disabled="isLoading"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      hide-selected
      chips
      color="blue-grey lighten-2"
      label="Kryptowaluty"
      item-text="title"
      item-value="id"
      multiple
      return-object
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          close
          @click:close="remove(data.item)"
        >
          <v-avatar left>
            <v-img :src="data.item.avatar"></v-img>
          </v-avatar>
          {{ data.item.title }}
        </v-chip>
      </template>
      <template v-slot:item="data">
          <v-list-item-avatar>
            <img :src="data.item.avatar">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.title"></v-list-item-title>
          </v-list-item-content>
      </template>
    </v-autocomplete>

    <input
      v-show="false"
      type="text"
      v-model="innerValue"
    />
  </div>
</template>

<script>
import cms from '../api/cms'
export default {
  name: "ContentsContents",
  props: {
    inputData: String
  },
  computed: {
    innerValue:{
      get(){
        return this.inputData
      },
      set(val){
        this.$emit('update:inputData', val)
      }
    }
  },

  data () {
    return {
      autoUpdate: true,
      selected: [{id: 7667, image_url: "eden_doniger.jpg", title: "Eden Doniger"}],
      isLoading: false,
      name: 'Midnight Crew',
      search: null,
      items: [
        { id: 1, title: 'Sandra Adams', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
        { id: 2, title: 'Ali Connors', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        { id: 3, title: 'Trevor Hansen', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
        { id: 4, title: 'Tucker Smith', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
        { id: 5, title: 'Britta Holt', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
        { id: 6, title: 'Jane Smith ', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
        { id: 7, title: 'John Smith', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        { id: 8, title: 'Sandra Williams', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
      ],
      title: 'The summer breeze',
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
        cms.autocomplete('contents', q)
        .then(res => {
          this.items = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
      },
      remove (item) {
        const index = this.selected.indexOf(item.title)
        if (index >= 0) this.selected.splice(index, 1)
      },
      test () {
        console.log(this.selected);
      }
    },
};
</script>
<!-- 
http://www.codestudyblog.com/questions/sf/0421191856.html
https://github.com/vuetifyjs/vuetify/issues/6635
-->