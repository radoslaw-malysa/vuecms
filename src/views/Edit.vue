<template>
  <v-container fluid class="d-flex justify-center pt-0 pb-0 relative">
    <v-btn
      depressed
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
      
      <div class="ed d-inline-block py-12">
        
        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-textarea
              name="title"
              v-model="title"
              @change="titleToSlug(false)"
              label="Tytuł"
              auto-grow
              rows="1"
              row-height="20"
              class="textarea-title"
            ></v-textarea>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside relative">
            <v-btn
              icon
              x-large
              title="Slug - adres strony"
              class="absolute-top-left"
              @click="showSlug = !showSlug"
              :color="(showSlug) ? 'primary' : 'grey lighten-2'"
            >
              <v-icon>link</v-icon>
            </v-btn>
          </div>
          <div class="ed-content flex-grow-1">
            <v-expand-transition>
            <v-text-field
              name="slug"
              v-model="slug"
              label="Slug"
              v-show="showSlug"
              append-icon="sync"
              @click:append="titleToSlug(true)"
            ></v-text-field>
            </v-expand-transition>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside"></div>
          <div class="ed-content flex-grow-1">
            <v-textarea
              name="clickbait"
              v-model="clickbait"
              label="Clickbait"
              auto-grow
              rows="1"
              row-height="20"
              counter="76"
            ></v-textarea>
          </div>
        </div>

        <div class="d-flex mb-6">
          <div class="ed-aside"></div>
          <div class="ed-content flex-grow-1">
            <v-textarea
              name="subtitle"
              v-model="subtitle"
              label="Wprowadzenie"
              auto-grow
              rows="1"
              row-height="20"
            ></v-textarea>
          </div>
        </div>

        <content-links :inputData.sync="links" />

        <div class="d-flex mb-6">
          <div class="ed-aside d-flex flex-column">
            <v-btn
              icon
              x-large
              title="Zdjęcie główne"
              :color="btnImageColor" 
              @click="showVideo = false"
            >
              <v-icon>image</v-icon>
            </v-btn>
            <v-btn
              icon
              x-large
              title="Video"
              :color="btnVideoColor"
              @click="showVideo = true"
            >
              <v-icon>slideshow</v-icon>
            </v-btn>
          </div>
          <div class="ed-content content-width flex-grow-1 relative">
            
            <v-card 
              v-show="!showVideo" 
              key="1"
              elevation="0"
              class="media-placeholder image-placeholder"
            >
              
              <v-responsive :aspect-ratio="3" v-if="isProfileImage">
                <v-card-text class="pa-0">
                  <v-img
                    aspect-ratio="3"
                    max-height="250"
                    max-width="750"
                    :src="coverImage"
                  >
                    <v-avatar
                      class="profile-avatar"
                      color="white"
                      size="136"
                    >
                      <v-img :src="avatarImage"></v-img>
                    </v-avatar>
                  </v-img>
                </v-card-text>
                <v-btn class="media-edit-btn avatar-edit-btn" fab small color="gray" elevation="0" @click.stop="openMediaDialog('image-input')">
                  <v-icon>photo_camera</v-icon>
                </v-btn>
                <v-btn v-if="image_url" class="media-clear-btn avatar-clear-btn" fab small color="gray" elevation="0" @click="image_url = null">
                  <v-icon>clear</v-icon>
                </v-btn>

                <v-btn class="cover-edit-btn" fab small color="gray" elevation="0" @click.stop="openMediaDialog('cover-input')">
                  <v-icon>photo_camera</v-icon>
                </v-btn>
                <v-btn v-if="cover_url" class="cover-clear-btn" fab small color="gray" elevation="0" @click="cover_url = null">
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-responsive>
              <v-responsive :aspect-ratio="1.5" v-else>
                <v-card-text class="pa-0">
                  <v-img
                    v-if="image_url"
                    aspect-ratio="1.5"
                    max-height="500"
                    max-width="750"
                    :src="config.serverUrl + '/thumbs/750x500/' + image_url"
                  ></v-img>
                </v-card-text>
                <v-btn class="media-edit-btn" fab small color="gray" elevation="0" @click.stop="openMediaDialog('image-input')">
                  <v-icon>photo_camera</v-icon>
                </v-btn>
                <v-btn
                  v-if="image_url"
                  class="media-clear-btn"
                  fab
                  small
                  color="gray"
                  elevation="0"
                  @click="image_url = null"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-responsive>

            </v-card>

            <v-card 
              v-show="showVideo"
              key="2"
              elevation="0"
              class="main-video media-placeholder video-placeholder"
            >
              <v-responsive :aspect-ratio="16/9">
                <v-card-text v-html="video" class="pa-0"></v-card-text>
                
                <v-menu
                  v-model="insertVideoMenu"
                  :close-on-content-click="false"
                  :nudge-width="500"
                  offset-x
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="media-edit-btn" fab small color="gray" elevation="0" 
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>code</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-toolbar
                      flat
                    >
                      <v-toolbar-title>Umieść film</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        @click="insertVideoMenu = false"
                      >
                        <v-icon>close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text class="py-0">
                      <v-textarea
                        name="video"
                        placeholder="Tutaj wstaw kod embed video (iframe)"
                        v-model="videoTmp"
                        hide-details
                        rows="6"
                        class="pt-0 mt-0"
                      ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        large
                        @click="insertVideoMenu = false"
                      >
                        Anuluj
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        large
                        @click="video = videoTmp; insertVideoMenu = false"
                      >
                        OK
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>

                <v-btn
                  v-if="video"
                  class="media-clear-btn"
                  fab
                  small
                  color="gray"
                  elevation="0"
                  @click="video = videoTmp = null"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-responsive>
            </v-card>


            <v-text-field 
              name="image_caption"
              label="Podpis obrazka" 
              type="text" 
              v-model="image_caption"
              class="mt-6"
            ></v-text-field>
            <v-text-field 
              name="image_alt"
              label="Alt obrazka" 
              type="text" 
              v-model="image_alt"
            ></v-text-field>
            <input id="image-input" type="hidden" />
            <input name="image_url" type="hidden" v-model="image_url" />
            <input id="cover-input" type="hidden" />
            <input name="cover_url" type="hidden" v-model="cover_url" />
            <input name="video" type="hidden" v-model="video" />
          </div>
        </div>


        <div class="d-flex" :class="{'mb-12': relatedSelected.length > 0}">
          <div class="ed-aside relative">
            <div class="absolute-top-left">
              <v-menu offset-x :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    x-large
                    title="Dodaj linki"
                  >
                    <v-icon>facebook</v-icon>
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

        <div class="d-flex">
          <div class="ed-aside">
          </div>
          <div id="editor-wrap" class="ed-content article-content article-cms editor-wrap flex-grow-1" style="width:750px;">
            <editor
              id="editor-content"
              :inline=true
              v-model="content"
              :init="tinyInit"
              class="editor-content"
            />
          </div>
        </div>



        
        
        <div class="d-flex mt-6">
          <div class="ed-aside relative">
          </div>
          <div class="ed-content flex-grow-1">
            <v-select
              name="id_author"
              :items="authors"
              item-text="title"
              item-value="id"
              v-model="id_author"
              label="Autor"
              clearable
              hide-details
            ></v-select>
          </div>
        </div>

        <div class="d-flex mb-10 mt-6">
          <div class="ed-aside relative">
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="author"
              v-model="author"
              label="Autor inny"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex mb-6">
          <div class="ed-aside">
          </div>
          <div class="ed-content flex-grow-1" style="width: 750px;">
            <contents-contents :id_category="2" :inputData.sync="contentsContents[2]" />
            <contents-contents :id_category="4" :inputData.sync="contentsContents[4]" />
            <contents-contents :id_category="5" :inputData.sync="contentsContents[5]" />
            <contents-contents :id_category="6" :inputData.sync="contentsContents[6]" />
          </div>
        </div>

        <div class="d-flex" style="margin-bottom: 250px;">
          <div class="ed-aside">
            <v-btn
              icon
              large
              title="Dodaj galerię zdjęć"
            >
              <v-icon>add_a_photo</v-icon>
            </v-btn>
          </div>
          <div class="ed-content flex-grow-1">
            
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
          
            <v-card-text class="py-8">
              <v-row>
                <v-col
                  cols="8"
                >
                  <label>Data</label>
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
              </v-row>

              <v-row>
                <v-col>
                  <label>Wyróżnij</label>
                  <input type="hidden" name="ord" v-model="ord" />
                  <v-chip
                    filter
                    class="mr-2 medium"
                    :color="(ord == 3) ? 'primary' : ''"
                    @click=toggleOrd(3)
                  >Przypięty</v-chip>
                  <v-chip
                    filter
                    
                    class="medium"
                    :color="(ord == 2) ? 'accent' : ''"
                    @click=toggleOrd(2)
                  >Sponsorowany</v-chip>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <label>Kategoria</label>
                  <v-select
                    name="id_category"
                    :items="config.categories"
                    item-text="title"
                    item-value="id"
                    v-model="id_category"
                    outlined
                    rounded
                    dense
                    hide-details
                  ></v-select>
                  <input type="hidden" name="view" v-model="view" />
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <label>Tagi</label>
                  <content-tags :inputData.sync="tags" />
                </v-col>
              </v-row>

              <v-row v-if="id_category == 2">
                <v-col>
                  <label>Para walutowa</label>
                  <v-select
                    name="currency_pair"
                    :items="config.pairs"
                    item-text="title"
                    item-value="id"
                    v-model="currency_pair"
                    outlined
                    rounded
                    dense
                    hide-details
                  ></v-select>
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
import ContentsContents from '../components/ContentsContents.vue'
import ContentTags from '../components/ContentTags.vue'
import ContentLinks from '../components/ContentLinks.vue'

