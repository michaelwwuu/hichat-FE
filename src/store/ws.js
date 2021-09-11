export const state = {
  wsRes: {}
};
export const actions = {};

export const mutations = {
  setWsRes(state, payload) {
    state.wsRes = payload;
    console.log('連線已接通----訊息已收入vuex')
  }
};
export const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
};