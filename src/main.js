import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'

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

//導入表情
import './../static/js/face.js'
import './../static/css/face.css'

// 引入根组件mixins
import mixins from './mixins/root.js'
Vue.use(ElementUI);

Vue.prototype.$moment = moment;
Vue.config.productionTip = false

new Vue({
  mixins: [mixins],
  router,
  store,
  render: h => h(App)
}).$mount('#app')
