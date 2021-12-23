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
    redirect: "/HelloPage"
  },
  {
    path: "/HelloPage",
    name: "HelloPage",
    component: () => import(/* webpackChunkName: "HelloPage" */ '@/views/HelloPage/HelloPage.vue'),
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
        component: () => import("@/views/Home/components/Address.vue"),
        meta: { keepAlive: false },
      },
      {
        path: "/HiChat",
        name: "HiChat",
        component: () => import("@/views/Home/components/HiChat.vue"),
        meta: { keepAlive: false },
      },
      {
        path: "/Setting",
        name: "Setting",
        component: () => import("@/views/Home/components/Setting.vue"),
        meta: { keepAlive: false },
      }
    ]
  },
  {
    path: "/AddUser",
    name: "AddUser",
    component: () => import(/* webpackChunkName: "AddUser" */ '@/views/AddUser/AddUser.vue'),
  },
  {
    path: "/AddGroup",
    name: "AddGroup",
    component: () => import(/* webpackChunkName: "AddGroup" */ '@/views/AddGroup/AddGroup.vue'),
  },
  {
    path: "/ChatMsg",
    name: "ChatMsg",
    component: () => import(/* webpackChunkName: "ChatMsg" */ '@/views/Chat/ChatMsg.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/ContactPage",
    name: "ContactPage",
    component: () => import(/* webpackChunkName: "ContactPage" */ '@/views/ContactPage/ContactPage.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/GroupPage",
    name: "GroupPage",
    component: () => import(/* webpackChunkName: "GroupPage" */ '@/views/GroupPage/GroupPage.vue'),
    meta: { keepAlive: false },
  },  
  {
    path: "/EditContact",
    name: "EditContact",
    component: () => import(/* webpackChunkName: "EditContact" */ '@/views/EditContact/EditContact.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/ResetPassword",
    name: "ResetPassword",
    component: () => import(/* webpackChunkName: "ResetPassword" */ '@/views/ResetPassword/ResetPassword.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/passwordEdit",
    name: "passwordEdit",
    component: () => import(/* webpackChunkName: "passwordMange" */ '@/views/passwordMange/passwordEdit.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/passwordMange",
    name: "passwordMange",
    component: () => import(/* webpackChunkName: "passwordMange" */ '@/views/passwordMange/passwordMange.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/QRcode",
    name: "QRcode",
    component: () => import(/* webpackChunkName: "QRcode" */ '@/views/QRcode/QRcode.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/EditUser",
    name: "EditUser",
    component: () => import(/* webpackChunkName: "EditUser" */ '@/views/EditUser/EditUser.vue'),
    meta: { keepAlive: false },
  },
  {
    path: "/About",
    name: "About",
    component: () => import(/* webpackChunkName: "About" */ '@/views/About/About.vue'),
    meta: { keepAlive: true },
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
        setLocal('id', res.data.id);
      } else {
        next({ path: '/login' });
      }
    }).catch((err) => {
      setTimeout(() => {
        next({ path: '/login' });
      }, 2000);
      alert("请注意:由于您过于频繁跳转页面，因此系统判定为恶意行为，即将导向登录页，谢谢。");
    })

  }
  if (!['Login','Register','ForgetPassword','ResetPassword'].includes(to.name)) {
    if (localStorage.getItem("token") === null) next({ path: '/login' });
  }
  next();
});


export default router
