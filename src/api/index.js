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

// 搜尋用戶聊天內容
export const getSearchData = (params) => {
  let postData = {
    url: '/member/profile/search',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 搜尋聊天室內
export const getSearchChat = (params) => {
  let postData = {
    url: 'chatroom/searchByName',
    method: 'get',
    params
  }
  return axios.request(postData)
}
