import axios from 'axios'
import { Spin } from 'iview'
import { Message } from 'iview'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 25000
let loading = false
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    }
    return config
  }
  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      if(loading){
        loading = false
        Spin.hide()
      }
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      console.log('请求配置-----',config)
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        if(config.loading){
          loading = true
          Spin.show() // 不建议开启，因为界面不友好
        }
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.distroy(url)
      const { data, status } = res
      if(data.code !== 100){
        Message.error({
          content:`错误${data.code}`
        })
        return Promise.reject(data)
      }
      return { data, status }
    }, error => {
      this.distroy(url)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    // options = Object.assign(this.getInsideConfig(), options)
    options = {...this.getInsideConfig(),...options}
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
