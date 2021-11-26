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
// 搜尋聊天室
export const getRoomList = (params) => {
  let postData = {
    url: '/chatroom/searchByName',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 獲取驗證碼
// export const getAuthCode = (params) => {
//   let postData = {
//     url: '/sso/getAuthCode',
//     method: 'get',
//     params
//   }
//   return axios.request(postData)
// }

// 產生驗證碼
export const genAuthCode = (params) => {
  let postData = {
    url: '/sso/genAuthCode',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 搜尋用戶
export const searchByEmailUsername = (params) => {
  let postData = {
    url: '/member/profile/searchByEmailUsername',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 獲取會員訊息
export const getContactList = (params) => {
  let postData = {
    url: '/member/contact/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 添加好友
export const addContactUser = data => {
  let postData = {
    url: '/member/contact/add',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 修改暱稱
export const updateNickname = data => {
  let postData = {
    url: '/member/profile/updateNickname/my',
    method: 'put',
    data
  }
  return axios.request(postData)
}

// 上傳頭像
export const uploadIcon = data => {
  let postData = {
    url: '/upload/uploadIcon',
    method: 'post',
    data
  }
  return axios.request(postData)
}
