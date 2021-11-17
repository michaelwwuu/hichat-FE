import HttpRequest from '../axios/axios.js'

// var baseUrl = process.env.NODE_ENV === 'production'? '/':'/';
var baseUrl = '/';

export const axios = new HttpRequest(baseUrl)
