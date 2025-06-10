<template>
  <v-card
    class="mx-auto shadow-sm bg-neutral-50 rounded-lg"
    rounded
    outlined
  >
    <v-card-title class="pb-0">
      <v-textarea
        name="query"
        v-model="query"
        label="O czym chcesz napisać?"
        hint="Np.: Jakie korzyści płyną z regularnego czytania książek?"
        auto-grow
        rows="1"
        row-height="20"
      ></v-textarea>
    </v-card-title>
    <v-expand-transition>
      <v-card-actions>
        <div class="w-i-words mr-2">
          <v-text-field 
            placeholder="Ile słów?" 
            type="text" 
            outlined
            rounded
            dense
            hide-details
            v-model="wordsLimit"
            name="wordsLimit"
            suffix="słów"
          ></v-text-field>
        </div>
        <v-chip
          :outlined = "!createImage"
          medium
          class="chip-mid"
          :color="createImage ? '#E8EAF6' : ''"
          :textColor="createImage ? 'primary' : ''"
          @click="createImage = !createImage"
        >
          <v-icon left :color="createImage ? 'primary' : '#616161'">
            wallpaper
          </v-icon>
          Wygeneruj obrazek
        </v-chip>

        <v-spacer></v-spacer>
        <v-btn
          icon
          outlinedx
        >
          <v-icon>tune</v-icon>
        </v-btn>
        <v-btn
          fab
          depressed
          small
          color="primary"
          :disabled="!query || loading"
          :loading="loading"
          @click="sendQuery"
        >
          <v-icon>arrow_upward</v-icon>
        </v-btn>
      </v-card-actions>
    </v-expand-transition>
  </v-card>
</template>
<script>
import ai from '../api/ai'

export default {
  name: 'CreateArticle',
  props: {
    aiArticle: Object,
    image_url: String
  },
  data: () => ({
    query: '',
    wordsLimit: 500,
    createImage: true,
    loading: false
  }),
  computed: {
    
  },
  methods: {
    sendQuery() {
      this.loading = true;
      ai.query({
        query: this.query,
        wordsLimit: this.wordsLimit,
        createImage: this.createImage
      })
      .then(res => {
        this.$emit('update:aiArticle', res);
        this.loading = false;
        
        if (this.createImage && res.image_create_prompt) {
          console.log(1)
          ai.createImage({
            query: res.image_create_prompt
          })
          .then(res => {
            console.log(res);

            if (res.url) {
        
              this.$emit('update:image_url', res.url);
            } else {
              console.log(res.message);
            }
          });
        }
      })
    }
  }
};
</script>

<style>
  .w-i-words {
    width: 120px !important;
  }
  .shadow-sm {
    box-shadow: rgb(247, 249, 249) 0px 0px 4px 2px;
  }
  .bg-neutral-50 {
    background-color: #f7f9f9 !important;
  }
  .v-chip.v-size--default.chip-mid {
    height: 40px;
    border-radius: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
