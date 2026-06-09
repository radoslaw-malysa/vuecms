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
            <v-select
              :items="artFields"
              item-text="title"
              item-value="id"
              v-model="field_of_art"
              label="Typ obiektu"
              name="field_of_art"
              flat
            ></v-select>
          </div>
        </div>


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
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  name="year_of_creation_end"
                  v-model="year_of_creation_end"
                  label="Data ukończenia"
                  type="number"
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
              name="acquisition"
              v-model="acquisition"
              label="Sposób pozyskania"
              type="text"
            ></v-text-field>
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
              type="number"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="height"
              v-model="height"
              label="Wysokość"
              type="text"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="width"
              v-model="width"
              label="Szerokość"
              type="text"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="shape"
              v-model="shape"
              label="Kształt"
              type="text"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="technique"
              v-model="technique"
              label="Technika wykonania"
              type="text"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="medium"
              v-model="medium"
              label="Medium"
              type="text"
            ></v-text-field>
          </div>
        </div>

        <div class="d-flex">
          <div class="ed-aside">
            &nbsp;
          </div>
          <div class="ed-content flex-grow-1">
            <v-text-field
              name="material"
              v-model="material"
              label="Materiał"
              type="text"
            ></v-text-field>
          </div>
        </div>
        


        

        <div class="d-flex" style="margin-bottom: 250px;">
          <div class="ed-aside"></div>
          <div class="ed-content flex-grow-1">
            <gallery 
              v-model="gallery" 
              :article-id="id"
              slug="artworks"
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
          
            <v-card-text class="pt-16">
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

export default {
  name: 'EditArtwork',
  props: ['id'],
  components: {
    'editor': Editor,
    ContentTags,
    Gallery
  },
  data: () => ({
    tableName: 'artworks',
    register_number: null,
    field_of_art: null,
    title: null,
    acquisition: null,
    year_of_acquisition: null,
    author: null,
    location: null,
    year_of_creation_start: null,
    year_of_creation_end: null,
    height: null,
    width: '',
    shape: null,
    technique: 0,
    medium: null,
    material: null,
    technical_data: null,
    image_url: null,
    images: null,
    state: null,
    gallery: [],

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

    artFields: [
      { id: 'Malarstwo', title: 'Malarstwo' },
      { id: 'Fotografia', title: 'Fotografia' },
      { id: 'Grafika komputerowa', title: 'Grafika komputerowa' },
      { id: 'Grafika warsztatowa', title: 'Grafika warsztatowa' },
      { id: 'Muzealia Pozaartystyczne', title: 'Muzealia Pozaartystyczne' },
      { id: 'Rysunek', title: 'Rysunek' },
      { id: 'Rzeźba', title: 'Rzeźba' },
      { id: 'Zapisy Cyfrowe', title: 'Zapisy Cyfrowe' }
    ],

  }),
  computed: {
    ...mapGetters('config', ['config', 'contentsStates']),
    articleLink() {
      if (!this.id) { return ''; }
      return window.location.origin + '/pl/zbiory/' + this.id
    }
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
            this.register_number = response.register_number;
            this.field_of_art = response.field_of_art;
            this.title = response.title;
            this.acquisition = response.acquisition;
            this.year_of_acquisition = response.year_of_acquisition;
            this.author = response.author;
            this.year_of_creation_start = response.year_of_creation_start;
            this.year_of_creation_end = response.year_of_creation_end;
            this.height = response.height;
            this.width = response.width;
            this.shape = response.shape;
            this.technique = response.technique;
            this.medium = response.medium;
            this.material = response.material;
            this.state = response.state;
            
            //gallery
            this.gallery = [...response.gallery];
            console.log('xxx');
            console.log(this.gallery);

          } else {
            this.$refs.form.reset();
          }

          //resize videos
          /*this.$nextTick(() => {
            this.resizeVideos();
          });*/
          
          this.loading = false;
        });
      } else {
        
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