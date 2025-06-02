<template>
  <v-app>
    <v-app-bar
      app
      absolute
      flat
      outlined
      class="px-12 main-toolbar nobg-dark"
      v-if="showMainBar"
    >
      <router-link to="/" class="d-flex align-center mr-6">
        <v-img
          alt="Blokpres Logo"
          class="shrink mr-2"
          contain
          src="/img/logo.svg"
          transition="scale-transition"
          width="36"
        />
      </router-link>

      <v-tabs
        :hide-slider="hideSlider"
      >
        <v-tab to="/">Treści</v-tab>
        <v-tab to="/tags" value="/tags">Tagi</v-tab>
        <v-tab to="/pages" value="/pages">Strony</v-tab>
        <v-tab to="/settings" value="/settings">Ustawienia</v-tab>
      </v-tabs>

      <v-spacer></v-spacer>
      <v-btn to="/users" icon class="ml-5 mr-1" :color="($route.path == '/users') ? 'primary' : ''" title="Użytkownicy">
        <v-icon>people_alt</v-icon>
      </v-btn>
      <v-btn icon class="mx-1" :color="($route.path == '/settigs') ? 'primary' : ''" title="Ustawienia">
        <v-icon>settings</v-icon>
      </v-btn>
      <v-btn @click="darkMode = !darkMode" icon class="mx-1" title="Ciemny motyw">
        <v-icon v-text="(darkMode) ? 'light_mode' : 'brightness_4'"></v-icon>
      </v-btn>
      <v-menu
        bottom
        left
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            class="ml-1"
            title="Twój profil"
            color="orange"
          >
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="logoutUser">
            <v-list-item-title>Wyloguj się</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main v-bind:class="{ esyfloresy: currentRoute == 'Logowanie' }">
      <transition name="fade" mode="out-in">
      <router-view ref="ruter" />
      </transition>
      <snack />
    </v-main>
  </v-app>
</template>

<script>
import Snack from './components/Snack';
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    Snack,
  },
  data: () => ({
    darkMode: false,
  }),
  computed: {
    ...mapGetters('profile', ['isLogged','user']),
    hideSlider() {
      return (this.$route.path == '/' || this.$route.path == '/tags' || this.$route.path == '/settings') ? false : true
    },
    currentRoute() {
      return this.$route.name
    },
    showMainBar() {
      return (this.currentRoute != 'Logowanie' && this.currentRoute != 'Artykuł') ? true : false;
    }
  },
  watch: {
		darkMode: function() {
			localStorage.setItem("dark", JSON.stringify(this.darkMode));
      this.$vuetify.theme.dark = this.darkMode;
    }
  },
  mounted() {
    const mode = localStorage.getItem("dark");
    if (mode == "true") {
      this.$vuetify.theme.dark = true;
      this.darkMode = true;
    } else {
      this.$vuetify.theme.dark = false;
      this.darkMode = false;
    }
  },
  methods: {
    ...mapActions('profile', ['logout']),
    logoutUser() {
      this.logout();
      this.$router.push({ path: '/login' })
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
