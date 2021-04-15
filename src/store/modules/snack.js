const state = () => ({
  snackbar: {
    visible: false,
    color: "success",
    text: null,
    timeout: 5000,
    multiline: false,
    ok: false
  }
})

const mutations = {
  open(state, payload) {
    state.snackbar.text = payload.text;
    if (payload.multiline) { state.snackbar.multiline = payload.multiline; } else { state.snackbar.multiline = payload.text.length > 50; }
    if (payload.color) { state.snackbar.color = payload.color; }
    if (payload.timeout) { state.snackbar.timeout = payload.timeout; }
    if (payload.ok) { state.snackbar.ok = payload.ok; }
    state.snackbar.visible = true;
  },
  close(state) {
    state.snackbar.visible = false;
    state.snackbar.multiline = false;
    state.snackbar.text = null;
    state.snackbar.ok = false;
  }
}

export default {
  namespaced: true,
  state,
  mutations
}