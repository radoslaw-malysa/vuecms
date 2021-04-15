import Vue from 'vue'
import Vuex from 'vuex'
import snack from './modules/snack'
import profile from './modules/profile'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    profile,
    snack
  }
})
