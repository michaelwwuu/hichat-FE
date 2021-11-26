import HttpRequest from '../axios/axios.js'

var baseUrl = process.env.NODE_ENV === 'production'? '/':'/';
// var baseUrl = '/api';

export const axios = new HttpRequest(baseUrl)
