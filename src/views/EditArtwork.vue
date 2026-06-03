<template>
  <v-container fluid class="d-flex justify-center pt-0 pb-0 relative">
    <v-btn
      
      large
      fab
      icon            
      @click="abort"
      class="abort-btn"
      title="Anuluj zmiany i zamknij"
    >
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <form id="form-contents" action="" method="post" class="d-flex">
      
      <div class="ed d-inline-block py-10">

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-textarea
              name="author"
              v-model="author"
              label="Autor"
              auto-grow
              rows="1"
              row-height="20"
              class="textarea-title f5-l"
            ></v-textarea>
          </div>
        </div>
        
        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="title"
              v-model="title"
              label="Tytuł"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1 d-flex">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  name="year_of_creation_start"
                  v-model="year_of_creation_start"
                  label="Data powstania"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  name="year_of_creation_stop"
                  v-model="year_of_creation_stop"
                  label="Data ukończenia"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="year_of_acquisition"
              v-model="year_of_acquisition"
              label="Data pozyskania"
            ></v-text-field>
          </div>
        </div>


        

        <div class="d-flex mb-10 mt-6">
          <div class="ed-aside relative">
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="author"
              v-model="author"
              label="Autor"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex" style="margin-bottom: 250px;">
          <div class="ed-aside"></div>
          <div class="ed-content flex-grow-1">
            <gallery 
              v-model="gallery" 
              :article-id="id"
              :slug="slug"
              :serverUrl="config.serverUrl"
            />
          </div>
        </div>
      </div>


      <div class="pl-12 ed-drawer">
        <div class="sticked-top">
          <v-card 
            flat 
            tile
            width="360px"
            class="nobg-dark pt-6"
          >
            <v-toolbar
              elevation="0"
              color="transparent"
              class=""
            >
              <v-select
                name="state"
                :items="config.contentsStates"
                item-text="title"
                item-value="id"
                v-model="state"
                :background-color="state !== 1 ? 'red lighten-4' : ''"
                placeholder="Status"
                solox
                outlined
                rounded
                dense
                hide-details
              ></v-select>
              
              <v-btn
                rounded
                depressed
                color="primary"
                class="ml-2 medium"
                :loading="loading"
                @click="saveItem"
              >Zapisz</v-btn>

            </v-toolbar>
          
            <v-card-text class="py-4">
              <v-row>
                <v-col
                  cols="6"
                >
                  <label>Data aktualizacji</label>
                  <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="update_time_d"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="update_time_d"
                        name="update_time_d"
                        readonly
                        rounded
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        dense
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="update_time_d"
                      locale="pl"
                      :first-day-of-week="1"
                      no-title
                      scrollable
                      @input="dateMenu = false; $refs.dateMenu.save(update_time_d)"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="4">
                  <label>Godzina</label>
                  <v-text-field placeholder="Godzina" type="text" 
                    outlined 
                    rounded
                    dense
                    hide-details=""
                    v-model="update_time_h"
                    name="update_time_h"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="2"
                  class="d-flex align-end"
                >
                  <v-btn
                    icon
                    large
                    :color="(ord == 3) ? 'primary' : 'grey lighten-2'" 
                    @click=toggleOrd(3)
                    title="Przypnij zawsze na górze"
                  >
                    <v-icon>push_pin</v-icon>
                  </v-btn>
                  <input type="hidden" name="ord" v-model="ord" />
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="7"
                >
                  <label>Data archiwizacji</label>
                  <v-menu
                    ref="archivingDateMenu"
                    v-model="archivingDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="archiving_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="archiving_date"
                        name="archiving_date"
                        readonly
                        outlined 
                        rounded
                        dense
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        clearable
                        clear-icon="cancel"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="archiving_date"
                      locale="pl"
                      :first-day-of-week="1"
                      no-title
                      scrollable
                      @input="archivingDateMenu = false; $refs.archivingDateMenu.save(archiving_date)"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col
                  cols="5"
                  class="d-inline-flex align-end"
                >
                  <v-chip
                    v-if="isArchive"
                    class="ma-2"
                    color="red"
                    label
                    text-color="white"
                  >
                    <v-icon left>
                      report
                    </v-icon>
                    Archiwum
                  </v-chip>
                </v-col>
              </v-row>
              


              <!--<v-row>
                <v-col>
                  <label>Wyróżnij</label>
                  
                  <v-chip
                    filter
                    class="mr-2"
                    :color="(ord == 3) ? 'primary' : ''"
                    @click=toggleOrd(3)
                  >Przypięty</v-chip>
                  <v-chip
                    filter
                    :color="(ord == 2) ? 'accent' : ''"
                    @click=toggleOrd(2)
                  >Sponsorowany</v-chip>
                </v-col>
              </v-row>-->

              <v-row>
                <v-col>
                  <content-tags 
                    :inputData.sync="tags" 
                    
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <label>Język</label>
                  <v-select
                    name="id_lang"
                    :items="langs"
                    item-text="title"
                    item-value="id"
                    v-model="id_lang"
                    outlined
                    rounded
                    dense
                    hide-details
                  ></v-select>
                  <input type="hidden" name="view" v-model="view" />
                  <input type="hidden" name="id_category" v-model="id_category" />
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <div class="d-flex justify-space-between">
                    <label>Link do artykułu</label>
                    <div>
                      <v-btn
                        x-small
                        color="primary"
                        rounded
                        text
                        @click="copyLinkHandler"
                      >Kopiuj</v-btn>
                      <v-btn
                        :href="articleLink"
                        target="_blank"
                        color="primary"
                        x-small
                        rounded
                        text
                        @click="copyLinkHandler"
                      >Otwórz</v-btn>
                    </div>
                  </div>
                  <v-text-field 
                    type="text" 
                    outlined 
                    rounded
                    dense
                    hide-details=""
                    v-model="articleLink"
                    readonly
                  >
                  </v-text-field>
                </v-col>
              </v-row>

            </v-card-text>
          </v-card>
        </div>
      </div>
    </form>
    
    <v-dialog
      v-model="dialogMedia"
      max-width="94vw"
      transition="fade"
    >
      <v-card>
        <v-card-title class="headline">
          <span>Media</span>
          <v-spacer></v-spacer>
          <v-btn text icon @click="dialogMedia = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-html="dialogMediaContent" class="pa-0"></v-card-text>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import cms from '../api/cms'
