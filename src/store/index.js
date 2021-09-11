import Vue from 'vue'
import Vuex from 'vuex'
import { getLocal } from '_util/utils.js'
import ws from "./ws";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:getLocal("token"),

  },
  mutations: {
    getToken(state,payload){
      state.token = payload;
    },
  },
  modules: { ws }
})
