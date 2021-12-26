import { axios } from '../libs/axios/api.request'

//登录
export const login = data => {
  let postData = {
    url: '/api/sso/login',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//註冊
export const register = data => {
  let postData = {
    url: '/api/sso/register',
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

// 產生驗證碼
export const genAuthCode = (params) => {
  let postData = {
    url: '/api/sso/genAuthCode',
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
// 獲取群組清單
export const getGroupList = (params) => {
  let postData = {
    url: '/api/group/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 添加好友
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

// 修改好友暱稱
export const updateContactNickName = (data,contactId) => {
  let postData = {
    url: `/api/member/contact/update/${contactId}`,
    method: 'put',
    data
  }
  return axios.request(postData)
}

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
    url: 'file/upload/uploadMessageImage',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 上傳檔案
export const uploadMessageFile = data => {
  let postData = {
    url: 'file/upload/uploadMessageFile',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 忘記密碼
export const forgetPassword = data => {
  let postData = {
    url: '/api/sso/forgetPassword',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 解鎖密碼
export const unlockUser = data => {
  let postData = {
    url: '/api/sso/unlockUser',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 修改密碼
export const updatePassword = data => {
  let postData = {
    url: '/api/sso/updatePassword',
    method: 'post',
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

// 修改密碼
export const addGroup = data => {
  let postData = {
    url: '/api/group/add',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 修改群組
export const updateGroup = data => {
  let postData = {
    url: '/api/group/update',
    method: 'put',
    data
  }
  return axios.request(postData)
}
// 封鎖聯絡人
export const addBlockUser = data => {
  let postData = {
    url: '/api/member/block/add',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 解除封鎖聯絡人
export const unBlockUser = data => {
  let postData = {
    url: '/api/member/block/delete',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 刪除聯絡人
export const deleteUser = data => {
  let postData = {
    url: `/api/member/contact/delete/${data}`,
    method: 'delete',
    data
  }
  
  return axios.request(postData)
}

// 移除成員
export const removeMember = data => {
  let postData = {
    url: '/api/group/removeMember',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 獲取會員訊息
export const groupListMember = (params) => {
  let postData = {
    url: '/api/group/listMember',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 更換管理者
export const changeAdmin = data => {
  let postData = {
    url: '/api/group/changeAdmin',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 更換管理者
export const leaveGroup = data => {
  let postData = {
    url: '/api/group/leaveGroup',
    method: 'post',
    data
  }
  return axios.request(postData)
}