export const state = {
  wsRes: {},
  badgeNum:0,
  chatUser:{},
  groupUser:{},
  contactUser:{},
  groupList:[],
  contactListData:[],
  myContactDataList:[],
  infoMsg:{
    infoMsgShow:false,
    infoMsgNav:"ContactPage",
    infoMsgChat:false,
  },
  hichatNav:{
    type:"address",
    num:1,
    contact:false,
  },
  msgInfoPage:{
    pageShow:true,
    type:"",
  },
};
export const actions = {};

export const mutations = {
  setBadgeNum(state, num){
    state.badgeNum = num
  },
  setMsgInfoPage(state, payload){
    state.msgInfoPage = payload;
  },
  setWsRes(state, payload) {
    state.wsRes = payload;
  },
  setMyContactDataList(state, payload) {
    state.myContactDataList = payload;
    localStorage.setItem("myContactDataList", JSON.stringify(payload));
  },
  setChatUser(state, payload) {
    state.chatUser = payload;
    if(payload.type !== "address"){
      localStorage.setItem("userData", JSON.stringify(payload));
    }
  },
  setChatGroup(state, payload) {
    state.groupUser = payload;
    if(payload.type !== "address"){
      localStorage.setItem("groupData", JSON.stringify(payload));
    }
  },
  setContactUser(state, payload) {
    state.contactUser = payload;
    if(payload.type !== "address"){
      localStorage.setItem("contactUser", JSON.stringify(payload));
    }
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