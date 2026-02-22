<template>
  <div>
    <label>Tagi</label>
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
          class="lajt pt-0"
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
            :key="item.id"
            close
            @click:close="remove(item.id)"
            class="ma-1 draggable-chip"
            :color="i===0 ? 'primary' : ''"
          >
            {{ item.title }}
          </v-chip>
        </draggable>
      </v-card-text>
    </v-card>
    <div class="mt-1">
      <v-chip
        v-for="(item) in mainTagsUnused"
        :key="item.id"
        small
        @click="add(item.id)"
        class="ma-1"
        color=""
      >
        {{ item.title }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import cms from '../api/cms'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable';
export default {
  components: {
    draggable,
  },
  name: "ContentTags",
  props: {
    inputData: Array,
  },
  data () {
    return {
      isLoading: false,
      search: null,
      selected: null, //selected item
      items: [], //select list items: [{ id: 31, title: 'Biedronka', image_url: 'biedronka.jpg' }], 
      selection_: [],
    }
  },
  computed: {
    ...mapGetters('config', { mainTags: 'important_tags' }),
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
    mainTagsUnused() {
      const idsToRemove = new Set(this.selection.map(obj => obj.id));
      return this.mainTags.filter(obj => !idsToRemove.has(obj.id));
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
    },
    add(id) {
      
      const exists = this.selection.find((el) => el.id === id)

      console.log(exists)

      if (!exists) {
        const selected = this.mainTags.find((el) => el.id === id)
        this.selection.push(selected);
      }
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