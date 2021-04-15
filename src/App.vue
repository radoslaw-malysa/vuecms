<template>
  <v-app>
    <v-app-bar
      app
      flat
      outlined
      class="px-12 main-toolbar"
    >
      <div class="d-flex align-center mr-4">
        <v-img
          alt="Blokpres Logo"
          class="shrink mr-2"
          contain
          src="/img/logo.svg"
          transition="scale-transition"
          width="36"
        />
      </div>

      <v-tabs>
        <v-tab>Treści</v-tab>
        <v-tab>Tagi</v-tab>
      </v-tabs>

      <v-spacer></v-spacer>

      <v-btn icon class="mx-1">
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
      <v-btn icon class="mx-1">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon class="mx-1">
        <v-icon>mdi-brightness-4</v-icon>
      </v-btn>
      <v-btn icon class="ml-1">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
