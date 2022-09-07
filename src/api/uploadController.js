import { axios } from '../libs/axios/api.request'

// 上傳頭像
export const uploadIcon = data => {
  let postData = {
    url: '/file/upload/uploadIcon',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 上傳群組頭像
export const uploadGroupIcon = data => {
  let postData = {
    url: '/file/upload/uploadGroupIcon',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 上傳圖片
export const uploadMessageImage = data => {
  let postData = {
    url: '/file/upload/uploadMessageImage',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 上傳檔案
export const uploadMessageFile = data => {
  let postData = {
    url: '/file/upload/uploadMessageFile',
    method: 'post',
    data
  }
  return axios.request(postData)
}
