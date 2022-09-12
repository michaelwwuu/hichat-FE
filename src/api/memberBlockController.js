import { axios } from '../libs/axios/api.request'


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

//查询用户封锁名單
export const blockListMember = (params) => {
  let postData = {
    url: '/api/member/block/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}