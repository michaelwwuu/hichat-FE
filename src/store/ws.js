export const state = {
  wsRes: {}
};
export const actions = {};

export const mutations = {
  setWsRes(state, payload) {
    state.wsRes = payload;
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