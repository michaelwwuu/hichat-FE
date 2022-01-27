export const state = {
  wsRes: {},
  chatUser:{},
  groupUser:{},
  groupList:[],
  hichatNav:'address',
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
    state.groupUser.groupName = payload.name
    state.groupUser.groupId = payload.toChatId.replace("g", "");
    state.groupUser.memberId = JSON.parse(payload.forChatId.replace("u", ""));
    state.groupList.forEach((item)=>{ 
      if(item.groupName === state.groupUser.groupName){
        return state.groupUser.isAdmin = item.isAdmin
      }
    });
    localStorage.setItem("groupData", JSON.stringify(payload));
  },
  setHichatNav(state, payload) {
    state.hichatNav = payload;
  },  
  setGroupList(state, payload) {
    state.groupList = payload;
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