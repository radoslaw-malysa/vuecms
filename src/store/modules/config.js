import cms from '../../api/cms'

const state = () => ({
  config: {
    categories: [
      { id: 1, title: 'Wiadomości' },
      { id: 2, title: 'Kryptowaluty' },
      { id: 3, title: 'Poradniki' },
      { id: 4, title: 'Ludzie' },
      { id: 5, title: 'Firmy' },
      { id: 6, title: 'Produkty' },
      { id: 7, title: 'O nas' }
    ],
    contentsStates: [
      { id: 1, title: 'Opublikowany' },
      { id: 2, title: 'Roboczy' },
      { id: 3, title: 'Ukryty' },
    ],
    usersGroups: [
      { id: 1, title: 'Administrator' },
      { id: 2, title: 'Redaktor' },
      { id: 3, title: 'Gość' },
    ],
    usersStates: [
      { id: 1, title: 'Aktywny' },
      { id: 2, title: 'Nieaktywny' }
    ],
  }
})

const getters = {
  config(state) {
    return state.config
  },
  categories(state) {
    return state.config.categories.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})
  },
  contentsStates(state) {
    return state.config.contentsStates.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})
  },
  usersGroups(state) {
    return state.config.usersGroups.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})
  },
  usersStates(state) {
    return state.config.usersStates.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})
  },
}

const mutations = {
  setConfig: (state, data) => {
    state.config = data
  },
}

const actions = {
  getConfig({commit}) {
    commit('setLoading', true);
    return cms.getConfig()
    .then(data => {
      commit('setConfig', data);
      return data;
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}