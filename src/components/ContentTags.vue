<template>
  <v-card outlined flat class="transparentx" style="border-radius: 28px">
    <v-card-text class="pt-0 px-1">
      <v-autocomplete
        v-model="selected"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        @change="onChange"
        hide-details
        
        no-data-text="Zacznij pisać..."
        placeholder="Tag"
        prepend-inner-icon="add"
        item-text="title"
        item-value="id"
        return-object
        class="lajt"
      >
      </v-autocomplete>
      <v-chip-group
        column
        class="pt-1"
      >
        <v-chip
          v-for="(item, i) in selection"
          :key="i"
          close
          @click:close="remove(item.id)"
        >
          {{ item.title }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
import cms from '../api/cms'
export default {
  name: "ContentTags",
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
  },
  watch: {
    search (val) {
      val && val !== this.select && this.queryItems(val)
    },
  },
  methods: {
    queryItems (q) {
      this.isLoading = true;
      cms.autocomplete('tags', q, { })
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