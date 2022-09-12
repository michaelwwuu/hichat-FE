import { axios } from '../libs/axios/api.request'

// 添加联络人
export const addContactUser = data => {
  let postData = {
    url: '/api/member/contact/add',
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

// 獲取會員訊息
export const getContactList = (params) => {
  let postData = {
    url: '/api/member/contact/list',
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

// 修改联络人暱稱
export const updateContactNickName = (data,contactId) => {
  let postData = {
    url: `/api/member/contact/update/${contactId}`,
    method: 'put',
    data
  }
  return axios.request(postData)
}
