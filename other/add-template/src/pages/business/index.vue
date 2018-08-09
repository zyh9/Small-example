<template>
  <div class="business">
    <div class="business_con">
      <div class="business_top">
        <div class="search" @click="search">
          <i class="icon icon_search_3"></i>
          <p class="text">搜索</p>
        </div>
        <div class="classify" @click="openType">
          <i class="icon icon_classify"></i>
          <span>分类</span>
        </div>
      </div>
      <div class="business-banner" v-if="SectionFirst&&SectionFirst.length">
        <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" circular="true" class="swiper">
          <swiper-item v-for="(item,index) in SectionFirst" :key="index">
            <img :src="item.PictureUrl?item.PictureUrl+'?x-oss-process=image/resize,w_800/format,jpg':''" class="slide-image fade_in" alt="" @click="indexClick(item)" />
          </swiper-item>
        </swiper>
      </div>
      <div class="business-nav" v-if="SectionSecond&&SectionSecond.length">
        <div class="business-nav-cont">
          <div class="business-nav-item" :class="{indexNavItems: SectionSecond.length < 4}" v-for="(item,index) in SectionSecond" :key="index" @click="indexClick(item)">
            <img :src="item.PictureUrl?item.PictureUrl+'?x-oss-process=image/resize,w_300/format,jpg':''" class="fade_in" alt="" />
          </div>
        </div>
      </div>
      <div class="business-ad" v-if="SectionThird&&SectionThird.length">
        <div class="business-ad-item" v-for="(item,index) in SectionThird" :key="index" @click="indexClick(item)">
          <img :src="item.PictureUrl?item.PictureUrl+'?x-oss-process=image/resize,w_800/format,jpg':''" class="fade_in" alt="" />
        </div>
      </div>
      <div class="business-recommend" v-if="GoodsTypeBlock&&pageShopList.length">
        <div class="business-recommend-title">
          <i class="icon icon_recommend"></i>
          <p>{{pageName}}</p>
        </div>
        <div class="business-recommend-list">
          <div class="business-recommend-item" v-for="(v,i) in pageShopList" :key="i" @click="goDetails(v)">
            <img :src="v.GoodsMasterPic?v.GoodsMasterPic+'?x-oss-process=image/resize,w_300/format,jpg':''" class="fade_in" alt="" />
            <div class="business-recommend-item-title">{{v.GoodName}}</div>
            <div class="business-recommend-item-price" v-if="v.State!=3">
              <i class="icon icon_discount_text" v-if="v.GoodsType==-1"></i>
              <p class="price"><span>¥</span>{{v.SalesPrice?v.SalesPrice:v.OriginalPrice}}</p>
              <p class="original_price" v-if="v.GoodsType==-1">¥{{v.OriginalPrice}}</p>
            </div>
            <div class="sold_out" v-if="v.State==3">已售罄</div>
            <div class="sold_out_mask" v-if="v.State==3"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="shop_close" v-if="openState==0">店铺已打烊</div>
    <div class="tab_bar fixed_bot">
      <div class="tab_bar_item">
        <img src="../../../static/tabBar/index-active.png" alt="">
        <p class="active">首页</p>
      </div>
      <div class="tab_bar_item" @click="openCart">
        <img src="../../../static/tabBar/cart.png" alt="">
        <p>购物车</p>
      </div>
      <div class="tab_bar_item" @click="openUser">
        <img src="../../../static/tabBar/user.png" alt="">
        <p>我的</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 800,
        IndexInfoList: {},
        pageName: '',
        pageId: '',
        pageShopList: [],
        page: 1,
        quest: true,
        nomore: false,
        ShopId: '',
        SectionFirst: [],
        SectionSecond: [],
        SectionThird: [],
        GoodsTypeBlock: false,
        openState: null,
      }
    },
    onPullDownRefresh() { //下拉刷新
      this.page = 1;
      this.nomore = false;
      this.getUserInfo(this.page)
    },
    onReachBottom() { //触底事件
      if (this.IndexInfoList.TemplateData.GoodsType && this.IndexInfoList.TemplateData.GoodsType.ID) {
        if (this.quest) {
          this.page++;
          this.shopPageInfo()
        }
      }
    },
    onLoad() {
      this.openState = null;
      this.indicatorDots = true;
      this.ShopId = this.$root.$mp.query.ShopId;
      this.page = 1;
      this.quest = true;
      this.nomore = false;
      this.IndexInfoList = {};
      this.pageShopList = [];
      this.SectionFirst = this.SectionSecond = this.SectionThird = [];
      this.pageName = '';
      this.pageId = '';
      this.GoodsTypeBlock = false;
    },
    onReady() {
      this.getUserInfo();
    },
    onShow() {},
    methods: {
      getUserInfo(pg) {
        this.util.post({
          url: '/api/Customer/Browse/GetShopInfo',
          data: {
            shopId: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
          }
        }).then(res => {
          // console.log(res.Body)
          wx.setNavigationBarTitle({
            title: res.Body.ShopName ? res.Body.ShopName : '店铺详情'
          })
          this.IndexInfoList = res.Body;
          this.openState = res.Body.OpenState;
          if (this.IndexInfoList.TemplateData.GoodsType && this.IndexInfoList.TemplateData.GoodsType.ID) {
            this.pageName = this.IndexInfoList.TemplateData.GoodsType.Name;
            this.pageId = this.IndexInfoList.TemplateData.GoodsType.ID;
            this.shopPageInfo(pg)
          } else {
            wx.stopPullDownRefresh();
          }
          wx.setStorageSync('shopInfo', this.IndexInfoList)
          this.GoodsTypeBlock = this.IndexInfoList.TemplateData.GoodsType ? true : false;
          //默认banner图
          this.SectionFirst = this.IndexInfoList.TemplateData.SectionFirst && this.IndexInfoList.TemplateData.SectionFirst.length ? this.IndexInfoList.TemplateData.SectionFirst : [{
            LinkType: -1,
            PictureUrl: "https://otherfiles-ali.uupt.com/Stunner/FE/M/defaultBanner.png"
          }];
          // console.log(this.SectionFirst)
          if (this.SectionFirst && this.SectionFirst.length == 1) {
            this.indicatorDots = false;
          }
          this.SectionSecond = this.IndexInfoList.TemplateData.SectionSecond && this.IndexInfoList.TemplateData.SectionSecond.length ? this.IndexInfoList.TemplateData.SectionSecond : [];
          this.SectionThird = this.IndexInfoList.TemplateData.SectionThird && this.IndexInfoList.TemplateData.SectionThird.length ? this.IndexInfoList.TemplateData.SectionThird : [];
        }).catch(err => {
          this.msg(err.Msg)
          setTimeout(_ => {
            wx.switchTab({
              url: '/pages/nearby-shop/main'
            })
          }, 1000)
        })
      },
      shopPageInfo(pg) {
        this.util.post({
            url: '/api/Customer/Browse/GetShopGoods',
            data: {
              shopId: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
              GoodType: this.pageId,
              PageSize: 20,
              PageIndex: this.page
            }
          })
          .then(res => {
            // console.log(res.Body)
            wx.stopPullDownRefresh();
            if (pg == 1) {
              this.pageShopList = res.Body;
              this.quest = true;
              this.nomore = false;
            } else {
              this.pageShopList.push(...res.Body);
            }
            if (!res.Body.length && this.page == 1) {
              // this.msg('店家暂无配置')
            } else if (!res.Body.length && this.page > 1) {
              this.quest = false;
              this.nomore = true;
            } else if (res.Body.length > 1 && res.Body.length < 20 && this.page == 1) {
              this.quest = false;
              this.nomore = true;
            } else if (res.Body.length > 1 && res.Body.length < 20 && this.page > 1) {
              this.quest = false;
              this.nomore = true;
            }
          }).catch(err => {
            this.msg(err.Msg)
          })
      },
      search() {
        wx.navigateTo({
          url: `/pages/search-product/main`
        })
      },
      openType() {
        wx.navigateTo({
          url: `/pages/type-list/main`
        })
      },
      openCart() {
        wx.navigateTo({
          url: '/pages/cart/main'
        })
      },
      openUser() {
        wx.navigateTo({
          url: '/pages/shop-user/main'
        })
      },
      goDetails(item) {
        // console.log(item)
        if (item.State == 3) {
          this.msg('商品已售罄')
          return;
        }
        let {
          GoodId
        } = item;
        let ShopId = String(wx.getStorageSync('shopInfo').ShopId) || '';
        wx.navigateTo({
          url: `/pages/product-details/main?ShopId=${ShopId}&GoodId=${GoodId}&type=1&temp=2`
        })
      },
      indexClick(item) {
        if (item.LinkType == 1) {
          wx.navigateTo({
            url: '/pages/my-coupon-manage/main'
          });
        } else if (item.LinkType == 2) {
          wx.navigateTo({
            url: '/pages/my-vip/main'
          })
        } else if (item.LinkType == 3) {
          wx.navigateTo({
            url: `/pages/page-list/main?id=${item.GoodsTypeId}`
          })
        } else if (item.LinkType == 4) {
          let {
            GoodsId
          } = item;
          let ShopId = String(wx.getStorageSync('shopInfo').ShopId) || '';
          wx.navigateTo({
            url: `/pages/product-details/main?ShopId=${ShopId}&GoodId=${GoodsId}&type=1&temp=2`
          })
        }
      },
    },
    components: {}
  }
