<template>
  <div class="edit_name">
    <div class="options">
      <p>姓名</p>
      <input type="text" placeholder="支持数字、汉字、字母和符号" maxlength="16" v-model="authTel" />
    </div>
    <button class="btn" plain="true" hover-class="none" style="color:#fff;">确认修改</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    components: {}
  }
</script>

<style lang="less">
  .edit_name {
    padding-top: 36rpx;
    box-sizing: border-box;
    height: 100%;
    overflow-x: hidden;
    position: relative;
    .options {
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 20rpx 0;
      margin: 0 36rpx;
      position: relative;
      p {
        font-size: 28rpx;
        color: #333;
        margin-right: 38rpx;
        transform: translateY(3rpx);
      }
      input {
        flex: 1;
        font-size: 28rpx;
        color: #666;
        height: 60rpx;
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
    .btn {
      background: #333;
      margin: 50rpx 36rpx 20rpx;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 8rpx;
      color: #fff;
      font-size: 30rpx;
    }
  }
</style>
