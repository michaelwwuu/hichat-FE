import { axios } from '../libs/axios/api.request'

// 取得用戶最後動作時間
export const getMemberActivity = data => {
  let postData = {
    url: '/api/member/profile/getMemberActivity',
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
export const getSearchById = (params) => {
  let postData = {
    url: '/api/member/profile/searchById',
    method: 'get',
    params
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

