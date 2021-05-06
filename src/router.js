import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Contents from './views/Contents.vue'
import Login from './views/Login.vue'
import Users from './views/Users.vue'
import Tags from './views/Tags.vue'
import Edit from './views/Edit.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Treści',
      component: Contents,
    },
    {
      path: '/login',
      name: 'Logowanie',
      component: Login
    },
    {
      path: '/users',
      name: 'Użytkownicy',
      component: Users
    },
    {
      path: '/tags',
      name: 'Tagi',
      component: Tags
    },
    {
      path: '/contents/:id',
      name: 'Artykuł',
      component: Edit,
      props: true
    },
  ]
})

/*
router.beforeEach((to, from, next) => {
  const publicPages = ['/login','/'];
  const authRequired = !publicPages.includes(to.path);
  //const profile = localStorage.getItem('profile');
  
  if (authRequired && !store.getters['profile/isLogged']) {
    return next('/login');
  }

  next();
})
*/
export default router
