<template>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="justify-space-between">
          <span class="headline" v-text="(id == 0) ? 'Nowy tag' : `Tag ${id}`"></span>
          <v-btn text icon @click="$emit('close-edit')">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field label="Nazwa" type="text" v-model="title" name="title" required :rules="requiredRules" @change="titleToSlug(false)" 
            ></v-text-field>
            <v-text-field label="Slug" type="text" v-model="slug" name="slug" 
              append-icon="sync"
              @click:append="titleToSlug(true)"
            ></v-text-field>
            <v-text-field label="Kolejność" type="text" v-model="ord" 
            ></v-text-field>

            <v-select
              :items="config.langs"
              item-text="title"
              item-value="id"
              v-model="id_lang"
              label="Język"
              required :rules="requiredRules"
            ></v-select>
            
            <v-select
              v-model="active"
              :items="[{id: 1, title: 'Aktywny'},{id: 2, title: 'Nieaktywny'}]"
              item-text="title"
              item-value="id"
              label="Status"
              required :rules="requiredRules"
            ></v-select>

            <div class="mb-2 mt-2">
              <v-chip
                class="mr-2"
                :color="(systemic == 1) ? 'primary' : ''" 
                @click="systemic = (systemic == 0) ? 1 : 0"
                title="Niewidoczny na stronie WWW"
              >
                <v-avatar left>
                  <v-icon>build</v-icon>
                </v-avatar>
                Systemowy
              </v-chip>
              <v-chip
                class="mr-2"
                :color="(important == 1) ? 'primary' : ''" 
                @click="important = (important == 0) ? 1 : 0"
              >
                <v-avatar left>
                  <v-icon>repeat</v-icon>
                </v-avatar>
                Często używany
              </v-chip>
            </div>
            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-menu v-if="id" offset-y :disabled="!valid || loading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="warning"
                x-large
                text
                v-bind="attrs"
                v-on="on"
              >
                Usuń
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="deleteItem">
                <v-list-item-title>Potwierdzam usunięcie</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn x-large color="secondary" text @click="$emit('close-edit')">Anuluj</v-btn>
          <v-btn x-large text color="primary" @click="saveItem" :loading="loading" :disabled="!valid || loading">Zapisz</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import cms from '../api/cms'
import slugify from '../api/slugify'
export default {
  props: ['id', 'dialog'],
  data: () => ({
    tableName: 'tags',
    valid: true,
    loading: false,
    
    title: '',
    requiredRules: [
      v => !!v || 'To pole jest wymagane'
    ],

    slug: '',
    ord: '0',
    active: 1,
    id_lang: 1,
    systemic: 0,
    important: 0
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
        // this.$refs.form.reset();
        this.resetItem()
      }
    }
  },
  methods: {
    loadItem() {
      this.loading = true;
      cms.getItem(this.tableName, this.id, {})
      .then(response => {
        if (response.id) {
          this.title = response.title;
          this.slug = response.slug;
          this.ord = response.ord;
          this.active = response.active;
          this.id_lang = response.id_lang;
          this.systemic = response.systemic;
          this.important = response.important;
        } else {
          // this.$refs.form.reset();
          this.resetItem()
        }
        this.loading = false;
      });
    },
    saveItem() {
      if (this.$refs.form.validate()) {
      if (this.id == 0) {
        cms.create(this.tableName, {
          slug: this.slug,
          title: this.title,
          ord: this.ord,
          active: this.active,
          id_lang: this.id_lang,
          systemic: this.systemic,
          important: this.important
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
          slug: this.slug,
          title: this.title,
          ord: this.ord,
          active: this.active,
          id_lang: this.id_lang,
          systemic: this.systemic,
          important: this.important
        })
        .then(response => {
          if (response.id) {
            this.$emit('edit-updated');
          } else {
            this.$store.commit('snack/open', {text: (response.message) ? response.message : 'Nie udało się zapisać zmian', color: 'error'});
          }
        });
      }
      }
    },
    deleteItem() {
      cms.delete(this.tableName, this.id)
      .then(response => {
        if (response.error) {
          this.$store.commit('snack/open', {text: (response.message) ? response.message : 'Nie udało się zapisać zmian', color: 'error'});
        } else {
          this.$emit('edit-updated');
        }
      });
    },
    resetItem() {
      this.title = ''
      this.slug = ''
      this.ord = 0
      this.important = 0
    },
    titleToSlug(force) {
      if (!this.slug || force) {
        this.slug = slugify(this.title)
      }
    },
  }
}
</script>