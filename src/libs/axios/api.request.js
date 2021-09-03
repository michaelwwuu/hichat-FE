import HttpRequest from '../axios/axios.js'

var baseUrl=process.env.NODE_ENV === 'production'? '/':'/';

export const axios = new HttpRequest(baseUrl)
