<template>
  <div class="pay_list">
    <h3 class="title">消费余额明细</h3>
    <div class="container">
      <scroll-view scroll-y="true" lower-threshold="60" @scrolltolower="scrollHandler" style="height:100%;padding:0 36rpx;box-sizing:border-box;">
        <p class="no_info" v-if="noInfo">暂无明细信息</p>
        <div class="list-item" v-for="(v,i) in walletList" :key="i">
          <div class="wallet-info">
            <div class="text">{{v.SubjectName}}</div>
            <div class="time">{{v.TradeTime}}</div>
          </div>
          <div class="price">{{v.TradeMoney}}</div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        walletList: [], //钱包明细数组
        quest: true,
        page: 1,
        PageSize: 10,
        noInfo: false
      }
    },
    onReady() {},
    onShow() {
      this.noInfo = false;
      this.walletList = [];
      this.quest = true;
      this.page = 1;
      this.getData();
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
          res.Body.forEach(e => {
            e.TradeTime = this.util.FmtTime(new Date(e.TradeTime), 'yyyy-MM-dd')
          });
          if (res.Body.length < this.PageSize && this.page > 1) {
            this.quest = false;
            this.msg('已经没有更多信息了')
          } else if (!res.Body.length && this.page == 1) {
            this.noInfo = true;
          }
          this.walletList.push(...res.Body)
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
    .title {
      position: absolute;
      left: 0;
      top: 0;
      margin: 20rpx 36rpx;
      font-size: 46rpx;
      font-weight: 700;
      z-index: 5;
    }
    .container {
      padding-top: 104rpx;
      box-sizing: border-box;
      height: 100%;
      background: #fff;
      overflow: hidden;
      .list-item {
        position: relative;
        padding: 35rpx 0;
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
  }
</style>
