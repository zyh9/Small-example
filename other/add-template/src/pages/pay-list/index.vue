<template>
  <div class="pay_list">
    <h3 class="title">消费余额明细</h3>
    <scroll-view scroll-y="true" lower-threshold="60" @scrolltolower="scrollHandler" :style="{height:winHeight+'px'}" class="scroll_view">
      <p class="no_info" v-if="noInfo">暂无明细信息</p>
      <div class="list-item" v-for="(v,i) in walletList" :key="i">
        <div class="wallet-info">
          <div class="text">{{v.SubjectName}}</div>
          <div class="time">{{v.TradeTime}}</div>
        </div>
        <div class="price">{{v.TradeMoney}}</div>
      </div>
      <div class="no_more" v-if="nomore">没有更多明细信息了</div>
    </scroll-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        walletList: [], //钱包明细数组
        quest: true,
        page: 1,
        PageSize: 20,
        noInfo: false,
        nomore: false,
        winHeight: 0
      }
    },
    onReady() {},
    onShow() {
      this.noInfo = this.nomore = false;
      this.walletList = [];
      this.quest = true;
      this.page = 1;
      this.getData();
      let query = wx.createSelectorQuery();
      query.select('.title').boundingClientRect();
      query.exec(res => {
        let height = res[0].height;
        wx.getSystemInfo({
          success: res => {
            this.winHeight = res.windowHeight - height;
            console.log(this.winHeight)
          }
        })
      })
    },
    methods: {
      getData() {
        this.util.post({
          url: '/api/Customer/VipMember/BalanceTradeList',
          data: {
            ShopID: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
            VipNo: wx.getStorageSync('vipUserInfo').VipNo || '',
            PageSize: this.PageSize,
            PageIndex: this.page,
          }
        }).then(res => {
          // console.log(res.Body)
          // res.Body.forEach(e => {
          //   e.TradeTime = e.TradeTime.split(' ')[0]
          // });
          this.walletList.push(...res.Body)
          if (res.Body.length < this.PageSize && this.page > 1) {
            this.quest = false;
            this.nomore = true;
          } else if (!res.Body.length && this.page == 1) {
            this.noInfo = true;
          }
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      scrollHandler() {
        if (this.quest) {
          this.page++;
          this.getData()
        }
      }
    },
    components: {}
  };
</script>

<style lang="less">
  .pay_list {
    background: #fff;
    height: 100%;
    overflow: hidden;
    .title {
      padding: 20rpx 36rpx;
      font-size: 46rpx;
      font-weight: 700;
    }
    .scroll_view {
      box-sizing: border-box;
      background: #fff;
      overflow-y: scroll;
      .list-item {
        position: relative;
        padding: 36rpx;
        display: flex;
        align-items: center;
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
        .wallet-info {
          flex: 1;
          .text {
            font-size: 28rpx;
            line-height: 22rpx;
            color: #1a1a1a;
          }
          .time {
            margin-top: 16rpx;
            font-size: 22rpx;
            line-height: 22rpx;
            color: #999;
          }
        }
        .price {
          font-size: 36rpx;
          color: #1a1a1a;
        }
      }
      .list-item:nth-last-child(1) {
        &:after {
          display: none !important;
        }
      }
    }
    .no_info {
      text-align: center;
      font-size: 28rpx;
      color: #666;
      padding-top: 100rpx;
    }
    .no_more {
      height: 70rpx;
      width: 100%;
      line-height: 70rpx;
      font-size: 20rpx;
      color: #999;
      text-align: center;
    }
  }
</style>
