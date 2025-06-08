<template>
  <v-card
    class="mx-auto shadow-sm bg-neutral-50 rounded-lg"
    rounded
    outlined
  >
    <v-card-title class="pb-0">
      <v-textarea
        name="subtitle"
        v-model="aiSubject"
        label="O czym chcesz napisać?"
        hint="Np.: Ile kroków dziennie robić, żeby schudnąć?"
        auto-grow
        rows="1"
        row-height="20"
        @focus="aiShow=true"
        @blur="aiSubjectBlur"
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
            v-model="aiWordsLimit"
            name="aiWordsLimit"
            suffix="słów"
          ></v-text-field>
        </div>
        <v-chip
          outlinedx
          v-model="aiImage"
          medium
          class="chip-mid"
          color="#E8EAF6"
        >
          <v-icon left color="primary">
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
          dark
          small
          color="primary"
        >
          <v-icon>arrow_upward</v-icon>
        </v-btn>
      </v-card-actions>
    </v-expand-transition>
  </v-card>
</template>
<script>

export default {
  name: 'CreateArticle',
  props: ['id'],
  data: () => ({
    aiShow: false,
    aiSubject: '',
    aiWordsLimit: 500,
    aiImage: false
  }),
  computed: {
    
  },
  methods: {
    
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
