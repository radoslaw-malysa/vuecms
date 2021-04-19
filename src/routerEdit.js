import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './views/Login.vue'
import Edit from './views/Edit.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Nowy artykuł',
      component: Edit
    },
    {
      path: '/login',
      name: 'Logowanie',
      component: Login
    },
    {
      path: '/:id',
      name: 'Artykuł',
      component: Edit,
      props: true
    },
    
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  //const profile = localStorage.getItem('profile');
  
  if (authRequired && !store.getters['profile/isLogged']) {
    return next('/login');
  }

  next();
})

export default router
