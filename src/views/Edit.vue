<template>
  <div>
    <v-navigation-drawer 
      fixed
      permanent
      right
      width="360px"
      class="ed-drawer drv-right-shadow"
    >
      <v-card 
        flat 
        tile
        height="100%"
      >
        <v-toolbar
          elevation="0"
          color="transparent"
          class="py-3x bb"
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
    </v-navigation-drawer>
    
    <v-container fluid class="d-flex justify-center" style="padding-right: 360px;">
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


        <div class="d-flex mb-6">
          <div class="ed-aside d-flex flex-column">
            <v-btn
              icon
              large
              title="Zdjęcie główne"
              :color="(imageExist) ? 'primary' : 'secondary'" 
            >
              <v-icon>image</v-icon>
            </v-btn>
            <v-btn
              icon
              large
              title="Video"
              :color="(videoExist) ? 'primary' : 'secondary'"
            >
              <v-icon>slideshow</v-icon>
            </v-btn>
          </div>
          <div class="ed-content flex-grow-1">
            <v-card>
              <v-img
                max-height="500"
                max-width="750"
                :src="config.serverUrl + '/thumbs/750x500/' + image_url"
              ></v-img>
            </v-card>
            <v-card class="content-video" v-html="video" >
              
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
          <div class="ed-aside">x
          </div>
          <div class="ed-content flex-grow-1" style="width:750px;">
            <div v-html="content">

            </div>
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
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cms from '../api/cms'
export default {
  name: 'Contents',
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
    imageExist() {
      return this.image_url != null && this.image_url != ''
    },
    videoExist() {
      return this.video != null && this.video != ''
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
      console.log(val)
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
            this.state = response.state;
            this.ord = response.ord;
            this.update_time_d = new Date(response.update_time).toISOString().substr(0, 10);
            this.update_time_h = new Date(response.update_time).toISOString().substr(11, 5);
          } else {
            this.$refs.form.reset();
          }
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
    }
  }
}
</script>

<style>
  .ed {
    width: 90%;
  }
  .ed-aside {
    width: 100px;
  }
  @media (min-width: 1264px) {
    .ed {
      width: 850px;
    }
  }
</style>