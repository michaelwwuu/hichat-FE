import Vue from 'vue'
import Vuex from 'vuex'
import { getLocal } from '_util/utils.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:getLocal("token"),
    rememberRecord:getLocal('rememberRecord'),
    engine:getLocal("engine")
  },
  mutations: {
    getToken(state,payload){
      state.token = payload;
    },
    //記住我
    rememberRecord(state,payload) {
      state.rememberRecord = payload;
    },
    //登出移除token
    deltoken(state){
      state.token = "";
    },
    //紀錄engine
    getEngine(state,payload){
      state.engine = payload;
    }
  },
})
