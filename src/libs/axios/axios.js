import axios from 'axios'
import qs from 'qs'
// import { Toast } from 'mint-ui'
import { getToken} from '../utils/utils.js'
axios.defaults.headers.post['Content-Type'] = "'Content-Type': 'multipart/form-data'";
//axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 48000

// 前端的axios添加withCredentials属性
axios.defaults.withCredentials = true

class HttpRequest {
    constructor(baseUrl = baseURL) {
      this.baseUrl = baseUrl
      // console.log(this.baseUrl)
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
        if(config.method==='post'){
          config.headers.post['Content-Type'] = "'Content-Type': 'multipart/form-data'";
        }
        
        if(getToken){
          //  config.headers.Authorization = 'Bearer '+`${localStorage.token}`//完整版本
           config.headers.Authorization = 'hiApp'+`${localStorage.token}`
        }

        if (config.isForm){
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.data = qs.stringify(config.data)
        }
        
        return config
      }, error => {
        return Promise.reject(error)
      })
      // 响应拦截
      instance.interceptors.response.use(res => {
        res = res.data
        if (res.code == 10021) {
          
        }else{
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