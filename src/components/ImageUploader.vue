<template>
  <div class="image-uploader">
    <!-- The actual button user sees -->
    <v-btn
      color="primary"
      :loading="isUploading"
      :disabled="isUploading"
      @click="triggerSelect"
    >
      <v-icon left>mdi-cloud-upload</v-icon>
      Upload Image
    </v-btn>

    <!-- Hidden File Input -->
    <v-file-input
      ref="fileInput"
      v-model="file"
      accept="image/*"
      style="display: none"
      @change="onFilePicked"
    ></v-file-input>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageUploader',
  data() {
    return {
      file: null,
      isUploading: false,
    };
  },
  methods: {
    // 1. When user clicks the button, programmatically click the hidden input
    triggerSelect() {
      // In Vuetify 2, we access the internal input element via $refs
      this.$refs.fileInput.$refs.input.click();
    },

    // 2. This runs automatically after the user selects a file
    async onFilePicked(file) {
      // If user cancels selection, 'file' will be null
      if (!file) return;

      await this.uploadImage(file);
    },

    async uploadImage(file) {
      this.isUploading = true;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // 3. Send the URL back to parent
        // Assuming backend returns: { url: "https://..." }
        this.$emit('uploaded', response.data.url);
        
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
      } finally {
        this.isUploading = false;
        // Reset the file so the change event triggers even if the user picks the same file again
        this.file = null; 
      }
    },
  },
};
</script>