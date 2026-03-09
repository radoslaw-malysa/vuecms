<template>
  <div class="image-uploader">
    <v-btn
      fab 
      small 
      color="gray" 
      elevation="0"
      :loading="isUploading"
      :disabled="isUploading"
      @click="triggerSelect"
    >
      <v-icon>add_a_photo</v-icon>
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
  props: {
    serverUrl: {
      type: [String],
      required: true
    }
  },
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
      formData.append('file', file);
      console.log(this.serverUrl)
      try {
        const response = await axios.post(`${this.serverUrl}/cms/image/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // 3. Send the URL back to parent
        // Assuming backend returns: { url: "https://..." }
        this.$emit('uploaded', response.data.image_url);
        
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Nie udało się");
      } finally {
        this.isUploading = false;
        // Reset the file so the change event triggers even if the user picks the same file again
        this.file = null; 
      }
    },
  },
};
</script>