export default {
  name: 'Contents',
  props: ['id'],
  components: {
    'editor': Editor,
    ContentsContents,
    ContentTags,
    ContentLinks
  },
  data: () => ({
    tableName: 'contents',
    id_category: null,
    slug: null,
    title: null,
    subtitle: null,
    clickbait: null,
    content: null,
    image_url: null,
    image_alt: null,
    image_caption: null,
    video: null,
    author: '',
    state: null,
    ord: 0,
    update_time_d: null,
    update_time_h: null,
    currency_pair: null,
    cover_url: null,
    id_author: null,

    // slug
    showSlug: false,
    // affiliate
    showAffiliate: false,
    // main image
    showVideo: false,
    dialogMedia: false,
    dialogMediaContent: '',

    imageInput: '',

    // main video
    videoTmp: null,
    insertVideoMenu: false,

    // related
    related: {},
    relatedSettings: [
      { id: 'twitter', title: 'Twitter' },
      { id: 'linkedin', title: 'LinkedIn' },
      { id: 'facebook', title: 'Facebook' },
      { id: 'medium', title: 'Medium' },
      { id: 'youtube', title: 'Youtube' },
      { id: 'telegram', title: 'Telegram' },
      { id: 'instagram', title: 'Instagram' },
      { id: 'reddit', title: 'Reddit' },
      { id: 'github', title: 'Github' },
      { id: 'blog', title: 'Blog' },
      { id: 'www', title: 'WWW' }
    ],
    relatedSelected: [],

    // contents_contents
    contentsContents: {
      2: [],
      4: [],
      5: [],
      6: []
    },

    // tags
    tags: [],
    
    // links
    links: [],

    // authors
    authors: [],

    dateMenu: false,
    loading: false,
    // dark: false
  }),
  computed: {
    ...mapGetters('config', ['config', 'contentsStates', 'categoryTemplate']),
    btnImageColor() {
      if (!this.showVideo) {
        return 'primary'
      } else {
        return (this.image_url) ? 'secondary' : 'grey lighten-2'
      }
    },
    btnVideoColor() {
      if (this.showVideo) {
        return 'primary'
      } else {
        return (this.video) ? 'secondary' : 'grey lighten-2'
      }
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
          'media table paste code responsivefilemanager '
        ],
        toolbar: [
          'undo redo | styleselect | bold italic blockquote | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent',
          'table | link anchor image media | responsivefilemanager | removeformat code' ],
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
    view() {
      return (this.id_category) ? this.categoryTemplate(this.id_category).view : this.categoryTemplate(1).view
    },
    relatedSettingsSeleted() {
      return this.relatedSettings.filter(item => this.relatedSelected.includes(item.id) );
      /*this.relatedSettings.forEach(item => {
        if (this.relatedSelected.includes(item.id)) {
          sel.push(item)
        }
      });*/
    },
    isProfileImage() {
      return (this.id_category != 1 && this.id_category != 3 && this.id_category != 7) ? true : false
    },
    avatarImage() {
      return (this.image_url) ? this.config.serverUrl + '/thumbs/136x136/' + this.image_url : this.config.serverUrl + '/images/no_avatar.svg'
    },
    coverImage() {
      return (this.cover_url) ? this.config.serverUrl + '/thumbs/1080x360/' + this.cover_url : null
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
    this.loadAuthors();
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
            this.image_alt = response.image_alt;
            this.image_caption = response.image_caption;
            this.video = response.video;
            if (response.affiliate_url) {
              this.affiliate_url = response.affiliate_url;
              this.showAffiliate = true;
            }
            this.videoTmp = response.video;
            this.author = response.author;
            this.state = response.state;
            this.ord = response.ord;
            this.update_time_d = (response.update_time != '0000-00-00 00:00:00') ? response.update_time.substr(0, 10) : new Date().toISOString().substr(0, 10);
            this.update_time_h = (response.update_time != '0000-00-00 00:00:00') ? response.update_time.substr(11, 5) : new Date().toISOString().substr(11, 5);
            this.currency_pair = response.currency_pair;
            this.cover_url = response.cover_url;
            this.id_author = response.id_author;

            //tags
            this.tags = response.tags;

            //related
            this.related = [];
            if (response.related) {
              let rel = JSON.parse(response.related);
              if (typeof rel === 'object') {
                rel.forEach(item => {
                  this.related[item.id] = item.url;
                  this.relatedSelected.push(item.id);
                });
              }
            }

            //links
            this.links = [];
            if (response.links) {
              let lin = JSON.parse(response.links);
              this.links = lin;
            }

            if (typeof response.contents_contents[2] === 'object') { this.contentsContents[2] = response.contents_contents[2] }
            if (typeof response.contents_contents[4] === 'object') { this.contentsContents[4] = response.contents_contents[4] }
            if (typeof response.contents_contents[5] === 'object') { this.contentsContents[5] = response.contents_contents[5] }
            if (typeof response.contents_contents[6] === 'object') { this.contentsContents[6] = response.contents_contents[6] }
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
        this.state = 2;
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
      fd.tags = this.tags; //fd.tags = this.tags.map((item) => item.id )
      fd.links = this.links;

      let cc = [];
      if (this.contentsContents[2].length > 0) { cc = cc.concat(this.contentsContents[2].map((item) => item.id)); }
      if (this.contentsContents[4].length > 0) { cc = cc.concat(this.contentsContents[4].map((item) => item.id)); }
      if (this.contentsContents[5].length > 0) { cc = cc.concat(this.contentsContents[5].map((item) => item.id)); }
      if (this.contentsContents[6].length > 0) { cc = cc.concat(this.contentsContents[6].map((item) => item.id)); }
      fd.contents_contents = cc;
      //fd.contents_contents = JSON.parse(JSON.stringify(this.contentsContents));

      //related
      /*let related = [];
      this.relatedSettingsSeleted.forEach(item => {
        related.push({ id: item.id, url: this.related[item.id] })
      });*/
      let related = this.relatedSettingsSeleted.map(item => { return { id: item.id, url: this.related[item.id] } })
      fd.related = (related.length > 0) ? related : '';
      
      if (this.id > 0) {
        cms.update(this.tableName, this.id, fd)
        .then(response => {
          if (response.id) {
            this.$store.commit('snack/open', {text: 'Artykuł pomyślnie zapisany', color: 'success'});
          } else {
            this.$store.commit('snack/open', {text: (response.message) ? response.message : 'Nie udało się zapisać zmian', color: 'error'});
          }
          this.loading = false;
          this.parentRefresh();
        });
      } else {
        cms.create(this.tableName, fd)
        .then(response => {
          if (response.id) {
            //this.id = response.id;
            this.$store.commit('snack/open', {text: 'Artykuł pomyślnie zapisany', color: 'success'});
            this.$router.push({ path: '/contents/' + response.id });
          } else {
            this.$store.commit('snack/open', {text: (response.message) ? response.message : 'Nie udało się zapisać zmian', color: 'error'});
          }
          this.loading = false;
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
      //if (this.dialogMediaContent == '') {
        this.dialogMediaContent = '<iframe width="100%" style="height:80vh;" frameborder="0" src="' + this.config.serverUrl + '/filemanager/dialog.php?relative_url=1&type=0&field_id=' + field_id + '" data-alloy-tabstop="true" tabindex="-1"></iframe>';
      //}

      //window.addEventListener('message', onMessage);
      this.dialogMedia = true;
    },
    abort() {
      window.close();
    },
    titleToSlug(force) {
      if (!this.slug || force) {
        this.slug = slugify(this.title)
      }
    },
    copySlug() {
      let copyInput = document.getElementById('slug');
      copyInput.select();
      copyInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.$store.commit('snack/open', {text: 'Slug skopiowany do schowka'});
    },
    parentRefresh() {
      window.opener.formRefresh();
    },
    loadAuthors() {
      cms.autocomplete('contents', '', { id_category: 8 })
      .then(res => {
        this.authors = res
      });
    }
  }
}
</script>

<style>
  .relative {
    position: relative;
  }
  .ed {
    width: 90%;
  }
  .ed-aside {
    width: 100px;
  }
  .main-video iframe {
    display: block;
  }
  .media-edit-btn {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
  }
  .media-clear-btn {
    position: absolute;
    top: 0.5rem;
    left: 3.5rem;
  }
  .v-textarea.slim textarea {
    margin-top: 0 !important;
  }
  @media (min-width: 1264px) {
    .ed {
      width: 850px;
    }
    .ed .v-text-field input, .ed .v-text-field textarea {
      font-size: 1.25rem;
    }
    .ed .v-text-field.textarea-title textarea {
      font-weight: 700;
      font-size: 24px;
    }
  }
</style>
<!--https://stackoverflow.com/questions/55808628/how-to-clear-v-autocomplete-multiple-search-input-after-selecting-the-checkbox-->