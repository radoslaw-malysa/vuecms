<template>
  <div class="gallery-container">
    <!-- Custom Drop Zone using Vuetify Styles -->
    <v-sheet
      outline
      color="grey lighten-4"
      class="pa-8 mb-4 d-flex flex-column align-center justify-center rounded-lg border-dashed"
      @drop.prevent="onDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="{ 'blue lighten-5': isDragging }"
      style="border: 2px dashed #ccc; cursor: pointer"
      @click="$refs.fileInput.click()"
    >
      <!--<v-icon size="48" color="grey">upload</v-icon>-->
      <div class="text-subtitle-1 mt-2 text-grey">Kliknij lub upuść zdjęcia tutaj</div>
      <input 
        type="file" 
        ref="fileInput" 
        multiple 
        hidden 
        accept="image/*" 
        @change="handleFiles"
      >

      <!-- Progress Bars for active uploads -->
      <div class="w-100">
        <div v-for="(progress, name) in uploadQueue" :key="name" class="mb-2 w-100">
          <div class="text-caption">{{ name }}</div>
          <v-progress-linear :value="progress" height="10" rounded color="primary"></v-progress-linear>
        </div>
      </div>
    </v-sheet>


    <!-- The same Draggable Gallery from before -->
    <draggable 
      v-model="internalImages" 
      ghost-class="ghost-card"
      class="row mx-n2"
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
            :src="serverUrl + '/thumbs/256x256/' + img.image_url"
            aspect-ratio="1"
            class="grey lighten-2 rounded grab"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
            
            <div class="gallery-actions pa-1">
              <v-btn icon small color="error" class="bg-white" @click="removeImage(index)">
                <v-icon small>delete</v-icon>
              </v-btn>
            </div>
          </v-img>
          <!--<v-card-subtitle class="text-truncate py-1 px-2 text-caption">
            {{ img.title || 'Image ' + (index + 1) }}
          </v-card-subtitle>-->
        </v-card>
      </v-col>
    </draggable>
  </div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';

export default {
  components: { draggable },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    articleId: {
      type: [String, Number],
      required: false
    },
    slug: {
      type: [String],
      required: false
    },
    serverUrl: {
      type: [String],
      required: true
    }
  },
  data() {
    return {
      isDragging: false,
      uploadQueue: {}, // Track progress of each file
      internalImages: [...this.value]
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.internalImages = [...newVal]
        }
      }
    }
  },
  methods: {
    onDrop(e) {
      console.log('drop')
      this.isDragging = false;
      const files = e.dataTransfer.files;
      this.uploadFiles(files);
    },
    handleFiles(e) {
      this.uploadFiles(e.target.files);
    },
    async uploadFiles(files) {
      for (let file of files) {
        await this.uploadSingleFile(file);
      }
      this.emitChange();
    },
    async uploadSingleFile(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', this.slug);

      try {
        //http://elektrownia.test/cms
        const response = await axios.post(`${this.serverUrl}/cms/gallery/process/${this.articleId}`, formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // Update progress bar
            this.$set(this.uploadQueue, file.name, percent);
          }
        });

        // Add to gallery
        this.internalImages.push(response.data);
        // Remove from progress list
        this.$delete(this.uploadQueue, file.name);
      } catch (err) {
        console.error("Upload failed", err);
      }
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
}
</script>

<style>
.border-dashed {
  border: 2px dashed #bdbdbd !important;
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
.grab {
  cursor: grab;
}
.text-grey {
  color:#a2a2a2;
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
.w-100 {
  width: 100%;
}
</style>