import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import './assets/style.css';
import './assets/article.css';


Vue.config.productionTip = false

var vm = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


/*responsive filemanager*/
window.responsive_filemanager_callback = (field_id) => { 
  //setTimeout(function() {
  vm.$children[0].$children[0].$children[0].$children[0].image_url = document.getElementById(field_id).value;
  vm.$children[0].$children[0].$children[0].$children[0].dialogMedia = false;
  //}, 2000);
};


/* 
import Vue from 'vue'
import App from './AppEdit.vue'
import router from './routerEdit'
import store from './store'
import vuetify from './plugins/vuetify';

import './assets/style.css';
import './assets/article.css';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
*/