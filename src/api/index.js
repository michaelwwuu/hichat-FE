import { axios } from '../libs/axios/api.request'

//登录
export const login = data => {
  let postData = {
    url: '/api/sso/cnLogin',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//登出
export const logout = data => {
  let postData = {
    url: '/api/sso/logout',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//註冊
export const register = data => {
  let postData = {
    url: '/api/sso/cnRegister',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 產生驗證碼
export const genAuthCode = (params) => {
  let postData = {
    url: '/api/sso/genCnPhoneAuthCode',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 忘記密碼
export const forgetPassword = data => {
  let postData = {
    url: '/api/sso/cnForgetPassword',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 解鎖密碼
export const unlockUser = data => {
  let postData = {
    url: '/api/sso/cnUnlockUser',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 修改密碼
export const updatePassword = data => {
  let postData = {
    url: '/api/sso/cnUpdatePassword',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 用户信息
export const getUserInfo = (params) => {
  let postData = {
    url: '/api/member/profile/my',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 搜尋用戶
export const searchByEmailUsername = (params) => {
  let postData = {
    url: '/api/member/profile/searchByEmailUsername',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 獲取會員訊息
export const getContactList = (params) => {
  let postData = {
    url: '/api/member/contact/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 取得用戶最後動作時間
export const getMemberActivity = data => {
  let postData = {
    url: '/api/member/profile/getMemberActivity',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 添加联络人
export const addContactUser = data => {
  let postData = {
    url: '/api/member/contact/add',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 修改暱稱
export const updateNickname = data => {
  let postData = {
    url: '/api/member/profile/updateNickname/my',
    method: 'put',
    data
  }
  return axios.request(postData)
}

// 修改联络人暱稱
export const updateContactNickName = (data,contactId) => {
  let postData = {
    url: `/api/member/contact/update/${contactId}`,
    method: 'put',
    data
  }
  return axios.request(postData)
}

// 獲取會員訊息
export const getSearchById = (params) => {
  let postData = {
    url: '/api/member/profile/searchById',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 封鎖联络人
export const addBlockContactUser = data => {
  let postData = {
    url: '/api/member/block/add',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 解除封鎖联络人
export const unBlockContactUser = data => {
  let postData = {
    url: '/api/member/block/delete',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 刪除联络人
export const deleteContactUser = data => {
  let postData = {
    url: `/api/member/contact/delete/${data}`,
    method: 'delete',
    data
  }
  return axios.request(postData)
}

//查询用户封锁名單
export const blockListMember = (params) => {
  let postData = {
    url: '/api/member/block/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}

//可能認識的人
export const maybeKnow = (params) => {
  let postData = {
    url: '/api/member/contact/maybeKnow',
    method: 'get',
    params
  }
  return axios.request(postData)
}






























