import Vue from 'vue'
import Vuex from 'vuex'
import ws from "./ws";
import createVuexAlong from 'vuex-along'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: { ws },
  plugins: [createVuexAlong()]
})
