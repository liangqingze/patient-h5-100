import router from '@/router'
import { useUserStore } from '@/stores'
import type { User } from '@/types/user'
import axios, { type Method } from 'axios'
import { showToast } from 'vant';

const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
    baseURL,
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const store = useUserStore()
        if (store.user?.token && config.headers) {
            config.headers.Authorization = `Bearer ${store.user.token}`
        }
        return config
    },
    (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        if (res.data.code !== 10000) {
            showToast(res.data.message || '网络错误')
            return Promise.reject(res.data)
        }
        return res.data
    },
    (err) => {
        if (err.response.status === 401) {
            const store = useUserStore()
            store.delUser()
            router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
        }
        return Promise.reject(err)
    }
)

const request = (url: string, method: Method = 'get', submitData?: object) => {
    return instance.request<User, {
        code: string
        message: string
        data: User
    }>({
        url,
        method,
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    })
}
export { baseURL, instance, request }