import Editor from '@tinymce/tinymce-vue'
import slugify from '../api/slugify'
import ContentTags from '../components/ContentTags.vue'
import Gallery from '../components/ArticleGalleryx.vue';
import ImageUploader from '../components/ImageUploader.vue'

export default {
  name: 'EditArtwork',
  props: ['id'],
  components: {
    'editor': Editor,
    ContentTags,
    Gallery,
    ImageUploader
  },
  data: () => ({
    tableName: 'contents',
    id_category: null,
    slug: null,
    title: null,
    author: null,
    year_of_acquisition: null,
    content: null,
    image_url: null,
    image_2_url: null,
    image_caption: null,
    video: null,
    author: '',
    state: null,
    ord: 0,
    update_time_d: null,
    update_time_h: null,
    id_author: null,
    id_lang: null,
    event_date: null,
    event_time: null,
    event_date_end: null,
    archiving_date: null,
    view: '',
    gallery: [],
    tags: [],

    // slug
    showSlug: false,

    // main image
    showVideo: 1,
    dialogMedia: false,
    dialogMediaContent: '',

    imageInput: '',

    // main video
    videoTmp: null,
    insertVideoMenu: false,

    dateMenu: false,
    eventDateMenu: false,
    eventDateEndMenu: false,
    archivingDateMenu: false,
    loading: false,
    // dark: false
  }),
  computed: {
    ...mapGetters('config', ['config', 'contentsStates']),
    btnImageColor() {
      return (this.showVideo == 1) ? 'primary' : 'grey lighten-2'
    },
    btnPanoramaColor() {
      return (this.showVideo == 2) ? 'primary' : 'grey lighten-2'
    },
    btnVideoColor() {
      return (this.showVideo == 3) ? 'primary' : 'grey lighten-2'
    },
    tinyInit() {
      return {
        width: 750,
        language: 'pl',
        skin: (localStorage.getItem("dark") == 'true') ? 'oxide-dark' : 'oxide',
        placeholder: 'Treść artykułu...',
        menubar: false,
        object_resizing: false,
        entity_encoding : 'raw',
        browser_spellcheck: true,
        media_filter_html: false,
        media_live_embeds: true,
        extended_valid_elements: 'script[language|type|src|class],iframe[type|width|height|src|allow|allowfullscreen|style|frameborder|id|scrolling],sr-basic-widget[*]',
        relative_urls : false,
        remove_script_host : true,
        document_base_url : "/",
        convert_urls : true,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'media table textcolor paste code responsivefilemanager '
        ],
        toolbar: [
          'undo redo | styleselect | fontsizeselect | bold italic blockquote | alignleft aligncenter alignright alignjustify | forecolor backcolor',
          'bullist numlist | outdent indent | table | link anchor image media | responsivefilemanager | removeformat code' ],
        image_advtab: true,
        external_filemanager_path: this.config.serverUrl + '/filemanager/',
        filemanager_title: 'Media',
        external_plugins: {
          'responsivefilemanager': this.config.serverUrl + '/js/tinymce/plugins/responsivefilemanager/plugin.min.js',
          'filemanager': this.config.serverUrl + '/filemanager/plugin.min.js'
        },
        setup: (editor) => {
          editor.on("focus", () => {
            document.getElementById("editor-wrap").classList.add("focused");
          });
          editor.on("blur", () => {
            document.getElementById("editor-wrap").classList.remove("focused");
          });
          editor.ui.registry.addContextToolbar("editimage", {
            predicate: (node) => {
              return node.nodeName.toLowerCase() === "img";
            },
            items: "editimage removeimage",
            position: "node",
            scope: "node"
          });
          editor.ui.registry.addButton("editimage", {
            icon: "edit-block",
            onAction: () => {
              editor.execCommand("mceImage");
            }
          });
          editor.ui.registry.addButton("removeimage", {
            icon: "remove",
            onAction: () => {
              const node = tinymce.activeEditor.selection.getNode();
              node.remove();
            }
          });
        }
      }
    },
    tinyInitSubtitle() {
      return {
        width: 750,
        language: 'pl',
        skin: (localStorage.getItem("dark") == 'true') ? 'oxide-dark' : 'oxide',
        placeholder: 'Wprowadzenie',
        menubar: false,
        object_resizing: false,
        entity_encoding : 'raw',
        browser_spellcheck: true,
        media_filter_html: false,
        media_live_embeds: false,
        relative_urls : false,
        remove_script_host : true,
        document_base_url : "/",
        convert_urls : true,
        plugins: [
          'advlist autolink lists link charmap preview anchor',
          'searchreplace visualblocks code',
          'media table textcolor paste code'
        ],
        toolbar: [
          'bold italic | alignleft aligncenter alignright alignjustify | forecolor | bullist numlist | link anchor | removeformat code' ],
        image_advtab: false,
      }
    },
    /*view() {
      return (this.id_category) ? this.categoryTemplate(this.id_category).view : this.categoryTemplate(1).view
    },*/
    langs() {
      return this.config.langs
    },
    isArchive() {
      if (this.archiving_date) {
        const today = new Date().toISOString().split('T')[0];
        if (this.archiving_date < today) {
          return true
        }
      }

      return false
    },
    articleLink() {
      if (!this.id) { return ''; }
      const lang = this.langs.find(item => item.id === this.id_lang);
      return lang ? window.location.origin + '/' + lang.title + '/' + this.slug + '/' + this.id : ''
    }
  },
  watch: {
    video () {
      this.$nextTick(() => {
        this.resizeVideos();
      });
    },
    /*imageInput () {
      this.dialogMedia = false;
    }*/
  },
  mounted() {
    this.loadItem();
    //this.dark = localStorage.getItem("dark");
  },  
  methods: {
    loadItem() {
      if (this.id > 0) {
        this.loading = true;
        cms.getItem(this.tableName, this.id, {})
        .then(response => {
          if (response.id) {
            this.slug = response.slug;
            this.id_category = response.id_category;
            this.title = response.title;
            this.subtitle = response.subtitle;
            this.clickbait = response.clickbait;
            this.content = response.content;
            this.image_url = response.image_url;
            this.image_2_url = response.image_2_url;
            this.image_alt = response.image_alt;
            this.image_caption = response.image_caption;
            this.video = response.video;
            this.videoTmp = response.video;
            this.author = response.author;
            this.state = response.state;
            this.ord = response.ord;
            this.update_time_d = (response.update_time && response.update_time != '0000-00-00 00:00:00') ? response.update_time.substr(0, 10) : new Date().toISOString().substr(0, 10);
            this.update_time_h = (response.update_time && response.update_time != '0000-00-00 00:00:00') ? response.update_time.substr(11, 5) : new Date().toISOString().substr(11, 5);
            this.id_author = response.id_author;
            this.id_lang = (response.id_lang) ? response.id_lang : 1;
            this.event_date = response.event_date;
            this.event_time = response.event_time;
            this.event_date_end = response.event_date_end;
            this.archiving_date = response.archiving_date;
            this.view = response.view;
            //tags
            this.tags = response.tags;
            
            //gallery
            this.gallery = [...response.gallery];

          } else {
            this.$refs.form.reset();
          }

          //resize videos
          this.$nextTick(() => {
            this.resizeVideos();
          });
          
          this.loading = false;
        });
      } else {
        //update
        let d = new Date();
        this.update_time_d = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        this.update_time_h = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().substr(11, 5);

        //id category
        const urlParams = new URLSearchParams(window.location.search);
        const id_cat = urlParams.get('id_category');
        if (id_cat) {
          this.id_category = parseInt(id_cat);
        }
        //state
        this.state = 1;
        // lang
        this.id_lang = 1;
      }
    },
    saveItem() {
      this.loading = true;

      var elems = document.getElementById("form-contents").elements;
      var fd = {};

      for (let i = 0; i < elems.length; i++) {
        if (elems[i].name) {
          fd[elems[i].name] = elems[i].value;
        }
      }

      fd.content = this.content;
      fd.subtitle = this.subtitle;
      fd.tags = this.tags; //fd.tags = this.tags.map((item) => item.id )
      fd.gallery = this.gallery;
      
      if (this.id > 0) {
        cms.update(this.tableName, this.id, fd)
        .then(response => {
          if (response.id) {
            this.$store.commit('snack/open', {text: 'Artykuł pomyślnie zapisany', color: 'success'});
          } else {
            this.$store.commit('snack/open', {text: (response.message) ? response.message : 'Nie udało się zapisać zmian', color: 'error'});
          }
          this.loading = false;
          this.loadItem();
          this.parentRefresh();
        });
      } else {
        cms.create(this.tableName, fd)
        .then(response => {
          if (response.id) {
            this.id = response.id;
            this.$store.commit('snack/open', {text: 'Artykuł pomyślnie zapisany', color: 'success'});
            this.$router.push({ path: '/contents/' + response.id });
          } else {
            this.$store.commit('snack/open', {text: (response.message) ? response.message : 'Nie udało się zapisać zmian', color: 'error'});
          }
          this.loading = false;
          this.loadItem();
          this.parentRefresh();
        });
      }
    },
    toggleOrd(clickedOrd) {
      this.ord = (clickedOrd == this.ord) ? 0 : clickedOrd
    },
    resizeVideos() {
      const articleWidth = document.querySelector('.content-width').offsetWidth;
      const videos = document.querySelectorAll("iframe[src*='youtube'], iframe[src*='vimeo']");

      [].map.call(videos, function(item) {
        item.removeAttribute('width');
        item.removeAttribute('height');
        item.style.width = articleWidth + 'px';
        item.style.height = articleWidth * parseFloat(9/16) + 'px';
      });
    },
    openMediaDialog(field_id) {
      console.log(field_id)
      //if (this.dialogMediaContent == '') {
        this.dialogMediaContent = '<iframe width="100%" style="height:80vh;" frameborder="0" src="' + this.config.serverUrl + '/filemanager/dialog.php?relative_url=1&type=0&field_id=' + field_id + '" data-alloy-tabstop="true" tabindex="-1"></iframe>';
      //}

      //window.addEventListener('message', onMessage);
      this.dialogMedia = true;
    },
    onImageUploaded(url) {
      this.image_url = url;
    },
    onImage2Uploaded(url) {
      this.image_2_url = url;
    },
    abort() {
      window.close();
    },
    titleToSlug(force) {
      if (!this.slug || force) {
        this.slug = slugify(this.title)
      }
    },
    titleToClickbait(force) {
      if (!this.clickbait || force) {
        this.clickbait = this.title
      }
    },
    /*copySlug() {
      let copyInput = document.getElementById('slug');
      copyInput.select();
      copyInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.$store.commit('snack/open', {text: 'Slug skopiowany do schowka'});
    },*/
    parentRefresh() {
      window.opener.formRefresh();
    },
    updateArchivingDateEnd(event_date) {
      const date = new Date(event_date);
      date.setDate(date.getDate() + 14);
      this.archiving_date = date.toISOString().split('T')[0];
    },
    updateArchivingDate(event_date) {
      if (!this.event_date_end) {
        this.updateArchivingDateEnd(event_date);
      }
    },
    copyLinkHandler() {
      navigator.clipboard.writeText(this.articleLink).then(() => {
        this.$store.commit('snack/open', {text: 'Link skopiowany!', color: 'success'});
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  }
}
</script>

<style>
  
</style>