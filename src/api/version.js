import { axios } from '../libs/axios/api.request'

// 獲取版本
export const getAndroidVersion = (params) => {
  let postData = {
    url: '/api/version/getAndroidVersion',
    method: 'get',
    params
  }
  return axios.request(postData)
}