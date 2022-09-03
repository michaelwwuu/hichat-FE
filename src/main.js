import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment'
import md5 from 'js-md5';
import 'element-ui/lib/theme-chalk/index.css'

// 样式重置
import "reset-css";

//fontawesome icon 引入
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHatWizard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//超连结
import linkify from 'vue-linkify'
Vue.directive('linkified', linkify)

library.add(faHatWizard);
Vue.component("font-awesome-icon", FontAwesomeIcon);

//导入全局样式
import './styles.scss'

//提示
import VueNativeNotification from 'vue-native-notification'

Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})

// 引入根组件mixins 日期格式 共用事件
import mixins from './mixins/root.js'

Vue.use(ElementUI);

import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);

import VueAudio from 'vue-audio-better'

Vue.use(VueAudio)

//i18n
import i18n from './common/plugins/vue-i18n'

Vue.directive('debounce', {
  inserted(el, binding, vnode) {
    let timer = {}
    el.addEventListener('scroll', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 500)
    })
  }
})

Vue.prototype.$md5 = md5;
moment.suppressDeprecationWarnings = true; // 关闭日期警告
Vue.prototype.$moment = moment;
Vue.config.productionTip = false



new Vue({
  mixins: [mixins],
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
