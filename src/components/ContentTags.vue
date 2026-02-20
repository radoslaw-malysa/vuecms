<template>
  <v-card outlined flat class="nobg" style="border-radius: 16px">
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
      <draggable
        v-model="selection"
        animation="200"
        ghost-class="ghost-chip"
        class="chip-container"
      >
        <v-chip
          v-for="(item, i) in selection"
          :key="i"
          close
          @click:close="remove(item.id)"
          class="ma-1 draggable-chip"
        >
          {{ item.title }}
        </v-chip>
      </draggable>
    </v-card-text>
  </v-card>
</template>

<script>
import cms from '../api/cms'
import draggable from 'vuedraggable';
export default {
  components: {
    draggable,
  },
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

<style scoped>
.chip-container {
  display: flex;
  flex-wrap: wrap;
  min-height: 50px;
  padding-top: 4px;
}

.draggable-chip {
  cursor: grab;
}

.draggable-chip:active {
  cursor: grabbing;
}

/* Appearance of the "ghost" (the empty space where the chip will land) */
.ghost-chip {
  opacity: 0.5;
  background: #c8ebfb !important;
  border: 1px dashed #2196F3 !important;
}
</style>