<template>
  <div class="shop_user">
    <div class="shop_con">
      <div class="user_info set-flex set-align">
        <div class="head">
          <img class="fade_in" :src="wxInfo.avatarUrl" alt="" v-if="wxInfo.avatarUrl">
          <i v-if="!wxInfo.avatarUrl" class="icon icon_head"></i>
        </div>
        <div class="info" v-if="wxInfo">
          <p class="user_name">{{wxInfo.nickName?wxInfo.nickName:''}}</p>
        </div>
        <div class="info" v-if="clickInfo">
          <button class="user_name" plain="true" hover-class="none" open-type="getUserInfo" @getuserinfo="getInfo" style="color:#fff;border:0;">点击获取头像</button>
        </div>
      </div>
      <div class="options" @click="order">
        <i class="icon icon_userOrder"></i>
        <p>我的订单</p>
      </div>
      <div class="options" @click="address">
        <i class="icon icon_userAddress"></i>
        <p>我的地址</p>
      </div>
      <div class="options" @click="goCoupon">
        <i class="icon icon_offer"></i>
        <p>我的优惠券</p>
      </div>
      <div class="options" @click="goVip">
        <i class="icon icon_vip"></i>
        <p>我的会员卡</p>
      </div>
      <div class="options" @click="goShop">
        <i class="icon icon_shop_img"></i>
        <p>关于店铺</p>
      </div>
    </div>
    <div class="tab_bar">
      <div class="tab_bar_item" @click="openBusiness">
        <img src="../../../static/tabBar/index.png" alt="">
        <p>首页</p>
      </div>
      <div class="tab_bar_item" @click="openCart">
        <img src="../../../static/tabBar/cart.png" alt="">
        <p>购物车</p>
      </div>
      <div class="tab_bar_item">
        <img src="../../../static/tabBar/user-active.png" alt="">
        <p class="active">我的</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        wxInfo: {},
        clickInfo: true,
      }
    },
    onShow() {
      if (wx.getStorageSync('wxInfo')) {
        this.wxInfo = wx.getStorageSync('wxInfo')
        this.clickInfo = false;
      } else {
        this.wxInfo = {};
        this.clickInfo = true;
      }
      // console.log(this.wxInfo)
    },
    methods: {
      getInfo(res) {
        if (res.target.userInfo) {
          this.wxInfo = res.target.userInfo;
          this.clickInfo = false;
          wx.setStorageSync('wxInfo', this.wxInfo)
        } else {
          console.log('用户取消')
        }
      },
      address() {
        if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
          this.msg('您还没有登录哦')
          return;
        }
        wx.navigateTo({
          url: '/pages/my-address/main?type=2'
        })
      },
      order() {
        if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
          this.msg('您还没有登录哦')
          return;
        }
        wx.navigateTo({
          url: '/pages/my-order/main?open=0'
        })
      },
      goVip() {
        if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
          this.msg('您还没有登录哦')
          setTimeout(_ => {
            wx.navigateTo({
              url: '/pages/login/main'
            })
          }, 800)
        } else {
          if (wx.getStorageSync('shopInfo').IsShowVipMenu == 0) {
            this.msg('店铺暂未开启会员服务，敬请期待')
            return;
          } else {
            wx.navigateTo({
              url: `/pages/my-vip/main`
            })
          }
        }
      },
      goShop() {
        wx.navigateTo({
          url: '/pages/shop-details/main'
        })
      },
      goCoupon() {
        let ShopId = wx.getStorageSync('shopInfo').ShopId;
        if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
          this.msg('您还没有登录哦')
          return;
        }
        wx.navigateTo({
          url: `/pages/my-coupon/main?type=2&shopId=${ShopId}`
        });
      },
      openBusiness() {
        let index = getCurrentPages().findIndex(e => e.route == 'pages/business/main');
        if (index > -1) {
          wx.navigateBack({
            delta: getCurrentPages().length - 1 - index
          })
        } else {
          wx.navigateTo({
            url: '/pages/business/main'
          })
        }
      },
      openCart() {
        let index = getCurrentPages().findIndex(e => e.route == 'pages/cart/main');
        if (index > -1) {
          wx.navigateBack({
            delta: getCurrentPages().length - 1 - index
          })
        } else {
          wx.navigateTo({
            url: '/pages/cart/main'
          })
        }
      },
    },
    computed: {},
  }
</script>

<style lang="less">
  .shop_user {
    height: 100%;
    padding-bottom: 104rpx;
    box-sizing: border-box;
    .shop_con {
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 40rpx 36rpx 0;
      box-sizing: border-box;
      .user_info {
        width: 670rpx;
        height: 230rpx;
        background: url('../../../static/myUserCard.png') no-repeat top left;
        background-size: 100%;
        margin-bottom: 40rpx;
        .head {
          width: 118rpx;
          height: 118rpx;
          border-radius: 50%;
          border: 4rpx solid #fff;
          margin: 0 32rpx 0 46rpx;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          i {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .info {
          .user_name {
            color: #fff;
            font-size: 30rpx;
          }
          .user_tel {
            font-size: 26rpx;
            color: #999;
          }
        }
      }
      .options {
        background: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_arrowRight.png') no-repeat right center;
        background-size: 25rpx 25rpx;
        height: 108rpx;
        display: flex;
        align-items: center;
        p {
          color: #000;
          font-size: 28rpx;
        }
        .icon {
          margin-right: 16rpx;
        }
      }
    }
  }
</style>
