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
  activeName:"address",
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
  nofity: [
    {
      name: "通知",
      isNofity: true,
      key: "nofity",
    },
    {
      name: "新訊息",
      isNofity: true,
      key: "newNofity",
    },
    {
      name: "群組邀請",
      isNofity: true,
      key: "groupNofity",
    },
    {
      name: "鈴聲",
      isNofity: true,
      key: "ringNofity",
    },
    {
      name: "震動",
      isNofity: true,
      key: "shockkNofity",
    },
  ],
  soundNofiy:[
    {
      name:"應用內音效",
      isNofity: true,
      key: 'sound',
    },
    // {
    //   name:"私人訊息",
    //   isNofity: true,
    //   key: 'private',
    // },
    // {
    //   name:"群組訊息",
    //   isNofity: true,
    //   key: 'group',
    // },
  ],
  groupPermissionData:{
    addGroup:false,
    groupName:"",
    memberList:[],
    icon: "",
    banPostMemberList: [],
    groupAdminAuthority: {
      checkUserInfo: false,
      pin: false,
      sendMessage: false
    },
    groupDisabledWordList: [],
    groupManagerAuthority: [],    
  },
  goAnchorMessage:{},
  device: localStorage.getItem("device"),
  topMsgShow:true,
  authority:{},
  authorityGroupData:{}
};
export const actions = {};

export const mutations = {
  setAuthority(state, payload) {
    state.authority = payload;
    localStorage.setItem("authority",JSON.stringify(payload))
  },    
  setAuthorityGroupData(state, payload) {
    state.authorityGroupData = payload;
    localStorage.setItem("groupAuthority",JSON.stringify(payload))
  },  
  setGroupPermissionData(state, payload) {
    state.groupPermissionData = payload;
  },  
  setGoAnchorMessage(state, payload) {
    state.goAnchorMessage = payload;
  },
  setTopMsgShow(state, payload) {
    state.topMsgShow = payload;
  },
  setNofiy(state, payload) {
    state.nofity = payload;
    localStorage.setItem("nofity", JSON.stringify(payload));
  },
  setSoundNofiy(state, payload) {
    state.soundNofiy = payload;
    localStorage.setItem("soundNofiy", JSON.stringify(payload));
  },
  setActiveName(state, payload) {
    state.activeName = payload;
  },
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