<template>
  <div class="after_sale">
    <p class="after_sale_title">申请原因</p>
    <div class="con">
      <textarea placeholder="请输入申请原因" maxlength="150" class="note_text" :show-confirm-bar="false" focus="true" v-model="value" />
      <span>{{value.length}}/150</span>
    </div>
    <p class="after_sale_title">上传凭证(3)</p>
    <ul class="img_list">
      <li class="img_lis" v-for="(v,i) in imgUrlList" :key="i" v-if="v!=''">
        <img :src="v" alt="" class="fade_in">
      </li>
      <li class="img_lis add" @click="addImg" v-if="uploadImg">
        <img src="../../../static/upload.png" alt="">
      </li>
    </ul>
    <div class="submit" @click="submit">保存</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '',
        imgUrlList: [],
        uploadImg: true,
      }
    },
    onLoad() {
      this.value = '';
    },
    onShow() {
      let imgUrl = wx.getStorageSync('cutImg') || '';
      if (wx.getStorageSync('cutImg')) {
        this.imgUrlList[this.imgUrlList.length] = imgUrl;
      } else {
        this.imgUrlList = [];
      }
      // console.log(this.imgUrlList)
      let len = this.imgUrlList.filter(e => e != '');
      // console.log(len.length, 111)
      this.uploadImg = len.length < 3 ? true : false;
    },
    methods: {
      submit() {
        this.util.post({
          url: '/api/Customer/Order/ApplyRefund',
          data: {
            OrderId: this.$mp.query.OrderId || '',
            RefundReason: this.value,
            RefundImage1: this.imgUrlList[0] || '',
            RefundImage2: this.imgUrlList[1] || '',
            RefundImage3: this.imgUrlList[2] || ''
          }
        }).then(res => {
          this.msg('申请成功，请等待商家受理');
          setTimeout(_ => {
            wx.navigateBack({
              delta: 1
            })
          }, 800)
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      addImg() {
        wx.navigateTo({
          url: '/pages/upload-img/main'
        })
      }
    },
    computed: {},
    watch: {},
    onUnload() {
      //删除图片缓存信息
      wx.getStorageSync('cutImg') && wx.removeStorageSync('cutImg');
      this.imgUrlList = [];
    }
  }
</script>

<style lang="less">
  .after_sale {
    height: 100%;
    background: #fff;
    padding: 20rpx 36rpx;
    box-sizing: border-box;
    .after_sale_title {
      font-size: 30rpx;
      color: #000;
      font-weight: 700;
      line-height: 100rpx;
    }
    .con {
      position: relative;
      overflow: hidden;
      .note_text {
        font-size: 28rpx;
        color: #666;
        background: #f5f5f5;
        border-radius: 8rpx;
        padding: 17rpx;
        height: 420rpx;
        overflow-x: hidden;
        overflow-y: scroll;
        width: 100%;
        box-sizing: border-box;
      }
      span {
        color: #999;
        position: absolute;
        right: 16rpx;
        bottom: 16rpx;
        font-size: 22rpx;
      }
    }
    .img_list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-bottom: 70rpx;
      .img_lis {
        margin-right: 26rpx;
        img {
          width: 140rpx;
          height: 140rpx;
          border-radius: 6rpx;
        }
      }
    }
    .submit {
      position: fixed;
      bottom: 36rpx;
      left: 36rpx;
      right: 36rpx;
      height: 88rpx;
      background: #333;
      color: #fff;
      text-align: center;
      line-height: 88rpx;
      font-size: 30rpx;
      border-radius: 6rpx;
    }
  }
</style>
