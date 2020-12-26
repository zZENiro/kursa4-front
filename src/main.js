import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import {
  merge,
  difference
} from 'lodash'
import moment from 'moment'
import axios from 'axios'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/sass/style.scss'

// project global components imports
import LineDiagram from '@/components/diagrams/LineDiagram.vue'
import FilterGroupSelect from '@/components/FilterGroupSelect.vue'

Vue.config.productionTip = false

const axiosInstance = axios.create({
  // baseURL: 'https://dev.wetterheld.com/home',
  // withCredentials: true,
  // timeout: 1000,
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  //   Accept: 'application/x-www-form-urlencoded',
  // },
})

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  store.commit('SET_LOADING', true)
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  store.commit('SET_LOADING', false)
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

moment.locale('ru')

// prototype section
Vue.prototype.$lodash = {
  merge,
  difference
}
Vue.prototype.$axios = axiosInstance
Vue.prototype.$moment = moment

// global components register
Vue.component('LineDiagram', LineDiagram)
Vue.component('FilterGroupSelect', FilterGroupSelect)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
