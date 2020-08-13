import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './index'

Vue.use(VueCookies)
const app = new Vue(App)
app.$mount()
