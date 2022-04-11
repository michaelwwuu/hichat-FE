import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)


const routes = [
  {
    path: '/Chat',
    name: "Chat",
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat/Chat.vue'),
  },
  {
    path: "*",
    redirect: "/Chat"
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})
export default router
