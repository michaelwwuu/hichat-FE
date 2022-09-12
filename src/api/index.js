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
