</script>

<style lang="less">
  .business {
    position: relative;
    .business_con {
      overflow-x: hidden;
      overflow-y: scroll;
      padding-bottom: 104rpx;
    }
    .business_con::-webkit-scrollbar {
      display: none;
    }
    .business_top {
      padding: 0 36rpx 26rpx;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .search {
        flex: 1;
        height: 64rpx;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        background-color: rgba(235, 235, 235, 0.8);
        border-radius: 32rpx;
        margin-right: 20rpx;
        padding-left: 24rpx;
        box-sizing: border-box;
        .text {
          margin-left: 12rpx;
          font-size: 24rpx;
          color: #000;
        }
      }
      .classify {
        width: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        text-align: center;
        align-items: center;
        padding: 0 10rpx;
        span {
          margin-top: 6rpx;
          font-size: 20rpx;
          line-height: 22rpx;
          color: #444;
          white-space: nowrap;
        }
      }
    }
    .business-banner {
      padding: 0 36rpx 20rpx;
      .swiper {
        height: 320rpx;
        border-radius: 10rpx;
        overflow: hidden;
        box-shadow: 0 6rpx 10rpx rgba(0, 0, 0, 0.18);
        position: relative;
        z-index: 10;
      }
      .slide-image {
        width: 100%;
        height: 320rpx;
        border-radius: 10rpx;
      }
    }
    .business-nav {
      padding: 0 36rpx 36rpx;
      .business-nav-cont {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        .business-nav-item {
          width: 159rpx;
          height: 159rpx;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 16rpx;
          img {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
          p {
            font-size: 24rpx;
            color: #000;
            text-align: center;
            line-height: 24rpx;
            margin-top: 17rpx;
          }
        }
        .indexNavItems {
          width: 212rpx;
          height: 212rpx;
        }
      }
    }
    .business-ad {
      padding: 0 36rpx 59rpx;
      .business-ad-item {
        height: 200rpx;
        margin-bottom: 16rpx;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
      &.business-ad-item:last-child {
        margin-bottom: 0;
      }
    }
    .business-recommend {
      padding: 0 36rpx;
      .business-recommend-title {
        height: 40rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        p {
          margin-left: 12rpx;
          font-size: 40rpx;
          font-weight: 700;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .business-recommend-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-top: 40rpx;
        .business-recommend-item {
          width: 325rpx;
          margin-bottom: 35rpx;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: relative;
          img {
            width: 100%;
            height: 332rpx;
            border-radius: 10rpx;
            box-shadow: 0 6rpx 10rpx rgba(0, 0, 0, 0.18);
          }
          .business-recommend-item-title {
            margin-top: 20rpx;
            font-size: 30rpx;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 40rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .business-recommend-item-price {
            line-height: 32rpx;
            margin-top: 10rpx;
            display: flex;
            align-items: center;
            i {
              transform: translateY(0);
            }
            .price {
              color: #ff4d3a;
              font-size: 32rpx;
              font-weight: 700;
              span {
                font-size: 24rpx;
                margin-right: 6rpx;
              }
            }
            .original_price {
              font-size: 24rpx;
              color: #ccc;
              margin-left: 12rpx;
              position: relative;
              &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #ccc;
                position: absolute;
                bottom: 50%;
                left: 0;
                transform: scale(1, 0.5);
                transform-origin: 0 0;
              }
            }
          }
          .sold_out {
            margin-top: 10rpx;
            line-height: 32rpx;
            font-size: 24rpx;
            color: #1a1a1a;
          }
          .sold_out_mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.55);
          }
        }
      }
    }
  }
  .shop_close {
    position: fixed;
    left: 0;
    bottom: 104rpx;
    width: 100%;
    height: 96rpx;
    background-color: rgba(26, 26, 26, 0.8);
    color: #ccc;
    line-height: 96rpx;
    text-align: center;
    font-size: 30rpx;
  }
  .fixed_bot {
    position: fixed !important;
    z-index: 100;
  }
</style>
