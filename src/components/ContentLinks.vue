<template>
  <div class="d-flex" :class="{'mb-12': selection.length > 0}">
    <div class="ed-aside relative">
      <div :class="{ 'absolute-top-left': selectionEmpty, 'absolute-bottom-left': !selectionEmpty, }">
        <v-menu 
          v-model="addMenu"
          offset-x 
          :close-on-content-click="false"
          min-width="400"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              x-large
              title="Dodaj linki"
            >
              <v-icon>add_link</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="pb-0">
              Dodaj link
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="url"
                label="Link"
              ></v-text-field>
              <v-text-field
                v-model="title"
                label="Etykieta"
              ></v-text-field>
              <v-textarea
                v-model="tip"
                label="Dymek"
                hide-details
                rows="2"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                @click="addMenu = false"
              >
                Anuluj
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="addLink"
              >
                Dodaj
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </div>
    <div class="flex-grow-1" style="width:750px;">
      <v-row>
        <v-col cols="6" v-for="(item, i) in selection" :key="i">
          <v-text-field
            :label="item.title" 
            :hint="item.tip"
            persistent-hint
            type="text" 
            v-model="item.url"
            append-icon="edit"
            @click:append="editLink(item, i)"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-dialog
        v-model="editDialog"
        max-width="400"
        persistent
      >
        <v-card>
          <v-card-title>
            <span>Edycja linku</span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="closeEdit"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
                v-model="url"
                label="Link"
              ></v-text-field>
              <v-text-field
                v-model="title"
                label="Etykieta"
              ></v-text-field>
              <v-textarea
                v-model="tip"
                label="Dymek"
                hide-details
                rows="2"
              ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              text
              @click="deleteLink"
            >
              Usuń
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="closeEdit"
            >
              Anuluj
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="updateLink"
            >
              Zapisz
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import cms from '../api/cms'
export default {
  name: "ContentLinks",
  props: {
    inputData: Array,
  },
  data () {
    return {
      addMenu: false,
      editDialog: false,
      url: null,
      title: null,
      tip: null,
      index: null
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
    selectionEmpty () {
      return this.selection.length > 0
    }
  },
  watch: {
    
  },
  methods: {
    addLink () {
      this.selection.push({
        url: this.url,
        title: this.title,
        tip: this.tip
      });

      this.url = this.title = this.tip = null;
      this.addMenu = false;
    },
    deleteLink() {
      if (this.selection[this.index]) {
        this.selection.splice(this.index, 1);
      }
      this.closeEdit();
    },
    editLink(item, i) {
      this.url = item.url;
      this.title = item.title;
      this.tip = item.tip;
      this.index = i;
      this.editDialog = true;
    },
    updateLink() {
      if (this.selection[this.index]) {
        this.selection[this.index] = {
          url: this.url,
          title: this.title,
          tip: this.tip
        };
      }
      this.closeEdit();
    },
    closeEdit() {
      this.url = this.title = this.tip = this.index = null;
      this.editDialog = false;
    }
  },
};
</script>