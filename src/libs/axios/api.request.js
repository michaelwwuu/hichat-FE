import HttpRequest from '../axios/axios.js'

var baseUrl = process.env.NODE_ENV === 'test'? '/api':'/api3rd';

export const axios = new HttpRequest(baseUrl)
