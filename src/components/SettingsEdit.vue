<template>
    <v-dialog v-model="dialog" persistent max-width="660px">
      <v-card>
        <v-card-title class="justify-space-between">
          <span class="headline" v-text="(id == 0) ? 'Nowy parametr' : 'Parametr'"></span>
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
            <v-text-field label="Slug" type="text" v-model="name" name="name" 
              append-icon="sync"
              @click:append="titleToSlug(true)"
            ></v-text-field>

            <v-select
              v-model="type"
              :items="types"
              item-text="title"
              item-value="id"
              label="Typ"
            ></v-select>
            
            <v-text-field v-if="type == 'text' || type == 'number'" label="Wartość" type="text" v-model="content"></v-text-field>
            <v-textarea
              v-else-if="type == 'longtext'"
              counter="1024"
              label="Wartość"
              :rules="lengthRules"
              v-model="content"
            ></v-textarea>
            <editor
              v-else-if="type == 'richtext'"
              id="editor-content"
              :inline=false
              v-model="content"
              :init="tinyInit"
              class="editor-content"
            />
            
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
import Editor from '@tinymce/tinymce-vue'
import cms from '../api/cms'
import slugify from '../api/slugify'
export default {
  props: ['id', 'dialog'],
  components: {
    'editor': Editor
  },
  data: () => ({
    tableName: 'settings',
    valid: true,
    loading: false,
    types: [
      { id: 'text', title: 'Krótki tekst' },
      { id: 'longtext', title: 'Długi tekst' },
      { id: 'richtext', title: 'Sformatowany tekst' },
      { id: 'number', title: 'Liczba' },
    ],
    
    title: null,
    requiredRules: [
      v => !!v || 'To pole jest wymagane'
    ],
    lengthRules: [v => v.length <= 1024 || 'Maksymalnie 1024 znaki'],

    name: null,
    content: '',
    type: 'text',
    dark: false
  }),
  computed: {
    ...mapGetters('config', ['config']),
    tinyInit() {
      return {
        height: 280,
        language: 'pl',
        skin: (localStorage.getItem("dark") == 'true') ? 'oxide-dark' : 'oxide',
        placeholder: 'Treść...',
        menubar: false,
        object_resizing: false,
        browser_spellcheck: true,
        media_filter_html: false,
        media_live_embeds: true,
        extended_valid_elements: 'script[language|type|src|class],iframe[type|width|height|src|allow|allowfullscreen|style|frameborder|id|scrolling]',
        relative_urls : false,
        remove_script_host : true,
        document_base_url : "/",
        convert_urls : true,
        branding: false,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'media table paste code responsivefilemanager '
        ],
        toolbar: [
          'undo redo | h2 h3 h4 | bold italic blockquote | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | table | link image media | responsivefilemanager | removeformat code' ],
        image_advtab: true,
        external_filemanager_path: this.config.serverUrl + '/filemanager/',
        filemanager_title: 'Media',
        external_plugins: {
          'responsivefilemanager': this.config.serverUrl + '/js/tinymce/plugins/responsivefilemanager/plugin.min.js',
          'filemanager': this.config.serverUrl + '/filemanager/plugin.min.js'
        },
      }
    },
  },
  mounted() {
    this.dark = localStorage.getItem("dark");
    console.log(localStorage.getItem("dark"))
  },
  watch: {
    dialog: function (newVal) {
      if (newVal == true) {
        if (this.id != 0) {
          this.loadItem();
        } else {
          this.type = 'text';
        }
      } else {
        this.$refs.form.reset();
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
          this.name = response.name;
          this.content = response.content;
          this.type = response.type;
        } else {
          this.$refs.form.reset();
        }
        this.loading = false;
      });
    },
    saveItem() {
      if (this.$refs.form.validate()) {
      if (this.id == 0) {
        cms.create(this.tableName, {
          name: this.name,
          title: this.title,
          content: this.content,
          type: this.type
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
          name: this.name,
          title: this.title,
          content: this.content,
          type: this.type
        })
        .then(response => {
          console.log(response)
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
    titleToSlug(force) {
      if (!this.name || force) {
        this.name = slugify(this.title)
      }
    },
  }
}
</script>