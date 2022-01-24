export const state = {
  wsRes: {},
  chatUser:{},
  hichatNav:'address',
};
export const actions = {};

export const mutations = {
  setWsRes(state, payload) {
    state.wsRes = payload;
  },
  setChatUser(state, payload) {
    state.chatUser = payload;
  },
  setHichatNav(state, payload) {
    state.hichatNav = payload;
  },
};
export const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
};