
import Vue from 'vue'
import App from './AppEdit.vue'
import router from './routerEdit'
import store from './store'
import vuetify from './plugins/vuetify';

import './assets/style.css';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


/*
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import './assets/style.css';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

*/