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

console.log(vm.$refs.ruter);
console.log(vm.$children[0].$children[0].$children[0].$children[0].imageInput);
setTimeout(function() {
vm.$children[0].$children[0].$children[0].$children[0].imageInput = 'bbb';
}, 2000);
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