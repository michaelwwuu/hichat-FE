import { axios } from '../libs/axios/api.request'
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
export const listMember = (params) => {
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

// 設定管理這权限
// export const setAdminAuthority = data => {
//   let postData = {
//     url: '/api/group/setAdminAuthority',
//     method: 'post',
//     data
//   }
//   return axios.request(postData)
// }

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