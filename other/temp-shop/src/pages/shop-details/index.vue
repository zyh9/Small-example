<template>
  <div class="shop_details fade_in">
    <h3 class="title">店铺信息</h3>
    <div class="store_banner details_bor">
      <img :src="shopInfoList.Logo?shopInfoList.Logo+'?x-oss-process=image/resize,w_200/format,jpg':''" alt="" class="shop_img fade_in">
      <div class="shop_right_details">
        <p class="shop_name">{{shopInfoList.ShopName}}</p>
        <p class="shop_tips">简介：{{shopInfoList.ShopSummary?shopInfoList.ShopSummary:'欢迎光临本店，我们不定期会推出活动和优惠！'}}</p>
      </div>
    </div>
    <div class="shop_details_info">
      <div class="options options_bor">
        <i class="icon icon_address_img"></i>
        <div class="item">{{addressShopInfo}}</div>
      </div>
      <div class="options options_bor">
        <i class="icon icon_distribution"></i>
        <div class="item">由商家指定配送服务(UU跑腿/快递)</div>
      </div>
      <div class="options" style="border:none">
        <i class="icon icon_shop_time"></i>
        <div class="item">{{shopInfoList.OpenTime}}</div>
      </div>
      <div class="shop_info_list">
        <div class="shop_tel" @click="tel">
          <i class="icon icon_shop_tel icon_info"></i>
          <p>商家电话</p>
        </div>
        <div class="shop_wx" @click="copyWx">
          <i class="icon icon_shop_wx icon_info"></i>
          <p>商家微信</p>
        </div>
      </div>
    </div>
    <div class="shop_share_btn">
      <div class="shop_share_btn_body">
        <p>感觉店内东东不错，告诉小伙伴吧！</p>
        <div class="share_friend" @click="share">
          <span>分享给好友</span>
          <i class="icon double_arrow"></i>
        </div>
      </div>
    </div>
    <div class="share_mask" v-if="maskActive" @click="maskActive = false"></div>
    <div class="share_card" :class="{share_card_active:maskActive}">
      <div class="share_card_btn">
        <div class="btn_item">
          <i class="icon icon_share_wx btn_img "></i>
          <p>发给好友</p>
          <button class="btn_send" plain="true" open-type="share"></button>
        </div>
        <div class="btn_item" @click="shareQR">
          <i class="icon icon_share_qr btn_img"></i>
          <p>二维码分享</p>
        </div>
      </div>
      <div class="cancel" @click="maskActive = false">取消</div>
    </div>
    <div class="saveImg" v-if='shareCard'>
      <div class="main">
        <canvas canvas-id='myCanvas'></canvas>
        <div class="shareCover">
          <img @click='shareClose' class="icon icon_close" src="https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_close.png" />
          <img @click='saveImg' class="saveBtn" src="../../../static/saveImg.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        shopInfoList: {},
        maskActive: false, //分享mask
        shareCard: false, //分享图片
        shopInfoList: {
          ShopName: ''
        }, //店铺信息
        QrCodeUrl: '', //小程序码
        shareBg: '',
        Logo: 'https://otherfiles-ali.uupt.com/Stunner/logo-C-R.png?x-oss-process=image/resize,w_100/format,jpg',
        minShopLogo: '',
      }
    },
    onShareAppMessage(res) {
      return {
        title: this.shopInfoList.ShopName,
        path: `pages/my-store/main?ShopId=${String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId')}&temp=2`,
        imageUrl: this.shopInfoList.Logo + '?x-oss-process=image/resize,w_400/format,jpg',
        success: res => {
          this.maskActive = false;
        },
        fail: err => {
          this.msg('您已取消分享')
          this.maskActive = false;
        }
      }
    },
    onReady() {
      this.shopInfoList = {};
      this.shopInfo()
    },
    onShow() {
      this.shareCard = false;
      this.maskActive = false;
      this.shopInfoList = {
        ShopName: ''
      };
      this.QrCodeUrl = this.shareBg = this.minShopLogo = '';
    },
    methods: {
      //店铺信息
      shopInfo() {
        this.util.post({
          url: '/api/Customer/Browse/GetShopInfo',
          data: {
            //分享二维码获取  商品详情获取 this.ShopId || wx.getStorageSync('ShopId')
            shopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
          }
        }).then(res => {
          res.Body.OpenTime = String(this.util.openTime(res.Body.OpenTime));
          this.shopInfoList = res.Body;
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      share() {
        this.maskActive = true;
      },
      shareQR() {
        if (wx.getStorageSync('loginInfo').IsBindPhone == 0) {
          this.msg('您还没有登录哦')
          wx.redirectTo({
            url: `/pages/login/main`
          })
          return;
        }
        this.maskActive = false; //底部分享按钮
        wx.showLoading({
          title: '生成中',
          mask: true
        })
        this.util.post({
          url: '/api/Customer/Common/CreateWxOpenQrCode',
          data: {
            CodeType: 2,
            CodeValue: String(wx.getStorageSync('shopInfo').ShopId) || '',
            RequestType: 2
          }
        }).then(res => {
          this.QrCodeUrl = res.Body.QrCodeUrl;
          // Promise.all([this.downImg(this.QrCodeUrl),
          //     this.downImg(this.Logo),
          //     this.downImg(this.shopInfoList.Logo),
          //     this.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/shareCard.png')
          // ]).then(res=>{
          //     console.log(res,111)
          // }).catch(err=>{
          //     console.log(err,222)
          // })
          this.requireImg().catch(err => {
            this.msg('图片地址获取失败')
          })
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      downImg(val) {
        return new Promise((resolve, reject) => {
          if (val.indexOf('wxfile://') == -1) {
            wx.downloadFile({
              url: val,
              success: res => {
                resolve(res.tempFilePath)
              },
              fail: err => {
                reject(err)
              }
            })
          } else {
            resolve(val)
          }
        })
      },
      async requireImg() {
        this.QrCodeUrl = await this.downImg(this.QrCodeUrl)
        // this.Logo = await this.downImg(this.Logo)
        this.minShopLogo = await this.downImg(this.shopInfoList.Logo + '?x-oss-process=image/resize,w_200/format,jpg');
        this.shareBg = await this.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/shop-card-bg.png');
        this.drawCanvas();
      },
      /* 绘制canvas */
      drawCanvas() {
        let pixelRatio = '';
        let windowWidth = '';
        let windowHeight = '';
        wx.getSystemInfo({
          success: res => {
            pixelRatio = res.pixelRatio;
            windowWidth = res.windowWidth;
            windowHeight = res.windowHeight;
          }
        })
        // 默认像素比
        // let pixelRatio = this.pixelRatio;
        // 屏幕系数比，以设计稿375*667（iphone7）为例
        let XS = windowWidth / 375;
        const ctx = wx.createCanvasContext('myCanvas');
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, 339 * XS, 522 * XS)
        /* 背景图 */
        ctx.drawImage(this.shareBg, 0 * XS, 0 * XS, 280 * XS, 466 * XS)
        /* 店铺logo */
        ctx.save()
        ctx.beginPath()
        ctx.arc((116 + 44 / 2) * XS, (42 + 44 / 2) * XS, (44 * XS) / 2, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(this.minShopLogo, 116 * XS, 42 * XS, 44 * XS, 44 * XS);
        ctx.restore()
        //店铺名字
        ctx.setFontSize(14 * XS);
        ctx.setFillStyle('#4c2901')
        ctx.setTextAlign('center');
        this.fontLineFeed(ctx, this.shopInfoList.ShopName, 16, 18 * XS, 138 * XS, 110 * XS)
        /* 二维码 */
        ctx.drawImage(this.QrCodeUrl, 86 * XS, 242 * XS, 108 * XS, 108 * XS)
        ctx.draw()
        wx.hideLoading()
        this.shareCard = true; //分享图展示
      },
      shareClose() {
        this.shareCard = false;
        wx.hideLoading()
      },
      // 文字换行
      /**
       * ctx,画布对象
       * str,需要绘制的文字
       * splitLen,切割的长度字符串
       * strHeight,每行文字之间的高度
       * x,位置
       * y
       */
      fontLineFeed(ctx, str, splitLen, strHeight, x, y) {
        let strArr = [];
        for (let i = 0, len = str.length / splitLen; i < len; i++) {
          strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
        }
        if (str.length > splitLen) {
          strArr[0] = strArr[0] + '...';
        }
        // console.log(strArr[0])
        // let s = 0;
        // for (let j = 0, len = strArr.length; j < len; j++) {
        //     s = s + strHeight;
        //     ctx.fillText(strArr[j], x, y + s);
        // }
        ctx.fillText(strArr[0], x, y);
      },
      /* 保存图片 */
      saveImg() {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: res => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: res => {
                wx.showToast({
                  title: '图片保存成功',
                  icon: 'success',
                  duration: 800
                })
                this.shareCard = false;
              },
              fail: err => {
                console.log('店铺保存相册取消')
                this.util.phModel()
              }
            })
          }
        })
      },
      tel() {
        wx.makePhoneCall({
          phoneNumber: this.shopInfoList.ShopMobile
        })
      },
      copyWx() {
        if (this.shopInfoList.ShopWechat == "") {
          this.msg('商家未提供微信联系方式')
        } else {
          wx.setClipboardData({
            data: this.shopInfoList.ShopWechat,
            success: res => {
              this.msg("复制成功")
            },
            fail: err => {
              this.msg("复制失败")
            }
          })
        }
      },
    },
    watch: {},
    computed: {
      addressShopInfo: function() {
        return this.shopInfoList.ShopAddress ? this.shopInfoList.ShopAddress.split('($)').join(' ') : '';
      },
    },
    onUnload() {}
  }
