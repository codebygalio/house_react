import axios from 'axios'
import { BASE_URL } from './url'
import { getToken, removeToken } from './auth'
const Request = axios.create({
    baseURL: BASE_URL
})
Request.interceptors.request.use(config => {
    const {url} = config
    const limitUrl = '/user'
    const limitWhite = ['/login','/registered']
    if(url.startsWith(limitUrl) && !limitWhite.includes(url)){
        config.headers['Authorization'] = getToken()
    }
    return config
})
Request.interceptors.response.use(res => {
    if (res.data.status === 400) {
        removeToken()
    }
    // console.log('res=',res.data.status)
    return res
})

export { Request }