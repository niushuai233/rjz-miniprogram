<template>
  <div class="addCategory">
     <div class="input-wrap">
       <!-- <span class="input-icon-wrap">
         <i class="iconfont" :class="currentIconClassName" style="text-align: center"></i>
       </span> -->
       <input class="input" type="text" style="font-color: #94d8f6" maxlength="32" placeholder="请输入邮件地址" v-model="email">
       <br/>
     </div>
     <div class="tips">
      <p>每月最后一天将本月账单作为附件发送到邮箱中</p>
     </div>

     <div class="submitBtn bottomBtn" :class="isIphoneX? 'isIphoneX':''" @click="submit">确定</div>
  </div>
</template>

<script>
import { updateUserEmail } from '@/utils/api'

export default {
  components: {
  },
  data () {
    return {
      email: ''
    }
  },
  methods: {
    async submit () {
      if (this.email == '') {
        wx.showToast({
          title: '请输入邮箱地址',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      var userInfo = wx.getStorageSync("user_info");
      let params = {
        id: userInfo.user.id,
        email: this.email,
      }
      console.log(params);
     try {
        let res = await updateUserEmail(params)
        
        if (res.code == 0) {
          wx.showToast({
            title: '更新成功',
            icon: 'none',
            duration: 3000
          })
          // 更新缓存中的邮箱地址
          userInfo.user.email = this.email;
          wx.setStorageSync("user_info", userInfo);
          this.email = '';
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
     } catch (error) {
       wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
     }
      
    }
  },
  mounted(){
    // console.log(this.$mp.query.type)
    // console.log(this.globalData.iconArray)
    this.recordType = this.$mp.query.type || 0
    wx.setNavigationBarTitle({
        title: '更新邮箱地址',
    })
    this.email = wx.getStorageSync("user_info").user.email;
    console.log(wx.getStorageSync("user_info").user);
  },
  created () {
  },
  computed: {
      isIphoneX(){
          return this.$store.getters.isIphoneX
      }
  }
}
</script>

<style lang="stylus" scoped>
inputWrapHeight = 140px
inputInnerHeight = 100px

.tips
  position fixed
  top 0
  left 0
  display flex
  box-sizing border-box
  width 100%
  margin-top 155px
  margin-left 30px
  font-size 30px
  color #808080

.input-wrap 
  position fixed 
  top 0
  left 0
  display flex
  box-sizing border-box
  width 100%
  padding 20px 30px  
  height inputWrapHeight
  border-bottom 1px solid #ededed
  z-index 100
  background #fff
  align-items center
  .input-icon-wrap
    display inline
    height inputInnerHeight
    width inputInnerHeight
    text-align center
    border-radius 50%
    background themeColor
    margin-right 20px
    .iconfont
      line-height inputInnerHeight
  .input
    flex 5
    line-height inputInnerHeight
    height inputInnerHeight


</style>
