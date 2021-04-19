<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="justify-space-between pl-14">
          <span class="headline" v-text="(id == 0) ? 'Nowy tag' : 'Tag'"></span>
          <v-btn text icon @click="$emit('close-edit')">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field label="Nazwa" type="text" v-model="title" filled required :rules="titleRules" :change="emailBackendError = false" 
              :loading="loading"
              prepend-icon="tag"
            ></v-text-field>
            <v-text-field label="Slug" type="text" v-model="slug" filled 
              :loading="loading"
              prepend-icon="link"
            ></v-text-field>
            <v-select
              v-model="catalog_tag"
              :items="config.categories"
              item-text="title"
              item-value="id"
              label="W katalogu"
              filled
              :loading="loading"
              prepend-icon="local_offer"
            ></v-select>
            <v-select
              v-model="menu_tag"
              :items="config.categories"
              item-text="title"
              item-value="id"
              label="W menu"
              filled
              :loading="loading"
              prepend-icon="menu"
            ></v-select>
            <v-text-field label="Kolejność" type="text" v-model="ord" filled 
              :loading="loading"
              prepend-icon="low_priority"
            ></v-text-field>
            <v-select
              v-model="active"
              :items="[{id: 1, title: 'Aktywny'},{id: 2, title: 'Nieaktywny'}]"
              item-text="title"
              item-value="id"
              label="Status"
              required
              filled
              :loading="loading"
              prepend-icon="verified"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn x-large color="blue darken-1" text @click="$emit('close-edit')">Anuluj</v-btn>
          <v-btn x-large color="primary" @click="saveItem" :disabled="!valid || loading">Zapisz zmiany</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import cms from '../api/cms'
export default {
  props: ['id', 'dialog'],
  data: () => ({
    tableName: 'tags',
    valid: true,
    loading: false,
    
    title: null,
    titleRules: [
      v => !!v || 'Nazwa jest wymagana'
    ],

    slug: null,
    menu_tag: null,
    catalog_tag: null,
    ord: null,
    active: null
  }),
  computed: {
    ...mapGetters('config', ['config']),
  },
  watch: {
    dialog: function (newVal) {
      if (newVal == true) {
        if (this.id != 0) {
          this.loadItem();
        }
      } else {
        this.$refs.form.reset();
      }
    }
  },
  methods: {
    loadItem() {
      console.log('load item');
      this.loading = true;
      cms.getItem(this.tableName, this.id, {})
      .then(response => {
        if (response.id) {
          this.title = response.title;
          this.slug = response.slug;
          this.menu_tag = response.menu_tag;
          this.catalog_tag = response.catalog_tag;
          this.ord = response.ord;
          this.active = response.active;
        } else {
          this.$refs.form.reset();
        }
        this.loading = false;
      });
    },
    saveItem() {
      if (this.id == 0) {
        cms.create(this.tableName, {
          email: this.email,
          passwd: this.passwd,
          name: this.name,
          id_group: this.id_group,
          state: this.state
        })
        .then(response => {
          if (response.id) {
            this.$emit('edit-updated');
          } else {
            console.log('error');
          }
        });
      } else {
        cms.update(this.tableName, this.id, {
          id: this.id,
          email: this.email,
          passwd: this.passwd,
          name: this.name,
          id_group: this.id_group,
          state: this.state
        })
        .then(response => {
          if (response.id) {
            this.$emit('edit-updated');
          } else {
            console.log('error');
          }
        });
      }
      
    }
  }
}
</script>