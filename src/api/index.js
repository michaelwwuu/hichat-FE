import { axios } from '../libs/axios/api.request'

//登录
export const login = data => {
  let postData = {
    url: '/sso/platformLogin',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 用户信息
export const userinfo = (params) => {
  let postData = {
    url: `/manycai/getUserInfo?id=${params}`,
    method: 'get',
  }
  return axios.request(postData)
}
// // 搜尋聊天室
// export const getRoomList = (params) => {
//   let postData = {
//     url: '/chatroom/searchByName',
//     method: 'get',
//     params
//   }
//   return axios.request(postData)
// }
