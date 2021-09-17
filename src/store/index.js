import Vue from 'vue'
import Vuex from 'vuex'
import ws from "./ws";
Vue.use(Vuex)

export default new Vuex.Store({
  modules: { ws }
})
