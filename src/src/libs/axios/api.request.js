import HttpRequest from '../axios/axios.js'

var baseUrl = process.env.NODE_ENV === 'test' ? '/' : process.env.NODE_ENV === 'pre' ? '/' : '/';
export const axios = new HttpRequest(baseUrl)
