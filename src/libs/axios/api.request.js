import HttpRequest from '../axios/axios.js'

var baseUrl=process.env.NODE_ENV === 'production'? '/api':'/api';

export const axios = new HttpRequest(baseUrl)
