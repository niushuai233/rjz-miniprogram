<template>
  <div @touchstart="fatherClick">
    <div class="header">
      <div class="header-bar">
        <div class="bar-item bar-item-1">
          <div class="top">{{sYear}}年</div>
          <div class="bottom">
            <time-picker :date="selectDate" @update:date="updateDate" mode="head"></time-picker>
            <div class="month">
              {{sMonth}}
              <span>月</span>
              <i
                class="iconfont icon-icon11"
                style="margin-left: 10px;display: inline; text-align: center; font-size: 40rpx"
              ></i>
            </div>
          </div>
        </div>
        <div class="bar-item bar-item-2">
          <div class="bar-item-income">
            <div class="top">
              总收入
              <span v-if="requestMode == 1">(月)</span>
            </div>
            <div class="bottom">
              <div class="acount" style="color: green">￥{{totalIncomeAmount}}</div>
            </div>
          </div>
          <div class="bar-item-pay">
            <div class="top">
              总支出
              <span v-if="requestMode == 1">(月)</span>
            </div>
            <div class="bottom">
              <div class="acount">
                <span v-if="totalPayAmount > 0">-</span>
                <span style="color: red">￥{{totalPayAmount}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <scroll-view :scroll-y="listTouchInfo.scrollY" class="scroll-view">
      <div v-if="!!(this.billNoteList && this.billNoteList.length > 0)" class="isListEmpty">
        <img mode="aspect-fill" src="/static/images/empty_list.png" alt />
        <p>空空如也</p>
      </div>
      <div class="bookingList-wrap" :class="isIphoneX? 'isIphoneX':''">
        <div class="item-block" v-for="(item, index) in billNoteList" :key="item.id">
          <div class="item-head">
            <div class="item-date">{{item.time}}</div>
            <div class="item-info">{{ '收入 ￥'+ item.incomeAmount + ' | 支出 ￥'+ item.payAmount}}</div>
          </div>
          <div
            class="item-list addAmination"
            @touchstart="listTouchStart"
            @touchmove="listTouchMove"
            @touchend="listTouchEnd"
            v-for="(cItem, cIndex) in item.subBillNoteList"
            :key="cItem.id"
            :data-index="index+'-'+cIndex"
          >
            <div class="detail-info">
              <div class="detail-icon">
                <i
                  class="iconfont"
                  :class="cItem.icon"
                  style="line-height: 80rpx; text-align: center; font-size: 50rpx"
                ></i>
              </div>
              <div class="detail-title">{{cItem.categoryName}}|{{cItem.payIncomeNote}}</div>
            </div>
            <div class="detail-price">
              <div style="text-align: right">
                <span v-if="cItem.billType == 0" style="color: red;">-￥{{cItem.price}}</span>
                <span v-if="cItem.billType == 1" style="color: green;">￥{{cItem.price}}</span>
              </div>
              <span style="font-size: 12px;">{{cItem.createTime}}</span>
            </div>
            <div class="delete" @click="delAccounting(cItem.id)">删除</div>
          </div>
        </div>
      </div>
    </scroll-view>
    <tab-bar :selectNavIndex="0"></tab-bar>
  </div>
</template>

<script>
import Vue from 'vue'
import utils from '@/utils'
import timePicker from '@/components/timePicker'
import tabBar from '@/components/tabBar'

import { getAccountingList, deleteAccounting} from '@/utils/api'
 
export default {
  data () {
    return {
      date: '',
      selectDate: '',
      listTouchInfo: {
        startX: 0,
        startY: 0,
        scrollY: true,
        movedDistance: 0,
        movedDistanceY: 0,
        lastX: 0,
        finalX: 0,
        moveBoundray: 0,
        currentIndex: null,       
      },
      billNoteList: [],
      categoryList: [],
      requestMode: 1, // 1-请求月份，2-请求年份
      sYear: utils.getTodayDate().year,
      sMonth: utils.getTodayDate().month,
      totalPayAmount: 0,
      totalIncomeAmount: 0,
    }
  },

  components: {
    timePicker,
    tabBar
  },

  methods: {
    getJson(item) {
      console.log('getJson', item);
    },
    updateDate(v){
      console.log(v)
      this.sYear = utils.getTodayDate(v).year
      this.sMonth = utils.getTodayDate(v).month
      this.getBookingList()
    },
    delAccounting(id){
      let that = this
      wx.showModal({
        title: '提示',
        content: '确认删除',
        success(res) {
          if (res.confirm) {
            deleteAccounting({id}).then((res) => {
              if(res.code == 1){
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })
                that.getBookingList()
              }
            }).catch(err => {
              console.log(err)
            })
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    getBookingList(){
      return getAccountingList({
        userId: wx.getStorageSync("user_info").user.id,
        billYear: parseInt(this.sYear),
        billMonth: parseInt(this.sMonth)
      }).then(res => {
        console.log('getBookingList', res);
        if (res && res.code === 1503) {
          console.log('token失效, 清楚缓存内容, 并重新登陆');
          wx.setStorageSync("user_info", '');
          this.init();
          return;
        }
        if (res) {
          this.billNoteList = res.data.billNoteList;
          this.totalPayAmount = res.totalPayAmount;
          this.totalIncomeAmount = res.totalIncomeAmount;
        } else {
          this.billNoteList = [];
          this.totalPayAmount = 0;
          this.totalIncomeAmount = 0;
        }
      })
    },
    listTouchStart(e){
      this.listTouchInfo.lastX = null
      this.listTouchInfo.finalX = null
      this.listTouchInfo.startX = e.touches[0].clientX
      this.listTouchInfo.startY = e.touches[0].clientY
      
      // console.log(e.mp.currentTarget.dataset.index)
      this.listTouchInfo.currentIndex = e.mp.currentTarget.dataset.index
      this.xCanMove = true   // 默认允许左滑

    },
    listTouchMove(e){
      this.listTouchInfo.movedDistance = e.mp.touches[0].clientX - this.listTouchInfo.startX
      this.listTouchInfo.movedDistanceY = e.mp.touches[0].clientY - this.listTouchInfo.startY
      console.log(this.listTouchInfo.movedDistanceY)
      if (Math.abs(this.listTouchInfo.movedDistanceY) < 5) {
        // 
        if (this.listTouchInfo.movedDistance < -7 && this.xCanMove) { //&& (Math.abs(this.listTouchInfo.movedDistance) < this.listTouchInfo.moveBoundray)
          // this.xCanMove = true
          this.listTouchInfo.scrollY = false
          this.listTouchInfo.finalX = -this.listTouchInfo.moveBoundray
        }
        else if ((this.listTouchInfo.movedDistance) > 0) {
          this.listTouchInfo.finalX = 0
        } 
      } else {
        this.xCanMove = false
        this.listTouchInfo.scrollY = true
      }
    },
    listTouchEnd(e){
      this.listTouchInfo.lastX = this.listTouchInfo.finalX
      this.listTouchInfo.scrollY = true
      this.xCanMove = true
    },
    fatherClick(){
      this.listTouchInfo.finalX = 0
      this.listTouchInfo.lastX = 0
    },
    init() {
      var userInfo = wx.getStorageSync('user_info');
      // 存在token
      console.log('user_info:', userInfo);
      // 检查有效期
      if (userInfo && userInfo.user) {
        if (userInfo.user.userToken.expireTimeMills > new Date().getMilliseconds()) {
          console.log('token 有效');
          this.getBookingList()
          return;
        }
      }
      console.log('token 失效重新登陆');
      var thi = this;
      wx.login({
        success (res) {
          if (res.code) {
            console.log('wx登陆成功!');
            //发起网络请求
            wx.request({
              url: `${process.env.API_ROOT}/sys/user/login`,
              method: "POST",
              data: {
                code: res.code
              },
              success: res => {
                console.log('请求后台成功! ', res);
                wx.setStorageSync("user_info", res.data);
                thi.getBookingList()
              }
            })
          } else {
            console.log('登录失败! ' + res.errMsg)
          }
        }
      })
    }
  },

  created () {
    // let app = getApp()
    this.systemInfo = wx.getSystemInfoSync();
    this.listTouchInfo.moveBoundray = 100 / 750 * this.systemInfo.windowWidth
    
  },
  computed:{
    isIphoneX(){
        return this.$store.getters.isIphoneX
    },
    isListEmpty(){
      return (this.billNoteList && this.billNoteList.length > 0) ? false : true
    },
  },
  onShow () {
    this.init();
  },
  mounted(){
    // this.getBookingList({
    //   recordYear: parseInt(utils.getTodayDate().year),
    //   recordMonth: parseInt(utils.getTodayDate().month)
    // })
  },
  onPullDownRefresh() {
    this.getBookingList()
    wx.stopPullDownRefresh();
  }
}
</script>

<style scoped lang="stylus">
headerBigFontSize = 40px;
headerHeight = 150px;

.header {
  height: headerHeight;
  background: themeColor;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;

  .header-bar {
    display: flex;
    justify-content: left;
    align-items: flex-end;
    height: 100%;
  }

  .bar-item {
    position: relative;
    height: indexHeaderBar;

    .top {
      height: indexHeaderBarTop;
      line-height: 24px;
      font-size: 24px;
      color: #6e633e;
    }

    .bottom {
      display: flex;
      position: relative;
      height: indexHeaderBarBottom;
      font-size: 30px;
      justify-content: flex-start;
      align-items: center;

      .month {
        font-size: headerBigFontSize;
        border-right: 1px solid darkGrayColor;
        width: 100%;
      }

      > span {
        font-size: 24px;
      }
    }
  }

  .bar-item-1 {
    flex: 2;
    box-sizing: border-box;
    padding: 0 30px;
  }

  .bar-item-2 {
    flex: 5;
    box-sizing: border-box;
    display: flex;
    padding: 0 30px;

    .bar-item-pay, .bar-item-income {
      flex: 1;

      .acount {
        font-size: headerBigFontSize;
      }
    }
  }
}

.testBtn {
  height: 100px;
  width: 100px;
  background-color: gray;
  text-align: center;
}

.time-picker {
  height: 500px;
}

.bookingList-wrap {
  box-sizing: border-box;
  background: backgroundGray;
  padding-bottom: tabbarBottomHeight;
  padding-top: headerHeight;

  // background #fff
  &.isIphoneX {
    padding-bottom: tabbarBottomHeight + isPhoneXBottom;
  }
}

.item-block {
  // border-top 20px solid #f5f5f5
  background: #fff;
  margin-top: 20px;

  // margin-top 20px
  .item-head {
    padding: 0 30px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28px;
    color: #969696;
  }

  .item-list {
    position: relative;
    padding: 0 30px;
    height: 150px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .detail-info {
      display: flex;
      align-items: center;
      height: 100%;

      .detail-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: themeColor;
        margin-right: 20px;
      }

      .detail-title {
        line-height: 150px;
        font-size: 30px;
        color: fontColorGray;
      }
    }

    .detail-price {
      font-size: 36px;
      color: #000;
    }

    .delete {
      position: absolute;
      height: 100%;
      width: 100px;
      right: -100px;
      top: 0;
      background: #ed736e;
      line-height: 150px;
      text-align: center;
      color: #fff;
      font-size: 30px;
    }

    &.addAmination {
      transition: all 0.5s;
    }
  }
}

.scroll-view {
  height: 100vh;
  box-sizing: border-box;
  background: backgroundGray;
  position: relative;
  // padding-top headerHeight
}

.isListEmpty {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -125px;
  width: 200px;
  height: 250px;

  img {
    height: 200px;
    width: 200px;
  }

  p {
    color: #dbdbdb;
    font-weight: bold;
    text-align: center;
    font-size: 30px;
  }
}
</style>
