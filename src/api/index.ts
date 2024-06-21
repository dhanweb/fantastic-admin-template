import axios from 'axios'

// import qs from 'qs'
import Message from 'vue-m-message'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { Storage } from '@/utils/storage'

Storage.clear()
const api = axios.create({
  baseURL: (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true') ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
})

api.interceptors.request.use(
  (request) => {
    // 全局拦截请求发送前提交的参数
    const userStore = useUserStore()
    // 设置请求头
    if (request.headers) {
      if (userStore.isLogin) {
        request.headers.Token = userStore.token
      }
    }
    // 是否将 POST 请求参数进行字符串化处理
    if (request.method === 'post') {
      // request.data = qs.stringify(request.data, {
      //   arrayFormat: 'brackets',
      // })
    }
    return request
  },
)

api.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data as BaseResult
    if (code === 200) {
      return Promise.resolve(response.data)
    }
    else {
      if (code === 401) {
        useUserStore().logout()
      }
      ElMessage.error(msg || '服务器内部错误')
      return Promise.reject(response.data)
    }
  },
  (error) => {
    let message = error.message
    if (message === 'Network Error') {
      message = '后端网络故障'
    }
    else if (message.includes('timeout')) {
      message = '接口请求超时'
    }
    else if (message.includes('Request failed with status code')) {
      message = `接口${message.substr(message.length - 3)}异常`
    }
    Message.error(message, {
      zIndex: 2000,
    })
    return Promise.reject(error)
  },
)

export default api
