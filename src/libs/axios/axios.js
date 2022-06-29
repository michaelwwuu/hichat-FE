import axios from 'axios'
import { getToken } from '../utils/utils.js'
import { Message } from "element-ui";
import resStatus from '@/constants/resStatus'

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
      } else if ([401,10001,10002,10003,10009,10013,10014,10015,20004,30005,40002].includes(res.code)) {
        let message = resStatus[res.code]
        Message({ message: message, type: "error", });
        return Promise.resolve(res)
      } else {
        let message = resStatus[res.code]
        Message({ message: message, type: "warning", });
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