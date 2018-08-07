<template>
  <div class="type-list">
    <div class="type-list-item" v-for="(v,i) in pageList" :key="i" @click="goDetails(v)">
      <img :src="v.GoodsMasterPic?v.GoodsMasterPic+'?x-oss-process=image/resize,w_300/format,jpg':''" class="fade_in" alt="" />
      <div class="type-list-item-title">{{v.GoodName}}</div>
      <div class="type-list-item-price" v-if="v.State!=3">
        <i class="icon icon_discount_text" v-if="v.GoodsType==-1"></i>
        <p class="price"><span>¥</span>{{v.SalesPrice?v.SalesPrice:v.OriginalPrice}}</p>
        <p class="original_price" v-if="v.GoodsType==-1">¥{{v.OriginalPrice}}</p>
      </div>
      <div class="sold_out" v-if="v.State==3">已售罄</div>
      <div class="sold_out_mask" v-if="v.State==3"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageList: [],
        page: 1,
        quest: true,
        nomore: false,
        block: false,
      }
    },
    onPullDownRefresh() { //下拉刷新
      this.page = 1;
      this.nomore = false;
      this.getPageList(this.page)
    },
    onReachBottom() { //触底事件
      if (this.quest) {
        this.page++;
        this.getPageList()
      }
    },
    onLoad() {
      this.pageList = [];
      this.page = 1;
      this.quest = true;
      this.nomore = false;
    },
    onReady() {
      // console.log(this.$root.$mp.query)
      if (this.$root.$mp.query.title) {
        wx.setNavigationBarTitle({
          title: this.$root.$mp.query.title
        })
      }
      this.getPageList()
    },
    methods: {
      getPageList(pg) {
        this.util.post({
            url: '/api/Customer/Browse/GetShopGoods',
            data: {
              shopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
              GoodType: this.$root.$mp.query.id,
              PageSize: 20,
              PageIndex: 1
            }
          })
          .then(res => {
            // console.log(res.Body.length)
            wx.stopPullDownRefresh();
            if (pg == 1) {
              this.pageList = res.Body;
              this.quest = true;
              this.nomore = false;
            } else {
              this.pageList.push(...res.Body);
            }
            if (!res.Body.length && this.page == 1) {
              this.msg('店家暂无配置')
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
      }
    },
    watch: {},
    onUnload() {}
  }
</script>

<style lang="less">
  .type-list {
    padding: 40rpx 36rpx 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .type-list-item {
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
      .type-list-item-title {
        margin-top: 20rpx;
        font-size: 30rpx;
        font-weight: 700;
        color: #1a1a1a;
        line-height: 40rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .type-list-item-price {
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
</style>
