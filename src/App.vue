<script>
import store from '@/store'
import login from '@/utils/login'
import utils from '@/utils'
export default {
  methods: {
   
  },
  onShow() {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () { // 做了个延时重试一次，作为保底。
          wx.hideTabBar()
        }, 500)
      }
    });
  },
  created () {
    // 调用API从本地缓存中获取数据

    // let logs
    // if (mpvuePlatform === 'my') {
    //   logs = mpvue.getStorageSync({key: 'logs'}).data || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync({
    //     key: 'logs',
    //     data: logs
    //   })
    // } else {
    //   logs = mpvue.getStorageSync('logs') || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync('logs', logs)
    // }
  
    // 请求系统信息
    store.dispatch('getSystemInfo')
    
    
  },
  // log () {
  //   console.log(`log at:${Date.now()}`)
  // }

 
}
</script>

<style lang="stylus">
@import './stylus/index.styl'
@import '../static/font/iconfont.css'
/* .container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
} */
/* this rule will be remove */
/* * {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
} */
</style>
