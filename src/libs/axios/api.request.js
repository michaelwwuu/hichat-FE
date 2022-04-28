import HttpRequest from '../axios/axios.js'

// var baseUrl = process.env.NODE_ENV === 'production'? '/':'/api';
var baseUrl = '/api3rd';

export const axios = new HttpRequest(baseUrl)