</script>

<style lang="less">
  .shop_details {
    overflow: hidden;
    background: #fff;
    height: 100%;
    position: relative;
    .title {
      margin: 20rpx 36rpx 0;
      font-size: 46rpx;
      font-weight: 700;
    }
    .details_bor:after {
      content: '';
      display: block;
      width: 100%;
      height: 0;
      border-bottom: 1px solid #ebebeb;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: scaleY(0.5);
      transform-origin: 0 0;
    }
    .store_banner {
      position: relative;
      padding: 60rpx 0;
      margin: 0 35rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .shop_img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }
      .shop_right_details {
        flex: 1;
        overflow: hidden;
        .shop_name {
          color: #1a1a1a;
          font-size: 36rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 42rpx;
          padding: 0 8rpx;
          flex: 1;
          margin-bottom: 6rpx;
        }
        .shop_tips {
          color: #999;
          font-size: 24rpx; // white-space: nowrap;
          // text-overflow: ellipsis;
          // overflow: hidden;
          line-height: 42rpx;
          padding: 0 8rpx;
          flex: 1;
          display: -webkit-box !important;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
      .share {
        position: absolute;
        top: 0;
        right: 22rpx;
        width: 86rpx;
        height: 86rpx;
      }
    }
    .shop_details_info {
      height: 100%;
      background: #fff;
      overflow: hidden;
      .options {
        padding: 35rpx 0;
        background: #fff;
        display: flex;
        margin: 0 35rpx;
        position: relative;
        .label {
          font-size: 28rpx;
          color: #5e5e5e;
          white-space: nowrap;
          font-weight: 900;
          width: 160rpx;
        }
        .item {
          flex: 1;
          font-size: 28rpx;
          color: #444;
          line-height: 40rpx;
          margin-left: 16rpx;
        }
        i {
          margin-top: 4rpx;
        }
      }
      .options_bor:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-bottom: 1px solid #ebebeb;
        position: absolute;
        bottom: 0;
        left: 0;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      .shop_info_list {
        display: flex;
        padding: 0 35rpx 20rpx;
        align-items: center;
        background: #fff;
        .shop_tel,
        .shop_wx {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          height: 84rpx;
          border-radius: 8rpx;
          .icon_info {
            width: 30rpx;
            height: 30rpx;
            margin-right: 8rpx;
          }
          p {
            font-size: 28rpx;
            color: #444;
          }
        }
        .shop_tel {
          margin-right: 20rpx;
        }
      }
    }
  }
  .shop_share_btn {
    width: 100%;
    box-sizing: border-box;
    padding: 0 35rpx;
    position: absolute;
    bottom: 40rpx;
    .shop_share_btn_body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #ed533d;
      height: 100rpx;
      p {
        padding-left: 20rpx;
        font-size: 28rpx;
        color: #fff;
        white-space: nowrap;
      }
      .share_friend {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx;
        background: #fff;
        border-radius: 6rpx;
        margin-right: 20rpx;
        height: 62rpx;
        span {
          white-space: nowrap;
          color: #ed533d;
          font-size: 24rpx;
          margin-right: 10rpx;
        }
      }
    }
  }
  .share_card {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #ccc;
    transform: translateY(100%);
    transition: transform 0.4s ease;
    z-index: 30;
    .share_card_btn {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 58rpx 30rpx 50rpx;
      box-sizing: border-box;
      background: #f0f0f0;
      .btn_item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        .btn_img {
          width: 96rpx;
          height: 96rpx;
          margin-bottom: 40rpx;
        }
        p {
          color: #555555;
          font-size: 28rpx;
          text-align: center;
          line-height: 28rpx;
        }
        .btn_send {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: none;
        }
      }
    }
    .cancel {
      width: 100%;
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      color: #555;
      font-size: 30rpx;
      background: #fff;
    }
  }
  .share_card_active {
    transform: translateY(0);
  }
  .button-hover {
    background: transparent;
  }
  .saveImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    box-sizing: border-box;
    z-index: 50;
    .shareCover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .icon_close {
      position: absolute;
      top: -22rpx;
      right: -18rpx;
      z-index: 100;
    }
    .saveBtn {
      position: absolute;
      bottom: 30rpx;
      left: 30rpx;
      width: 556rpx;
      height: 88rpx;
      z-index: 100;
    }
    .main {
      border-radius: 10rpx;
      background: #f2f2f2;
      width: 616rpx;
      height: 1118rpx;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      padding: 30rpx;
      box-sizing: border-box;
    }
    canvas {
      background: #fff;
      width: 100%;
      height: 932rpx;
    }
  }
  .share_mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
    transition: all 0.1s ease;
  }
</style>
