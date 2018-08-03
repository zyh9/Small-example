<template>
  <div class="uu_pay">
    <div class="uu_top">
      <p class="pay_text">支付金额</p>
      <p class="pay_money"><span>¥</span>88</p>
      <p class="pay_shop">支付给<span>大橙子的小店</span></p>
    </div>
    <div class="uu_con">
      <p class="pay_title">支付方式 :</p>
      <div class="pay_list">
        <div class="pay_item">
          <i class="icon icon_over"></i>
          <div class="pay_left">
            <p>会员余额</p>
            <span>使用会员卡余额支付</span>
          </div>
          <i class="icon icon_normal" :class="{icon_checked:checkedIndex==0}"></i>
        </div>
        <div class="pay_item">
          <i class="icon icon_wx_pay"></i>
          <div class="pay_left">
            <p>微信支付</p>
            <span>使用微信进行支付</span>
          </div>
          <i class="icon icon_normal" :class="{icon_checked:checkedIndex==1}"></i>
        </div>
      </div>
    </div>
    <div class="pay_btn" :class="{payOk:val}" @click="payCode">立即支付</div>
    <div class="vip_mask" @click="vipMask=false" v-if="vipMask"></div>
    <div class="vip_con" v-if="vipMask">
      <div class="pay_title">
        <p class="pay_password">请输入支付密码</p>
        <div class="title_img" @click.stop="vipMask=false">
          <i class="icon icon_nobg_close"></i>
        </div>
      </div>
      <div class="vip_pay_info">
        <p class="vip_pay_text"><i class="icon icon_over"></i><span>余额支付</span></p>
        <p class="vip_pay_money"><span>¥</span>88</p>
        <p class="shop_name">付款给大橙子的小店</p>
      </div>
      <div class="vip_code">
        <input type="number" focus="true" maxlength="6" v-model="code" placeholder-style="color:transparent;" />
        <div v-for="(v,i) in codeLen" :key="i" class="item_code">{{codeArr[i]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        vipMask: true,
        code: '',
        codeLen: 6,
        checkedIndex:0,//0=>余额支付  1=>微信支付
      }
    },
    methods: {
      payCode() {
        this.vipMask = true;
      }
    },
    computed: {
      codeArr() {
        let arr = [];
        this.code.split('').forEach(_ => arr.push('·'));
        return arr;
      },
    },
    watch: {
      code: function(newVal, oldVal) {
        // console.log(newVal)
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .uu_pay {
    height: 100%;
    position: relative;
    .uu_top {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80rpx 36rpx;
      border-bottom: 20rpx solid #ebebeb;
      .pay_text {
        font-size: 30rpx;
        color: #1a1a1a;
      }
      .pay_money {
        font-size: 88rpx;
        color: #1a1a1a;
        display: flex;
        align-items: center;
        font-weight: 400;
        span {
          font-size: 40rpx;
          color: #1a1a1a;
          margin-right: 12rpx;
        }
      }
      .pay_shop {
        font-size: 28rpx;
        color: #666;
        span {
          color: #1a1a1a;
        }
      }
    }
    .uu_con {
      width: 100%;
      overflow: hidden;
      .pay_title {
        padding: 30rpx 36rpx;
        color: #1d1d1d;
        font-size: 28rpx;
      }
      .pay_list {
        padding: 0 36rpx 80rpx;
      }
      .pay_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx 0;
        height: 80rpx;
        .pay_left {
          flex: 1;
          p {
            color: #1d1d1d;
            font-size: 32rpx;
            font-weight: 700;
          }
          span {
            display: block;
            font-size: 22rpx;
            color: #ff4d3a;
          }
        }
        img {
          width: 42rpx;
          height: 42rpx;
        }
      }
    }
    .pay_btn {
      height: 88rpx;
      color: #fff;
      background-color: #ff4d3a;
      font-size: 30rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 6rpx;
      position: absolute;
      left: 36rpx;
      right: 36rpx;
      bottom: 36rpx;
    }
    .vip_mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 10;
      transition: all 0.1s ease;
    }
    .vip_con {
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 660rpx; // height: 480rpx;
      background-color: #fff;
      border-radius: 6rpx;
      padding: 0 36rpx 36rpx;
      box-sizing: border-box;
      z-index: 20;
      .pay_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 86rpx;
        position: relative;
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
        }
        .pay_password {
          font-size: 30rpx;
          color: #1a1a1a;
        }
        .title_img {
          width: 42rpx;
          height: 42rpx;
          padding: 12rpx;
        }
      }
      .vip_pay_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50rpx 0;
        .vip_pay_text {
          display: flex;
          align-items: center;
          i {
            width: 36rpx;
            height: 36rpx;
          }
          span {
            font-size: 28rpx;
            color: #666;
          }
        }
        .vip_pay_money {
          font-size: 66rpx;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          font-weight: 400;
          span {
            font-size: 36rpx;
            color: #1a1a1a;
            margin-right: 12rpx;
          }
        }
        .shop_name {
          font-size: 28rpx;
          color: #1a1a1a;
        }
      }
      .vip_code {
        height: 98rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        input {
          position: absolute;
          height: 98rpx;
          top: 0;
          left: -400rpx;
          right: 0;
          bottom: 0;
          opacity: 0;
          font-size: 20rpx;
          color: transparent;
        }
        .item_code {
          width: 98rpx;
          height: 98rpx;
          box-sizing: border-box;
          border: 1px solid #999;
          border-left: none;
          font-size: 100rpx;
          color: #1a1a1a;
          text-align: center;
          line-height: 98rpx;
        }
        .item_code:nth-of-type(1) {
          border-left: 1px solid #999;
        }
      }
    }
  }
</style>
