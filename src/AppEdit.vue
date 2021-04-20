<template>
  <v-app>
    <!--<v-navigation-drawer 
      v-if="isLogged"
      app
      fixed
      permanent
      right
      width="360px"
    >
      xxxd
    </v-navigation-drawer>-->

    <v-main v-bind:class="{ esyfloresy: !isLogged }">
      <transition name="fade" mode="out-in">
      <router-view/>
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
      return (this.$route.path == '/' || this.$route.path == '/tags') ? false : true
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
