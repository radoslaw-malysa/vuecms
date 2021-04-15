import profile from '../../api/profile'

const state = () => ({
  user: {},
  dark: null,
  loading: false
})

const getters = {
  user(state) {
    return state.user
  },
  isLogged(state) {
    return (state.user.id) ? true : false
  },
  loading(state) {
    return state.loading
  }
}

const mutations = {
  setUser: (state, data) => {
    state.user = data
  },
  setLoading: (state, data) => {
    state.loading = data
  },
}

const actions = {
  login({commit}, {email, passwd}) {
    commit('setLoading', true);
    return profile.login(email, passwd)
    .then(data => {
      commit('setUser', data);
      commit('setLoading', false);
      return data;
    })
  },
  getSession({commit}) {
    commit('setLoading', true);
    return profile.getSession()
    .then(data => {
      commit('setUser', data);
      commit('setLoading', false);
      return data;
    })
  },
  restore({commit}) {
    commit('setUser', profile.restore())
  },
  logout({commit}) {
    profile.logout();
    commit('setUser', {});
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}