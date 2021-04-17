import Vue from 'vue'
import Vuex from 'vuex'
import profile from './modules/profile'
import config from './modules/config'
import snack from './modules/snack'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    profile,
    config,
    snack
  }
})
