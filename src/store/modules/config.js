import cms from '../../api/cms'

const state = () => ({
  config: {
    serverUrl: (window.location.hostname == 'localhost') ? 'http://elektrownia.test' : '', //http://elektrownia.test
    categories: [
      { id: 1, title: 'Wiadomości' },
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
    contentsTemplates: [
      { id_category: 1, view: 'wiadomosci/article.php' },
    ],
    langs: [
      { id: 1, title: 'pl' },
      { id: 2, title: 'en' }
    ],
    important_tags: []
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
  getImportantTags: (state) => (id_lang) => {
    return state.config.important_tags[id_lang];
  },
  serverUrl(state) {
    return state.config.serverUrl;
  },
  categoryTemplate: (state) => (id_category) => {
    return (id_category) ? state.config.contentsTemplates.find(el => el.id_category === id_category) : state.config.contentsTemplates.find(el => el.id_category == 1)
  },
}

const mutations = {
  setConfig: (state, data) => {
    if (data.important_tags) {
      state.config.important_tags = data.important_tags
    }
  },
}

const actions = {
  getConfig({commit}) {
    //commit('setLoading', true);
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