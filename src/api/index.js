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


// 獲取群組清單
export const getGroupList = (params) => {
  let postData = {
    url: '/api/group/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 獲取群組清單
export const groupMemberList = (params) => {
  let postData = {
    url: '/api/group/groupMemberList',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 更改音訊開關
export const updateGroupSetting = data => {
  let postData = {
    url: '/api/group/updateGroupSetting',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//新增群組
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
// 添加成員
export const addMember = data => {
  let postData = {
    url: '/api/group/addMember',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 查詢封鎖名單


// 設定管理這权限
export const setAdminAuthority = data => {
  let postData = {
    url: '/api/group/setAdminAuthority',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 新增管理員
export const addManager = data => {
  let postData = {
    url: '/api/group/addManager',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 設定管理員权限
export const setManagerAuthority = data => {
  let postData = {
    url: '/api/group/setManagerAuthority',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 刪除管理員
export const delManager = data => {
  let postData = {
    url: '/api/group/delManager',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 新增群組禁用字詞
export const addGroupDisabledWord = data => {
  let postData = {
    url: '/api/group/addGroupDisabledWord',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 刪除禁用詞
export const delGroupDisabledWord = data => {
  let postData = {
    url: '/api/group/delGroupDisabledWord',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 取得群組权限
export const getGroupDisabledWord = (params) => {
  let postData = {
    url: '/api/group/getGroupDisabledWord',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 設定禁言
export const setBanPost = data => {
  let postData = {
    url: '/api/group/setBanPost',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 設定個人禁言
export const setBanPostByPersonal = data => {
  let postData = {
    url: '/api/group/setBanPostByPersonal',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 取得群組权限設定
export const getGroupAuthoritySetting = (params) => {
  let postData = {
    url: '/api/group/getGroupAuthoritySetting',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 設定群組权限(設定)
export const setGroupAuthority = data => {
  let postData = {
    url: '/api/group/setGroupAuthority',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 取得群組管理者权限設定
export const getManagerAuthority = (params) => {
  let postData = {
    url: '/api/group/getManagerAuthority',
    method: 'get',
    params
  }
  return axios.request(postData)
}



