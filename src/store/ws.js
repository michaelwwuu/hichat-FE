export const state = {
  wsRes: {},
  chatUser:{},
  groupUser:{},
  groupList:[],
  contactListData:[],
  infoMsg:{
    infoMsgShow:false,
    infoMsgNav:"ContactPage",
    infoMsgChat:false,
  },
  hichatNav:{
    type:"address",
    num:1,
  },
};
export const actions = {};

export const mutations = {
  setWsRes(state, payload) {
    state.wsRes = payload;
  },
  setChatUser(state, payload) {
    localStorage.setItem("userData", JSON.stringify(payload));
    state.chatUser = payload;
  },
  setChatGroup(state, payload) {
    state.groupUser = payload;
    localStorage.setItem("groupData", JSON.stringify(payload));
  },
  setHichatNav(state, payload) {
    state.hichatNav = payload;
  },  
  setGroupList(state, payload) {
    state.groupList = payload;
  },
  setContactListData(state, payload) {
    state.contactListData = payload;
    localStorage.setItem("groupListMember", JSON.stringify(payload));
  },
  setInfoMsg(state, payload) {
    state.infoMsg = payload;
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