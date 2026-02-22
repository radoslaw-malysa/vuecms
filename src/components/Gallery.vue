<template>
  <v-card outlined class="pa-4">
    <!-- Drop Zone -->
    <v-sheet
      color="grey lighten-4"
      class="upload-zone d-flex flex-column align-center justify-center rounded-lg mb-6"
      :class="{ 'blue lighten-5 border-active': isDragging }"
      @drop.prevent="onDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="$refs.fileInput.click()"
    >
      <input type="file" ref="fileInput" multiple hidden accept="image/*" @change="onFileSelect">
      
      <v-icon size="40" color="primary">mdi-cloud-upload-outline</v-icon>
      <div class="text-subtitle-1 mt-2">Drag images here or click to browse</div>
      <div class="text-caption grey--text">JPG, PNG allowed</div>
    </v-sheet>

    <!-- Uploading Status (Fetch doesn't do % progress, so we show spinners) -->
    <v-list v-if="Object.keys(uploadingFiles).length > 0" dense>
      <v-list-item v-for="(status, fileName) in uploadingFiles" :key="fileName">
        <v-list-item-content>
          <v-list-item-title>{{ fileName }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-progress-circular indeterminate size="20" width="2" color="primary" v-if="status === 'loading'" />
          <v-icon color="error" v-else-if="status === 'error'">mdi-alert-circle</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <!-- Draggable Gallery Grid -->
    <draggable 
      v-model="internalImages" 
      class="row mx-n2" 
      handle=".drag-handle"
      @change="emitUpdate"
    >
      <v-col v-for="(img, index) in internalImages" :key="img.id" cols="12" sm="4" md="3" class="pa-2">
        <v-card outlined>
          <v-img :src="img.url" aspect-ratio="1" class="grey lighten-2">
            <div class="d-flex justify-space-between pa-1 w-100">
              <v-btn icon small class="drag-handle white--text shadow-icon">
                <v-icon>mdi-drag-variant</v-icon>
              </v-btn>
              <v-btn icon small color="error" class="white--text shadow-icon" @click="removeImage(index)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-img>
        </v-card>
      </v-col>
    </draggable>
  </v-card>
</template>

<script>
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
      required: true
    }
  },
  data() {
    return {
      isDragging: false,
      uploadingFiles: {}, // Track files currently being sent
      internalImages: [...this.value]
    };
  },
  watch: {
    value(val) { this.internalImages = [...val]; }
  },
  methods: {
    onDrop(e) {
      this.isDragging = false;
      this.handleUpload(e.dataTransfer.files);
    },
    onFileSelect(e) {
      this.handleUpload(e.target.files);
    },
    async handleUpload(files) {
      for (let file of files) {
        await this.uploadFile(file);
      }
    },
    async uploadFile(file) {
      // Add to tracking list
      this.$set(this.uploadingFiles, file.name, 'loading');

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`/api/articles/${this.articleId}/gallery`, {
          method: 'POST',
          body: formData,
          // Note: Headers are NOT needed for FormData; fetch sets them automatically
        });

        if (!response.ok) throw new Error('Server error');

        const newImageData = await response.json();
        
        // Update local list and clean up tracking
        this.internalImages.push(newImageData);
        this.$delete(this.uploadingFiles, file.name);
        this.emitUpdate();

      } catch (error) {
        console.error("Upload failed:", error);
        this.$set(this.uploadingFiles, file.name, 'error');
        // Remove error message after 3 seconds
        setTimeout(() => this.$delete(this.uploadingFiles, file.name), 3000);
      }
    },
    removeImage(index) {
      this.internalImages.splice(index, 1);
      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit('input', this.internalImages);
    }
  }
};
</script>

<style scoped>
.upload-zone {
  height: 150px;
  border: 2px dashed #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}
.border-active {
  border-color: #2196F3 !important;
}
.drag-handle {
  cursor: grab;
}
.shadow-icon {
  background: rgba(0, 0, 0, 0.3) !important;
}
</style>