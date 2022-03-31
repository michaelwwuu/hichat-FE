export const state = {
  wsRes: {},
  badgeNum:0,
  chatUser:{},
  groupUser:{},
  myUserInfo:{},
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
  },
  msgInfoPage:{
    pageShow:true,
    type:"",
  },
  replyMsg:{
    name:"",
    icon:"",
    chatType:"",
    clickType:"",
    innerText:"",
    replyHistoryId:"",
  },
  editMsg:{
    innerText:"",
  },
  device: localStorage.getItem("device"),
};
export const actions = {};

export const mutations = {
  setEditMsg(state, payload) {
    state.editMsg = payload;
  },
  setWsRes(state, payload) {
    state.wsRes = payload;
  },
  setBadgeNum(state, num){
    state.badgeNum = num
  },
  setMsgInfoPage(state, payload){
    state.msgInfoPage = payload;
  },
  setHichatNav(state, payload) {
    state.hichatNav = payload;
  },  
  setGroupList(state, payload) {
    state.groupList = payload;
  },
  setInfoMsg(state, payload) {
    state.infoMsg = payload;
  },
  setReplyMsg(state, payload) {
    state.replyMsg = payload;
  },
  //個人資料
  setMyUserInfo(state, payload){
    state.myUserInfo = payload;
    localStorage.setItem("myUserInfo", JSON.stringify(payload));
  },
  //對話中對象
  setChatUser(state, payload) {
    state.chatUser = payload;
    if(payload.type !== "address"){
      localStorage.setItem("userData", JSON.stringify(payload));
    }
  },
  //對話中群組
  setChatGroup(state, payload) {
    state.groupUser = payload;
    if(payload.type !== "address"){
      localStorage.setItem("groupData", JSON.stringify(payload));
    }
  },
  //對話中陌生人
  setContactUser(state, payload) {
    state.contactUser = payload;
    if(payload.type !== "address"){
      localStorage.setItem("contactUser", JSON.stringify(payload));
    }
  },
  //聯絡人 List
  setMyContactDataList(state, payload) {
    state.myContactDataList = payload;
    localStorage.setItem("myContactDataList", JSON.stringify(payload));
  },
  //群組 List
  setContactListData(state, payload) {
    state.contactListData = payload;
    localStorage.setItem("groupListMember", JSON.stringify(payload));
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