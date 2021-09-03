import { axios } from '../libs/axios/api.request'

//登录
export const login = data => {
  let postData = {
    url: '/sso/login',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//註冊
export const register = data => {
  let postData = {
    url: '/sso/register',
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

// 首页列表
export const getBaiduList = (params) => {
  let postData = {
    url: '/baidu/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}


