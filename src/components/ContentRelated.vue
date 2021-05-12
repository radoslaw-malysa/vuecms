<template>
  <div class="d-flex" :class="{'mb-12': relatedSelected.length > 0}">
    <div class="ed-aside relative">
      <div class="absolute-top-left">
        <v-menu offset-x :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              large
              title="Dodaj linki"
            >
              <v-icon>add_link</v-icon>
            </v-btn>
          </template>
          <v-list
            flat
            one-line
          >
            <v-list-item-group
              v-model="relatedSelected"
              multiple
            >
              <v-list-item v-for="(item, i) in relatedSettings" :key="i" :value="item.id">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="flex-grow-1" style="width:750px;">
      <v-row>
        <v-col cols="6" v-for="(item, i) in relatedSettingsSeleted" :key="i">
          <v-text-field 
            :label="item.title" 
            type="text" 
            v-model="related[item.id]"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import cms from '../api/cms'
export default {
  name: "ContentTags",
  props: {
    inputData: Array,
  },
  data () {
    return {
      //related
      related: {},
      relatedSettings: [
        { id: 'twitter', title: 'Twitter' },
        { id: 'facebook', title: 'Facebook' },
        { id: 'medium', title: 'Medium' },
        { id: 'youtube', title: 'Youtube' },
        { id: 'telegram', title: 'Telegram' },
        { id: 'instagram', title: 'Instagram' },
        { id: 'reddit', title: 'Reddit' },
      ],
      relatedSelected: [],
    }
  },
  computed: {
    relatedSettingsSeleted() {
      return this.relatedSettings.filter(item => this.relatedSelected.includes(item.id) );
      /*this.relatedSettings.forEach(item => {
        if (this.relatedSelected.includes(item.id)) {
          sel.push(item)
        }
      });*/
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
    
  },
  methods: {

  },
};
</script>