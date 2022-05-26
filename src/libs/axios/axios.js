import axios from 'axios'
import { getToken } from '../utils/utils.js'
import { Message } from "element-ui";
axios.defaults.headers.post['Content-Type'] = "'Content-Type': 'multipart/form-data'";
//axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 48000

// 前端axios添加withCredentials属性
axios.defaults.withCredentials = true
class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl
    }
    return config
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: new Date().getTime()
        }
      }
      if (config.method === 'post') {
        config.headers.post['Content-Type'] = "'Content-Type': 'multipart/form-data'";
      }
      if (config.method === 'put') {
        config.headers['Content-Type'] = 'application/json';
      }
      if (getToken) {
        config.headers.Authorization = `${localStorage.token}`
      }
      // if (config.isForm) {
      //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      //   config.data = qs.stringify(config.data)
      // }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      res = res.data
      if (res.code === 200) {
        return Promise.resolve(res)
      } else if ([10001,10002,10003,10009,10013,10014,10015,20004,30005,40002].includes(res.code)) {
        // 1-帐号相关
        if (res.code === 10001) this.message = "密码格式有误"
        if (res.code === 10002) this.message = "密码有误"
        if (res.code === 10003) this.message = "验证码有误"
        if (res.code === 10009) this.message = "用户已被禁用"
        if (res.code === 10013) this.message = "验证码已失效";
        if (res.code === 10014) this.message = "用户未被禁用";
        if (res.code === 10015) this.message = "邮件发送失败"
        // 2-联络人相關
        if (res.code === 20004) this.message = "该用户已被封锁";
        // 3-群組, 聊天室相關
        if (res.code === 30005) this.message = "用户已被封禁";
        // 4-檔案相關
        if (res.code === 40002) this.message = "文件上传失败";
        Message({ message: this.message, type: "error", });
        return Promise.resolve(res)
      } else {
        // 1-帐号相关
        if (res.code === 10004) this.message = "该用户名或邮箱已存在"
        if (res.code === 10005) this.message = "邮箱已存在"
        if (res.code === 10006) this.message = "邮箱不存在"
        if (res.code === 10007) this.message = "验证码已发送过,请一分钟后再发送"
        if (res.code === 10008) this.message = "登录已失效,请重新登录"
        if (res.code === 10010) this.message = "平台不存在"
        if (res.code === 10011) this.message = "平台不存在"
        if (res.code === 10012) this.message = "用户不存在"
        // 2-联络人相關
        if (res.code === 20001) this.message = "无法增加自己到联络人";
        if (res.code === 20002) this.message = "联络人已新增过";
        if (res.code === 20003) this.message = "无法封锁自己";
        // 3-群組, 聊天室相關
        if (res.code === 30001) this.message = "群组名不可为空";
        if (res.code === 30002) this.message = "非管理者没有权限";
        if (res.code === 30003) this.message = "无此聊天室";
        if (res.code === 30004) this.message = "用户不在该聊天室";
        if (res.code === 30006) this.message = "无此成员";
        // 4-檔案相關
        if (res.code === 40001) this.message = "文件格式有误";
        // 5-IM相關
        if (res.code === 50001) this.message = "重复讯息";
        if (res.code === 50002) this.message = "需先授权";
        if (res.code === 50003) this.message = "你已在别处建立连接，此会话关闭";
        if (res.code === 50004) this.message = "访客没有权限执行";
        if (res.code === 50005) this.message = "消息格式错误,请检查再传递";
        if (res.code === 50006) this.message = "无此历史记录";
        if (res.code === 50008) this.message = "置顶已达上限";
        Message({ message: this.message, type: "warning", });
        return Promise.resolve(res)
      }
    }, error => {
      return Promise.reject(error)
    })
  }
  request(options, noShowTip) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    instance.noShowTip = noShowTip
    return instance(options)
  }
}
export default HttpRequest;