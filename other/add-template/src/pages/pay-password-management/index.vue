<template>
  <div class="container">
    <div class="list-main">
      <div class="list-item  border-bottom" @click="editPass">
        <p>支付密码修改</p>
        <i class="icon icon_arrowRight"></i>
      </div>
      <div class="list-item" @click="forgetPass">
        <p>忘记支付密码</p>
        <i class="icon icon_arrowRight"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    editPass() {
      wx.redirectTo({
        url: "/pages/edit-pay-password/main"
      });
    },
    forgetPass() {
      wx.redirectTo({
        url: "/pages/forget-pay-password/main"
      });
    }
  },
  components: {}
};
</script>

<style lang="less">
.container {
  height: 100%;
  background: #fff;
  overflow: hidden;
  .list-main{
    background: #fff;
    padding:0  35rpx;
    .list-item{
      padding: 35rpx 0;
      display: flex;
      align-items: center;
      position: relative;
      p {
        flex: 1;
        font-size: 28rpx;
        margin-left:20rpx;
        color: #1a1a1a;
      }
      .icon {
        width: 25rpx;
        height: 25rpx;
      }
    }
  }
}
.border-bottom{
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
</style>
