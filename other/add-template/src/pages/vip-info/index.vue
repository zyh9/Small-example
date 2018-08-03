<template>
  <div class="vip_info">
    <div class="options" @click="editName">
      <p>姓名</p>
      <div class="op_right">
        <span class="info_text">{{vipInfo.Name}}</span>
        <i class="icon icon_arrowRight"></i>
      </div>
    </div>
    <div class="options">
      <p>性别</p>
      <div class="op_right">
        <span class="info_text">{{vipInfo.Sex==1?'男':'女'}}</span>
        <i></i>
      </div>
    </div>
    <div class="options">
      <p>生日</p>
      <div class="op_right">
        <span class="info_text">{{vipInfo.Birthday}}</span>
        <i></i>
      </div>
    </div>
    <div class="options" @click="editTel">
      <p>绑定手机</p>
      <div class="op_right">
        <span class="info_text">{{vipInfo.Mobile}}</span>
        <i class="icon icon_arrowRight"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        vipInfo:{}
      }
    },
    onShow(){
      this.vipInfo = wx.getStorageSync('vipUserInfo');
      // console.log(this.vipInfo)
    },
    methods: {
      editName() {
        wx.navigateTo({
          url: '/pages/edit-name/main'
        })
      },
      editTel(){
         wx.navigateTo({
          url: '/pages/edit-tel/main'
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .vip_info {
    height: 100%;
    box-sizing: border-box;
    padding: 36rpx;
    .options {
      height: 108rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .op_right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info_text {
          flex: 1;
          color: #1a1a1a;
          font-size: 28rpx;
        }
      }
      p {
        width: 140rpx;
        color: #1a1a1a;
        font-size: 28rpx;
      }
      .icon {
        margin-right: 16rpx;
      }
      &:after {
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
    }
  }
</style>
