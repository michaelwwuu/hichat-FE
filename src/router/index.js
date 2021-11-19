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
    path: "/Register",
    name: "Register",
    component: () => import(/* webpackChunkName: "register" */ '@/views/Register/Register.vue'),
  },
  {
    path: "/ForgetPassword",
    name: "ForgetPassword",
    component: () => import(/* webpackChunkName: "ForgetPassword" */ '@/views/ForgetPassword/ForgetPassword.vue'),
  },
  {
    path: "/Home",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/Home.vue'),
    redirect: '/Address',//页面默认加载的路由
    children: [
      {
        path: "/Address",
        name: "Address",
        component: () => import("@/views/Home/components/Address.vue")
      },
      {
        path: "/HiChat",
        name: "HiChat",
        component: () => import("@/views/Home/components/HiChat.vue")
      },
      {
        path: "/Setting",
        name: "Setting",
        component: () => import("@/views/Home/components/Setting.vue")
      }
    ]
  },
  {
    path: "/AddUser",
    name: "AddUser",
    component: () => import(/* webpackChunkName: "AddUser" */ '@/views/AddUser/AddUser.vue'),
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
    path: "/ContactPage",
    name: "ContactPage",
    component: () => import(/* webpackChunkName: "ContactPage" */ '@/views/ContactPage/ContactPage.vue'),
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
  if (to.name === "Address") {
    getUserInfo().then((res) => {
      if (res.code === 200) {
        setLocal('username', res.data.username);
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
