export const state = {
  wsRes: {},
  chatUser:{},
};
export const actions = {};

export const mutations = {
  setWsRes(state, payload) {
    state.wsRes = payload;
  },
  setChatUser(state, payload) {
    console.log(payload)
    state.chatUser = payload;
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