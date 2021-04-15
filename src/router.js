import Vue from 'vue'
import Router from 'vue-router'
import Contents from './views/Contents.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'contents',
      component: Contents
    },
    
  ]
})
