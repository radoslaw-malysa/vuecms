<template>
  <div class="article-gallery">
    <!-- 1. UPLOAD ZONE -->
    <file-pond
      ref="pond"
      name="file"
      label-idle="Upuść obrazki tutaj lub <span class='filepond--label-action'>Przeglądaj</span>"
      :allow-multiple="true"
      accepted-file-types="image/jpeg, image/png"
      :server="serverConfig"
      @processfile="onProcessFile"
    />

    <!-- 2. GALLERY MANAGER (Draggable) -->
    <draggable
      v-model="internalImages"
      class="row mx-n2"
      ghost-class="ghost-card"
      @change="onReorder"
    >
      <v-col
        v-for="(img, index) in internalImages"
        :key="img.id"
        cols="12"
        sm="3"
        md="2"
        class="pa-1"
      >
        <v-card outlined class="gallery-item">
          <v-img
            :src="img.url"
            aspect-ratio="1"
            class="grey lighten-2 rounded"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
            
            <!-- Actions -->
            <div class="gallery-actions pa-1">
              <v-btn icon small color="error" class="bg-white" @click="removeImage(index)">
                <v-icon small>delete</v-icon>
              </v-btn>
            </div>
            
            <!-- Drag Handle Icon -->
            <div class="drag-handle pa-1">
              <v-icon color="white">drag-variant</v-icon>
            </div>
          </v-img>
          <!--<v-card-subtitle class="text-truncate py-1 px-2 text-caption">
            {{ img.name || 'Image ' + (index + 1) }}
          </v-card-subtitle>-->
        </v-card>
      </v-col>
    </draggable>

    <v-alert v-if="internalImages.length === 0" type="info" text class="mt-2">
      Brak zdjęć w galerii
    </v-alert>
  </div>
</template>

<script>
// Import FilePond
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import Plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Import Draggable
import draggable from 'vuedraggable';

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

import { mapGetters } from 'vuex'

export default {
  name: 'ArticleGallery',
  components: { FilePond, draggable },
  props: {
    // Initial images from the API: [{ id: 1, url: '...', name: '...' }]
    value: {
      type: Array,
      default: () => []
    },
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      internalImages: [...this.value],
      serverConfig: {
        /*url: '/cms', // Your API Base URL
        process: {
          url: `/gallery/process/${this.articleId}`,
          headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        },*/
        url: 'http://elektrownia.test/cms',
        process: `/gallery/process/${this.articleId}`,
        load: `/gallery/load/${this.articleId}`,
      }
    };
  },
  computed: {
    ...mapGetters('config', ['config']),
  },
  watch: {
    value(newVal) {
      this.internalImages = [...newVal];
    }
  },
  mounted() {
    console.log('xxx')
    console.log(this.config.serverUrl)
  },
  methods: {
    // Called when FilePond successfully uploads a file
    onProcessFile(error, file) {
      if (error) return;
      
      // Assume server returns the saved image object in file.serverId or similar
      const response = JSON.parse(file.serverId);
      
      // Add the new image to our draggable list
      this.internalImages.push({
        id: response.id,
        url: response.url,
        name: response.filename
      });
      
      this.emitChange();
      
      // Optionally clear the FilePond queue after success
      setTimeout(() => this.$refs.pond.removeFile(file.id), 2000);
    },

    removeImage(index) {
      if (confirm('Are you sure you want to remove this image?')) {
        this.internalImages.splice(index, 1);
        this.emitChange();
      }
    },

    onReorder() {
      this.emitChange();
    },

    emitChange() {
      // Sync with parent component (EditArticle.vue)
      this.$emit('input', this.internalImages);
    }
  }
};
</script>

<style>
.filepond--item {
    width: calc(20% - 0.5em);
}

.gallery-item {
  position: relative;
  transition: transform 0.2s;
}

.gallery-actions {
  position: absolute;
  top: 0;
  right: 0;
  /*background: rgba(0,0,0,0.3);
  border-bottom-left-radius: 4px;*/
}

.drag-handle {
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: grab;
  background: rgba(0,0,0,0.3);
  border-top-right-radius: 4px;
}

.bg-white {
  background: white !important;
}

.ghost-card {
  opacity: 0.4;
  border: 2px dashed #1976D2 !important;
}
</style>