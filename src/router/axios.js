/**
 *
 * http配置
 *
 */

import axios from 'axios'
import store from '../store'
import router from '../router/router'
import { getToken, setToken, removeToken } from '@/util/auth'
import { Message } from 'element-ui'
import errorCode from '@/const/errorCode'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
// 超时时间
axios.defaults.timeout = 30000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
NProgress.configure({ showSpinner: false })// NProgress Configuration
let msg
// HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  if (store.getters.access_token) {
    config.headers['token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  return Promise.reject(error)
})
// HTTPresponse拦截
axios.interceptors.response.use(data => {
  NProgress.done()
  if(data.status == 200 && data.data.success == false){
    Message({
      message: data.data.message,
      type: 'error'
    })
  }
  return data
}, error => {
  NProgress.done()
  let errMsg = error.toString()
  let code = errMsg.substr(errMsg.indexOf('code') + 5)
  Message({
    message: errorCode[code] || errorCode['default'],
    type: 'error'
  })
  if(code == '401'){
    console.log(code)
    store.commit('SET_MENU', [])
    // 清除权限
    store.commit('SET_PERMISSIONS', [])
    // 清除用户信息
    store.commit('SET_USER_INFO', {})
    store.commit('SET_ACCESS_TOKEN', '')
    store.commit('SET_REFRESH_TOKEN', '')
    store.commit('SET_ROLES', [])
    store.commit('DEL_ALL_TAG')
    router.push({ path: "/login" })
    // store.dispatch("LogOut").then(() => {
    //   location.reload(); // 为了重新实例化vue-router对象 避免bug
    // })
  }

  return Promise.reject(new Error(error))
})

export default axios
