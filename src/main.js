import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'


//socket io 引入
import VueSocketIo from 'vue-socket.io'
import ClientSocketIO from 'socket.io-client'

const wesocket = {
  debug: true,
  connection: 'ws://10.99.114.10:8299/im/echo',
  forceNew: true,
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  },
  options: { 
    path: "",
    // transports: ["websocket"]
  }, //Optional options
  extraHeaders: {"Access-Control-Allow-Origin": '*'}, 
}
Vue.use(new VueSocketIo(wesocket))


// 樣式重置
import "reset-css";

//fontawesome icon 引入
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);

//導入全局樣式
import './styles.scss'
// 引入根组件mixins
import mixins from './mixins/root.js'
Vue.use(ElementUI);

Vue.prototype.$moment = moment;
Vue.config.productionTip = false

new Vue({
  mixins: [mixins],
  router,
  store,
  sockets:{
    disconnect(){
      console.log('Socket 斷開')
    },
    connect_failed(){
      console.log('連接失敗')
    },
    connect(){
      console.log('socket connected')
    },
  },
  render: h => h(App)
}).$mount('#app')
