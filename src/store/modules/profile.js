import profile from '../../api/profile'

const state = () => ({
  user: JSON.parse(localStorage.getItem('user_profile')) || {},
  dark: null,
  loading: false
})

const getters = {
  user(state) {
    return state.user
  },
  profile(state) {
    /*const savedData = localStorage.getItem('user_profile');
    if (!savedData) return {};
    
    return JSON.parse(savedData);*/
    return state.user;
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

    const stringifiedData = JSON.stringify(data);
    localStorage.setItem('user_profile', stringifiedData);
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
    // commit('setUser', profile.restore())
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