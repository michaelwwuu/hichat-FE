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
      if(res.code === 200){
        return Promise.resolve(res)
      }else if (res.code === 10002 || res.code === 10003) {
        Message({ message: res.code === 10002 ? "密码有误":"验证码有误", type: "error",});
        return Promise.resolve(res)
      } else{
        if(res.code === 10004) this.message ="该用户名或邮箱已存在"
        if(res.code === 10005) this.message ="邮箱已存在" 
        if(res.code === 10006) this.message ="邮箱不存在"
        if(res.code === 10007) this.message ="验证码已发送过,请一分钟后再发送"
        if(res.code === 10013) this.message ="验证码已失效";
        if(res.code === 20002) this.message ="联络人已新增过";
        Message({ message: this.message, type: "warning",});
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