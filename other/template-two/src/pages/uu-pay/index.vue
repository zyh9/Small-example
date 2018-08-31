<template>
  <div class="uu_pay fade_in" v-if="block">
    <div class="uu_top">
      <p class="pay_text">支付金额</p>
      <p class="pay_money"><span>¥</span>{{payInfo.PayAmount}}</p>
      <p class="pay_shop">支付给<span>{{payInfo.ShopName}}</span></p>
    </div>
    <div class="uu_con">
      <p class="pay_title">支付方式 :</p>
      <div class="pay_list">
        <div class="pay_item" @click="selectPay(v)" v-for="(v,i) in payInfo.PaymentChannels" :key="i">
          <i class="icon icon_wx_pay" v-if="v.PaymentType==1"></i>
          <i class="icon icon_over" v-if="v.PaymentType==2"></i>
          <div class="pay_left">
            <p>{{v.PaymentName}}</p>
            <span v-if="v.PaymentType==2">{{v.PaymentStatus==-3?'余额不足':'可用余额: ¥ '+payInfo.Balance}}</span>
          </div>
          <i class="icon icon_normal" :class="{icon_checked:v.checked}"></i>
        </div>
      </div>
    </div>
    <div class="pay_btn" :class="{payOk:val}" @click="payCode">{{checkedIndex==0?'余额支付':'微信支付'}}</div>
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
        <p class="vip_pay_money"><span>¥</span>{{payInfo.PayAmount}}</p>
        <p class="shop_name">付款给 {{payInfo.ShopName}}</p>
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
        vipMask: false,
        code: '',
        codeLen: 6,
        checkedIndex: 0, //0=>余额支付  1=>微信支付
        payInfo: {}, //待支付信息
        uuPayInfo: {},
        payOnoff: true, //支付开关
        ample: false, //余额是否充足
        block: false, //是否显示
      }
    },
    onLoad() {
      this.payInfo = {};
      this.code = '';
      this.vipInfo = {};
      this.isVip = false;
      this.ample = false;
      this.uuPayInfo = {};
      this.block = false;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    },
    onReady() {
      this.uuPayInfo = this.$root.$mp.query;
      // console.log(this.uuPayInfo)
      this.getPayInfo()
    },
    onShow() {
      this.payOnoff = true;
      this.vipMask = false;
    },
    methods: {
      getPayInfo() {
        this.util.post({
          url: '/api/Customer/Browse/GetPrePaymentOrder',
          data: {
            ShopId: this.uuPayInfo.shopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
            OrderId: this.uuPayInfo.OrderId ? this.uuPayInfo.OrderId : 0,
            PayAmount: this.uuPayInfo.money ? this.uuPayInfo.money : 0, //线下扫码付款订支付金额(在线支付订单忽略此参数)
          }
        }).then(res => {
          wx.hideLoading();
          this.block = true;
          // console.log(res)
          //1 正常 -1 店铺未开通会员卡服务 -2 非Vip会员无法使用 -3 余额不足
          res.Body.PaymentChannels = res.Body.PaymentChannels.filter(e => e.PaymentStatus != -2 && e.PaymentStatus != -1);
          // console.log(res.Body.PaymentChannels)
          res.Body.PaymentChannels.forEach(e => e.checked = false);
          //是否包含余额支付
          let info = res.Body.PaymentChannels.filter(e => e.PaymentType == 2);
          if (info.length) { //有余额支付
            // console.log(res.Body.Balance,res.Body.PayAmount)
            if (res.Body.Balance >= res.Body.PayAmount) { //余额充足
              console.log('余额充足')
              res.Body.PaymentChannels.forEach(e => e.PaymentType == 2 && (e.checked = true))
              this.checkedIndex = 0;
              this.ample = true;
            } else { //余额不足
              console.log('余额不足')
              res.Body.PaymentChannels.forEach(e => e.PaymentType == 1 && (e.checked = true))
              this.checkedIndex = 1;
              this.ample = false;
            }
          } else {
            res.Body.PaymentChannels.forEach(e => e.checked = true);
            this.checkedIndex = 1;
          }
          // console.log(res.Body.PaymentChannels)
          this.payInfo = res.Body;
        }).catch(err => {
          wx.hideLoading();
          this.msg(err.Msg)
        })
      },
      selectPay(v) { //0=>余额支付  1=>微信支付
        // console.log(v)
        if (v.PaymentType == 2) {
          if (this.ample) {
            this.payInfo.PaymentChannels.forEach(e => e.checked = false);
            this.payInfo.PaymentChannels.forEach(e => {
              e.PaymentType == 2 && (e.checked = true);
            })
            this.checkedIndex = 0;
          } else {
            this.msg('余额不足')
            this.payInfo.PaymentChannels.forEach(e => e.checked = false);
            this.payInfo.PaymentChannels.forEach(e => {
              e.PaymentType == 1 && (e.checked = true);
            })
            this.checkedIndex = 1;
          }
        } else {
          this.payInfo.PaymentChannels.forEach(e => e.checked = false);
          this.payInfo.PaymentChannels.forEach(e => {
            e.PaymentType == 1 && (e.checked = true);
          })
          this.checkedIndex = 1;
        }
      },
      payCode() {
        if (this.checkedIndex == 0) { //余额支付
          this.vipMask = true;
        } else { //微信支付
          if (this.uuPayInfo.OrderId) {
            this.wxPay()
          } else {
            this.scanCode('', 1)//线下微信支付
          }
        }
      },
      wxPay() {
        if (this.payOnoff) {
          this.payOnoff = false;
          this.util.post({
              url: '/api/Customer/Order/OrderRePay',
              data: {
                OrderId: this.uuPayInfo.OrderId ? this.uuPayInfo.OrderId : 0
              }
            })
            .then(res => {
              if (res.State == 1) {
                this.packageId = res.Body.package;
                wx.requestPayment({
                  timeStamp: res.Body.timeStamp,
                  nonceStr: res.Body.nonceStr,
                  package: res.Body.package,
                  signType: res.Body.signType,
                  paySign: res.Body.paySign,
                  success: payres => {
                    this.payOnoff = true;
                    //新订单微信支付成功
                    this.$store.dispatch('newOrder', true)
                    setTimeout(_ => {
                      /* 支付成功跳转订单列表 */
                      wx.redirectTo({
                        url: `/pages/order-details/main?orderId=${this.uuPayInfo.OrderId}&type=1`
                      });
                    }, 800)
                  },
                  fail: err => {
                    console.log(err)
                    this.msg('您已取消支付')
                    this.payOnoff = true;
                    setTimeout(_ => {
                      /* 取消支付跳转订单列表 */
                      wx.redirectTo({
                        url: `/pages/order-details/main?orderId=${this.uuPayInfo.OrderId}&type=1`
                      });
                    }, 800)
                  }
                })
              }
            }).catch(err => {
              this.payOnoff = true;
              this.msg(err.Msg)
            })
        }
      },
      authPassword() {
        //先验证支付密码
        this.util.post({
          url: '/api/Customer/VipMember/VerifyVipTradersPwd',
          data: {
            VipNo: this.payInfo.VipNo,
            TradersPwd: this.code,
            VerifyType: 2
          }
        }).then(res => {
          wx.showLoading({
            title: '支付中',
            mask: true
          })
          if (this.uuPayInfo.OrderId) {
            this.vipPay(res.Body.Token)
          } else {
            this.scanCode(res.Body.Token, 2)//线下余额支付
          }
        }).catch(err => {
          this.msg(err.Msg)
          setTimeout(_ => {
            this.code = '';
          }, 200)
        })
      },
      vipPay(token) {
        //余额支付
        this.util.post({
          url: '/api/Customer/Order/OrderAccountPayment',
          data: {
            OrderId: this.uuPayInfo.OrderId ? this.uuPayInfo.OrderId : 0,
            Token: token
          }
        }).then(res => {
          if (this.$mp.query.again == 0) {
            // console.log('no再来')
            let cartListSum = wx.getStorageSync('cartListSum') || [];
            let shopCartInfo = cartListSum.filter(e => e.ShopId == wx.getStorageSync('shopInfo').ShopId);
            let cartSum = shopCartInfo[0].cartList ? shopCartInfo[0].cartList : [];
            let filtercartSum = cartSum.filter(e => e.check == false);
            // console.log(filtercartSum)
            //存在false的情况
            if (filtercartSum.length) {
              console.log('存在未勾选商品')
              //走设置
              cartListSum.forEach(e => {
                if (e.ShopId == wx.getStorageSync('shopInfo').ShopId) {
                  e.cartList = filtercartSum;
                }
              })
              //针对商品列表为空的店铺做清空处理
              cartListSum = cartListSum.filter(e => e.cartList.length > 0);
              // 再设置缓存数据
              wx.setStorageSync('cartListSum', cartListSum);
              //缓存length不存在，直接清除
              !cartListSum.length && wx.removeStorageSync('cartListSum');
            } else {
              cartListSum = cartListSum.filter(e => e.ShopId != wx.getStorageSync('shopInfo').ShopId);
              // console.log(cartListSum)
              // 再设置缓存数据
              wx.setStorageSync('cartListSum', cartListSum);
              //缓存length不存在，直接清除
              !cartListSum.length && wx.removeStorageSync('cartListSum');
            }
            wx.removeStorageSync('note');
            wx.removeStorageSync('selectAddress');
          }
          //新订单余额支付成功
          this.$store.dispatch('newOrder', true);
          //支付成功跳转
          setTimeout(_ => {
            wx.hideLoading();
            this.vipMask = false;
            /* 取消支付跳转订单列表 */
            wx.redirectTo({
              url: `/pages/order-details/main?orderId=${this.uuPayInfo.OrderId}&type=1`
            });
          }, 800)
        }).catch(err => {
          wx.hideLoading();
          this.msg(err.Msg)
        })
      },
      scanCode(token, type) {
        if (this.payOnoff) {
          this.payOnoff = false;
          this.util.post({
            url: '/api/Customer/Browse/CustomerPayment',
            data: {
              PaymentType: type,
              ShopId: this.uuPayInfo.shopId,
              Money: this.uuPayInfo.money,
              Token: token
            }
          }).then(res => {
            if (type == 2) { //余额支付
              console.log('余额支付')
              setTimeout(_ => {
                wx.redirectTo({
                  url: `/pages/pay-ok/main?money=${this.uuPayInfo.money}&shopName=${this.uuPayInfo.shopName}&shopId=${this.uuPayInfo.shopId}&temp=${this.uuPayInfo.temp}`
                })
              }, 800)
            } else {
              console.log('微信支付')
              wx.requestPayment({
                timeStamp: res.Body.wxPayInfo.timeStamp,
                nonceStr: res.Body.wxPayInfo.nonceStr,
                package: res.Body.wxPayInfo.package,
                signType: res.Body.wxPayInfo.signType,
                paySign: res.Body.wxPayInfo.paySign,
                success: payres => {
                  this.payOnoff = true;
                  console.log(payres)
                  setTimeout(_ => {
                    wx.redirectTo({
                      url: `/pages/pay-ok/main?money=${this.uuPayInfo.money}&shopName=${this.uuPayInfo.shopName}&shopId=${this.uuPayInfo.shopId}&temp=${this.uuPayInfo.temp}`
                    })
                  }, 800)
                },
                fail: error => {
                  this.payOnoff = true;
                  console.log(error.errMsg)
                  if (error.errMsg == 'requestPayment:fail cancel') {
                    this.msg('您已取消支付')
                  } else { //支付失败
                    setTimeout(_ => {
                      wx.redirectTo({
                        url: `/pages/pay-error/main?money=${this.uuPayInfo.money}&shopName=${this.uuPayInfo.shopName}&shopId=${this.uuPayInfo.shopId}`
                      })
                    }, 800)
                  }
                }
              })
            }
          }).catch(err => {
            this.msg(err.Msg)
          })
        }
      },
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
        newVal = newVal.replace(/[^\d]/g, '');
        newVal.length == 6 && this.authPassword();
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          color: #fff;
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
