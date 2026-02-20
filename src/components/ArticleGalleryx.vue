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
      <v-icon size="48" color="primary">mdi-cloud-upload</v-icon>
      <div class="text-h6 mt-2">Click or Drag Images Here</div>
      <input 
        type="file" 
        ref="fileInput" 
        multiple 
        hidden 
        accept="image/*" 
        @change="handleFiles"
      >
    </v-sheet>

    <!-- Progress Bars for active uploads -->
    <div v-for="(progress, name) in uploadQueue" :key="name" class="mb-2">
      <div class="text-caption">{{ name }}</div>
      <v-progress-linear :value="progress" height="10" rounded color="primary"></v-progress-linear>
    </div>

    <!-- The same Draggable Gallery from before -->
    <draggable v-model="internalImages" class="row">
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
  </div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';

export default {
  components: { draggable },
  data() {
    return {
      isDragging: false,
      uploadQueue: {}, // Track progress of each file
      internalImages: [] // Your gallery images
    }
  },
  methods: {
    onDrop(e) {
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
    },
    async uploadSingleFile(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`/api/articles/${this.articleId}/gallery`, formData, {
          /*onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // Update progress bar
            this.$set(this.uploadQueue, file.name, percent);
          }*/
        });

        //const response = await fetch()

        // Add to gallery
        this.internalImages.push(response.data);
        // Remove from progress list
        this.$delete(this.uploadQueue, file.name);
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  }
}
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #bdbdbd !important;
}
</style>