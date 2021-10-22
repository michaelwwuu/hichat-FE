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

//导航守卫
router.beforeEach((to, from, next) => {
  //判断token是否失效
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
      alert("请注意：由于您过于频繁跳转页面，因此系统判定为恶意行为，即将导向登入页，谢谢。");
    })
  }
  next();
});


export default router
