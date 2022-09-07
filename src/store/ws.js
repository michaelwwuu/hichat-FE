export const state = {
  badgeNum:0,
  maybeKnowNum:0,
  wsRes: {},
  chatUser:{},
  groupUserCheck:{},
  groupUser:{},
  myUserInfo:{},
  contactUser:{},
  groupMemberDataList:{},
  groupList:[],
  contactListData:[],
  myContactDataList:[],
  activeName:"address",
  infoMsg:{
    infoMsgShow:false,
    infoMsgChat:false,
    infoMsgNav:"ContactPage",
  },
  hichatNav:{
    type:"address",
    num:1,
  },
  msgInfoPage:{
    pageShow:true,
    type:"",
  },
  maybeKnowList:[],
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
      sendMessage: true,
      sendImage: true,
      sendLink: true,
    },
    groupDisabledWordList: [],
    groupManagerAuthority: [],    
  },
  topMsgShow:true,
  checkBoxBtn:false,
  authority:{},
  goAnchorMessage:{},
  authorityGroupData:{},
  spreadDataList:[],
};
export const actions = {};

export const mutations = {
  setGroupMemberDataList(state, groupMemberDataList) {
    state.groupMemberDataList = groupMemberDataList;
  },    
  setMaybeKnowList(state, maybeKnowList) {
    state.maybeKnowList = maybeKnowList;
  },    
  setGroupUserCheck(state, groupUserCheck) {
    state.groupUserCheck = groupUserCheck;
  },     
  setCheckBoxBtn(state, checkBoxBtn) {
    state.checkBoxBtn = checkBoxBtn;
  },     
  setSpreadDataList(state, spreadDataList) {
    state.spreadDataList = spreadDataList;
  },     
  setAuthority(state, authority) {
    state.authority = authority;
    localStorage.setItem("authority",JSON.stringify(authority))
  },    
  setAuthorityGroupData(state, authorityGroupData) {
    state.authorityGroupData = authorityGroupData;
    localStorage.setItem("groupAuthority",JSON.stringify(authorityGroupData))
  },  
  setGroupPermissionData(state, groupPermissionData) {
    state.groupPermissionData = groupPermissionData;
  },  
  setGoAnchorMessage(state, goAnchorMessage) {
    state.goAnchorMessage = goAnchorMessage;
  },
  setTopMsgShow(state, topMsgShow) {
    state.topMsgShow = topMsgShow;
  },
  setNofiy(state, nofity) {
    state.nofity = nofity;
    localStorage.setItem("nofity", JSON.stringify(nofity));
  },
  setSoundNofiy(state, soundNofiy) {
    state.soundNofiy = soundNofiy;
    localStorage.setItem("soundNofiy", JSON.stringify(soundNofiy));
  },
  setActiveName(state, activeName) {
    state.activeName = activeName;
  },
  setEditMsg(state, editMsg) {
    state.editMsg = editMsg;
  },
  setWsRes(state, wsRes) {
    state.wsRes = wsRes;
  },
  setBadgeNum(state, badgeNum){
    state.badgeNum = badgeNum
  },
  setMaybeKnowNum(state, maybeKnowNum){
    state.maybeKnowNum = maybeKnowNum
  },
  setMsgInfoPage(state, msgInfoPage){
    state.msgInfoPage = msgInfoPage;
  },
  setHichatNav(state, hichatNav) {
    state.hichatNav = hichatNav;
  },  
  setGroupList(state, groupList) {
    state.groupList = groupList;
  },
  setInfoMsg(state, infoMsg) {
    state.infoMsg = infoMsg;
  },
  setReplyMsg(state, replyMsg) {
    state.replyMsg = replyMsg;
  },
  //個人資料
  setMyUserInfo(state, myUserInfo){
    state.myUserInfo = myUserInfo;
    localStorage.setItem("myUserInfo", JSON.stringify(myUserInfo));
  },
  //對話中對象
  setChatUser(state, chatUser) {
    state.chatUser = chatUser;
    if(chatUser.type !== "address"){
      localStorage.setItem("userData", JSON.stringify(chatUser));
    }
  },
  //對話中群組
  setChatGroup(state, groupUser) {
    state.groupUser = groupUser;
    if(groupUser.type !== "address"){
      localStorage.setItem("groupData", JSON.stringify(groupUser));
    }
  },
  //對話中陌生人
  setContactUser(state, contactUser) {
    state.contactUser = contactUser;
    if(contactUser.type !== "address"){
      localStorage.setItem("contactUser", JSON.stringify(contactUser));
    }
  },
  //聯絡人 List
  setMyContactDataList(state, myContactDataList) {
    state.myContactDataList = []
    state.myContactDataList = myContactDataList;
    localStorage.setItem("myContactDataList", JSON.stringify(myContactDataList));
  },
  //群組 List
  setContactListData(state, contactListData) {
    state.contactListData = contactListData;
    localStorage.setItem("groupListMember", JSON.stringify(contactListData));
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