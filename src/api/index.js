import { axios } from '../libs/axios/api.request'

//登录
export const login = data => {
  let postData = {
    url: '/sso/platformLogin',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 用户信息
export const getUserInfo = (params) => {
  let postData = {
    url: '/member/profile/my',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 封禁人員
export const banMember = data => {
  let postData = {
    url: '/chatroom/banMember',
    method: 'post',
    data
  }
  return axios.request(postData)
}
