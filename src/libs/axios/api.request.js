import HttpRequest from '../axios/axios.js'

var baseUrl=process.env.NODE_ENV === 'production'? '/':'/api';

export const axios = new HttpRequest(baseUrl)
