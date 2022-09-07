import { axios } from '../libs/axios/api.request'

// 刪除陌生訊息
export const deleteRecentChat = data => {
  let postData = {
    url: '/api/chat/deleteRecentChat',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 刪除多筆訊息
export const deleteRecentChatMul = data => {
  let postData = {
    url: '/api/chat/deleteRecentChatMul',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 置頂訊息
export const pinHistory = data => {
  let postData = {
    url: '/api/chat/pinHistory',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 取消置頂訊息
export const unpinHistory = data => {
  let postData = {
    url: '/api/chat/unpinHistory',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 置頂訊息列表
export const pinList = (params) => {
  let postData = {
    url: '/api/chat/pinList',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 置頂訊息列表
export const getChatHistory = (params) => {
  let postData = {
    url: '/api/chat/getChatHistory',
    method: 'get',
    params
  }
  return axios.request(postData)
}