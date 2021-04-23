<template>
  <v-container fluid class="d-flex justify-center pt-0">
    <div class="ed d-inline-block pt-12">
      <div class="d-flex">
        <div class="ed-aside"></div>
        <div class="ed-content flex-grow-1">
          <v-textarea
            name="title"
            v-model="title"
            label="Tytuł"
            auto-grow
            rows="1"
            row-height="20"
            class="textarea-title"
          ></v-textarea>
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

      <div class="d-flex mb-4">
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
            <v-responsive :aspect-ratio="1.5">
              <v-card-text class="pa-0">
                <v-img
                  v-if="image_url"
                  aspect-ratio="1.5"
                  max-height="500"
                  max-width="750"
                  :src="config.serverUrl + '/thumbs/750x500/' + image_url"
                ></v-img>
              </v-card-text>
              <v-btn class="media-edit-btn" fab small color="gray" elevation="0">
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
            label="Alt" 
            type="text" 
            v-model="image_alt"
          ></v-text-field>
        </div>
      </div>


      <div class="d-flex">
        <div class="ed-aside">
        </div>
        <div class="ed-content article-content flex-grow-1" style="width:750px;">
          <editor
            :inline=true
            v-model="content"
            :init="tinyInit"
          />
        </div>
      </div>

      <div class="d-flex">
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
      <div class="sticked">
        <v-card 
          flat 
          tile
          width="360px"
          class="pt-6"
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
              @click="loadItem"
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
                  :color="(ord == 1) ? 'primary' : ''"
                  @click=toggleOrd(1)
                >Przypięty</v-chip>
                <v-chip
                  filter
                  
                  class="medium"
                  :color="(ord == 2) ? 'primary' : ''"
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
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label>Tagi</label>
                <v-autocomplete
                  v-model="tagAdd"
                  item-text="title"
                  item-value="id"
                  return-object
                  :loading="tagLoading"
                  :items="tagItems"
                  :search-input.sync="searchTag"
                  cache-items
                  hide-no-data
                  hide-details
                  placeholder="Tag"
                  prepend-inner-icon="add"
                  outlined
                  rounded
                  dense
                ></v-autocomplete>
                <div class="pt-2">
                  <v-chip-group
                    column
                  >
                    <v-chip
                      v-for="tag in tags"
                      :key="tag.id"
                      close
                      @click:close="delTag(tag.id)"
                    >
                      {{ tag.title }}
                      <input type="hidden" name="tags[]" :value="tag.id" />
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-col>
            </v-row>
            
          </v-card-text>
        </v-card>
      </div>
    </div>

    <v-btn
      depressed
      fab
      icon
      large
      fixed
      top
      left
      @click="abort"
    >
      <v-icon>arrow_back</v-icon>
    </v-btn>



  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import cms from '../api/cms'
import Editor from '@tinymce/tinymce-vue'
export default {
  name: 'Contents',
  components: {
    'editor': Editor
  },
  data: () => ({
    tableName: 'contents',
    id: '11',
    id_category: null,
    title: null,
    subtitle: null,
    clickbait: null,
    content: null,
    image_url: null,
    image_alt: null,
    image_caption: null,
    video: null,
    state: null,
    ord: 0,
    update_time_d: null,
    update_time_h: null,

    //main image
    showVideo: false,

    //main video
    videoTmp: null,
    insertVideoMenu: false,

    //tag autocomplete
    tagLoading: false,
    tagItems: [],
    searchTag: null,
    tagAdd: {},
    tags: [{id: 8, slug: 'social-apps', title: 'Social Apps'}, {id: 9, slug: 'dapp-browsers', title: 'DApp Browsers'}],

    dateMenu: false
  }),
  computed: {
    ...mapGetters('config', ['config', 'contentsStates']),
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
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code responsivefilemanager '
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | responsivefilemanager',
        image_advtab: true,
        external_filemanager_path: this.config.serverUrl + '/filemanager/',
        filemanager_title: 'Media',
        external_plugins: {
          'responsivefilemanager': this.config.serverUrl + '/js/tinymce/plugins/responsivefilemanager/plugin.min.js',
          'filemanager': this.config.serverUrl + '/filemanager/plugin.min.js'
        }
      }
    }
  },
  watch: {
    searchTag (val) {
      val && val !== this.idTagAdd && this.findTag(val)
    },
    tagAdd (val) {
      this.tags.push(val);
    },
    video (val) {
      this.$nextTick(() => {
        this.resizeVideos();
      });
    }
  },
  mounted() {
    this.loadItem();
  },  
  methods: {
    loadItem() {
      if (this.id) {
        this.loading = true;
        cms.getItem(this.tableName, this.id, {})
        .then(response => {
          if (response.id) {
            this.id_category = response.id_category;
            this.title = response.title;
            this.subtitle = response.subtitle;
            this.clickbait = response.clickbait;
            this.content = response.content;
            this.image_url = response.image_url;
            this.image_alt = response.image_alt;
            this.image_caption = response.image_caption;
            this.video = response.video;
            this.videoTmp = response.video;
            this.state = response.state;
            this.ord = response.ord;
            this.update_time_d = new Date(response.update_time).toISOString().substr(0, 10);
            this.update_time_h = new Date(response.update_time).toISOString().substr(11, 5);
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
        let d = new Date();
        this.update_time_d = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        this.update_time_h = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().substr(11, 5);
      }
    },
    toggleOrd(clickedOrd) {
      this.ord = (clickedOrd == this.ord) ? 0 : clickedOrd
    },
    findTag(q) {
      this.tagLoading = true;
      cms.autocomplete('tags', q)
      .then(response => {
        if (response) {
          this.tagItems = response;
        }
        this.tagLoading = false;
      });
    },
    delTag(id) {
      let i = this.tags.map(function(item) { return item.id; }).indexOf(id);
      this.tags.splice(i, 1);
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
    abort() {

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
  @media (min-width: 1264px) {
    .ed {
      width: 850px;
    }
    .ed .v-text-field input, .v-text-field textarea {
      font-size: 1.25rem;
    }
    .textarea-title textarea {
      font-weight: 700;
      font-size: 24px;
    }
  }
</style>