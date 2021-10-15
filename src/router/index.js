import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'
import { setLocal } from '_util/utils.js'
import { getUserInfo } from "@/api"
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/Login.vue'),
  },
  {
    path: "/Room",
    name: "Room",
    component: () => import(/* webpackChunkName: "Room" */ '@/views/Room/Room.vue'),
  },
  {
    path: "/Chat",
    name: "Chat",
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat/Chat.vue'),
  },
  {
    path: "*",
    redirect: "/login"
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

//導航守衛
router.beforeEach((to, from, next) => {
  //判斷token是否失效
  if (to.name === "Room") {
    getUserInfo().then((res) => {
      if (res.code === 200) {
        setLocal('username', res.data.username);
        setLocal('isGuest', res.data.isGuest);
      } else {
        next({ path: '/login' });
      }
    }).catch((err) => {
      setTimeout(() => {
        next({ path: '/login' });
      }, 2000);
      alert("請注意：由於您過於頻繁跳轉頁面，因此系統判定為惡意行為，即將導向登入頁，謝謝。");
    })
  }
  next();
});


export default router
