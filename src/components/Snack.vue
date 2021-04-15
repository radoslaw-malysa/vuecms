<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    :color="snackbar.color"
  >
    {{ snackbar.text }}

    <template v-slot:action="{ attrs }">
      <v-btn
        color="red"
        icon
        v-bind="attrs"
        @click="close"
      >
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </template>
    
    <!--<v-btn
      color="red"
      text
      @click="closeSnackbar"
    >
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>-->
  </v-snackbar>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  computed: {
    snackbar() {
      return this.$store.state.snack.snackbar;
    }
  },
  methods: {
    ...mapMutations('snack', ["close"])
  }
};
</script>
