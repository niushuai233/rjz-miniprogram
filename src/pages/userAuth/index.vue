<template>
  <div class="my-wrap">
      <div class='head'>
        <open-data class="user-avatar" type="userAvatarUrl"></open-data>
        <open-data class="user-nick" type="userNickName"></open-data>
      </div>

      <div class="my-info">
        <div class="my-info-item my-info-item-1">
          <button ref="getUserInfoButton" open-type="getUserInfo">授权登陆</button>
        </div>
      </div>
            
      <div class="my-list">
      </div>
  </div>
</template>

<script>
import tabBar from '@/components/tabBar'

export default {
  components: {
    tabBar
  },
  data () {
    return {
      checkAuthInterval: undefined
    }
  },
  methods: {
    checkAuth () {
      var _this = this;
      wx.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权');
          var _url = '/pages/index/main';
          if (_this.checkAuthInterval != undefined && _this.checkAuthInterval != null) {
            clearInterval(_this.checkAuthInterval)
            console.log('clear 定时器');
          }
          wx.switchTab({
            url: _url
          });
        } else {
          console.log('未授权');
        }
      }
    });
    }
  },
  created () {
    this.checkAuth();
    this.checkAuthInterval = setInterval(this.checkAuth, 1500);
    console.log('start 定时器');
  }
}
</script>

<style scoped lang="stylus">
.my-wrap 
  height 100vh
  background #f5f5f5
.head{
  /* border-bottom: 1rpx #F6F6F6 solid; */
  height: 190rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  background: themeColor
  width: 100%;
  // margin-bottom: 10rpx;
}
.user-avatar{
  overflow:hidden;
  display: block;
  margin-left:20rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 1rpx solid #fff;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  margin-right: 50rpx; 
}
.user-nick {
  font-size: 34rpx;
  font-weight: bold;
  color: rgba(51,51,51,1);

}

.my-info 
  background: themeColor
  display flex
  height 150px
  // margin-top 10px
  background themeColor
  font-size 25px
  .my-info-item
    flex 1
    display flex
    flex-direction column
    align-items center
    justify-content center
    font-weight light
    .item-top
      line-height 75px
      font-size 40px
      color #000
.my-list
  background themeColor
  padding 0 30px
  margin-top 0px
  height 100%
  .list-item
    display flex
    height 100px
    border-bottom 1px solid grayColor
    justify-content space-between
    line-height 100px
    font-size 30px
    .list-item-left
      display flex
      .iconfont
        margin-right 10px
        line-height: 100px; 
        color: #f9db61;
        text-align: center; 
        font-size: 40px
      .list-item-right
        .iconfont
          line-height: 100px; 
          text-align: right; 
          font-size: 30px; 
          color: #888
    &:last-child
      border none
</style>
