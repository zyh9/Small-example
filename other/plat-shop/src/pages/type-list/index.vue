<template>
  <div class="type_list fade_in" v-if="block">
    <h3 class="title">分类列表</h3>
    <div class="options" v-for="(v,i) in typeList" :key="i" @click="openLis(v)">
      <p>{{v.Name}}</p>
    </div>
    <div class="no_type_tips" v-if="noBlock">
      <div class="no_type_con">
        <div class="no_shop_bg"></div>
        <p>当前店铺暂未上传任何商品哟</p>
        <div class="open_shop" @click="openShop">
          <i class="icon icon_white_shop"></i>
          <span>去逛其他店铺</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        typeList: [],
        block: false,
        noBlock: false,
      }
    },
    onLoad() {
      this.typeList = [];
      this.block = this.noBlock = false;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    },
    onReady() {
      this.getTypeList()
    },
    methods: {
      getTypeList() {
        this.util.post({
          url: '/api/Customer/Browse/GetGoodsTypes',
          data: {
            ShopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
          }
        }).then(res => {
          wx.hideLoading();
          this.block = true;
          this.noBlock = res.Body.length ? false : true;
          this.typeList = res.Body;
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      openLis(v) {
        wx.navigateTo({
          url: `/pages/page-list/main?id=${v.ID}&title=${v.Name}`
        })
      },
      openShop() {
        setTimeout(_ => {
          wx.switchTab({
            url: '/pages/nearby-shop/main'
          })
        }, 800)
      }
    },
    watch: {},
    onUnload() {}
  }
</script>

<style lang="less">
  .type_list {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    .title {
      margin: 0 36rpx;
      font-size: 46rpx;
      font-weight: 700;
      height: 104rpx;
      line-height: 104rpx;
    }
    .options {
      background: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_arrowRight.png') no-repeat right center;
      background-size: 25rpx 25rpx;
      height: 108rpx;
      display: flex;
      align-items: center;
      position: relative;
      margin: 0 36rpx;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-bottom: 1px solid #ebebeb;
        position: absolute;
        left: 0;
        bottom: 0;
        transform: scaleY(0.5);
        transform-origin: 0 0;
        z-index: 10;
      }
      p {
        color: #000;
        font-size: 30rpx;
      }
      .icon {
        margin-right: 16rpx;
      }
    }
    .options:nth-last-child(1) {
      &:after {
        display: none !important;
      }
    }
    .no_type_tips {
      position: absolute;
      top: 104rpx;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .no_type_con {
        width: 200rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateY(-30%);
        p {
          margin: 20rpx 0 80rpx;
          font-size: 22rpx;
          color: #999;
          white-space: nowrap;
        }
      }
      .open_shop {
        width: 210rpx;
        height: 64rpx;
        background-color: #ff4d3a;
        border-radius: 6rpx;
        font-size: 24rpx;
        color: #fff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          margin-right: 6rpx;
        }
      }
    }
  }
</style>
