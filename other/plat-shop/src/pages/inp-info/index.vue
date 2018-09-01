<template>
  <div class="inp_info">
    <h3 class="login">填写会员信息</h3>
    <div class="options">
      <p>姓名</p>
      <input type="text" placeholder="支持数字、汉字、字母和符号" maxlength="16" v-model="vipName">
    </div>
    <div class="options">
      <p>性别</p>
      <div class="sex">
        <div class="sex_lis" v-for="(v,i) in info" :key="i" @click="sexCheck(i)"><i class="icon icon_check" :class="{icon_checked:checkIndex==i}"></i><span>{{v.text}}</span></div>
      </div>
    </div>
    <div class="options">
      <p>生日</p>
      <picker mode="date" @change="DateChange" class="picker">
        <input type="text" placeholder="请选择您的生日" v-model="dateInfo" disabled="true">
      </picker>
    </div>
    <div class="options">
      <p>设置密码</p>
      <input type="number" placeholder="请输入6位数支付密码" maxlength="6" v-model="password" password="true">
    </div>
    <div class="options">
      <p>再次输入</p>
      <input type="number" placeholder="请再输入一遍" v-model="againPassword" maxlength="6" password="true">
    </div>
    <button class="btn" plain="true" hover-class="none" style="color:#fff;" @click="infoOver">下一步</button>
    <p class="tips">注：生日和性别保存后不能进行更改</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        vipName: '',
        info: [{
          text: '男',
          checked: true
        }, {
          text: '女',
          checked: false
        }],
        dateInfo: '', //生日记录
        checkIndex: 0,
        password: '',
        againPassword: '',
      }
    },
    onLoad() {
      this.checkIndex = 0;
      this.info = [{
        text: '男',
        checked: true
      }, {
        text: '女',
        checked: false
      }];
    },
    onReady() {
      this.vipName = wx.getStorageSync('loginInfo') ? wx.getStorageSync('loginInfo').NickName : '';
      this.dateInfo = '';
      this.password = '';
      this.againPassword = '';
    },
    methods: {
      DateChange(e) {
        this.dateInfo = e.mp.detail.value;
      },
      sexCheck(i) {
        // console.log(i)
        this.checkIndex = i;
      },
      infoOver() {
        if (this.vipName.replace(/\s/g, '') == '' && this.dateInfo == '') {
          this.msg('信息还没有填写完整哦')
          return;
        }
        if (this.password.length == 6) {
          if (this.againPassword.length == 6) {
            if (this.password != this.againPassword) {
              this.msg('支付密码输入不一致')
            } else {
              this.util.post({
                url: '/api/Customer/VipMember/CreateVipMember',
                data: {
                  ShopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                  Token: wx.getStorageSync('InpVip').token || '',
                  Mobile: wx.getStorageSync('InpVip').tel || '',
                  Name: this.vipName,
                  Sex: this.checkIndex == 0 ? 1 : 0, //男1，女0
                  Birthday: this.dateInfo || '',
                  TradePwd: this.password || ''
                }
              }).then(res => {
                // console.log(res.Body)
                wx.removeStorageSync('InpVip');
                this.msg("开通会员卡成功")
                setTimeout(_ => {
                  wx.redirectTo({
                    url: `/pages/my-vip/main?isVip=1`
                  })
                }, 800)
              }).catch(err => {
                this.msg(err.Msg)
              })
            }
          } else {
            this.msg(this.againPassword.length < 6 && this.againPassword.length > 0 ? '再次输入支付密码不完整' : '请再次输入支付密码')
          }
        } else {
          this.msg(this.password.length < 6 && this.password.length > 0 ? '输入支付密码不完整' : '请输入支付密码')
        }
      }
    },
    watch: {
      password: function(newVal, oldVal) {
        this.authTel = newVal.replace(/[^\d]/g, '');
      },
      againPassword: function(newVal, oldVal) {
        this.authVal = newVal.replace(/[^\d]/g, '');
      },
    },
    onUnload() {}
  }
</script>

<style lang="less">
  .inp_info {
    height: 100%;
    overflow-x: hidden;
    position: relative;
    .login {
      margin: 20rpx 36rpx;
      font-size: 46rpx;
      font-weight: 700;
    }
    .options {
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 20rpx 0;
      margin: 0 36rpx;
      position: relative;
      .picker {
        flex: 1;
      }
      p {
        width: 130rpx;
        font-size: 28rpx;
        color: #333;
        margin-right: 38rpx;
        transform: translateY(3rpx);
        text-align: justify;
        height: 60rpx;
        line-height: 60rpx;
        &:after {
          content: "";
          display: inline-block;
          width: 100%;
        }
      }
      input {
        flex: 1;
        font-size: 28rpx;
        color: #666;
        height: 60rpx;
      }
      .sex {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .sex_lis {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-right: 50rpx;
          span {
            padding: 0 16rpx;
            font-size: 28rpx;
            color: #333;
          }
        }
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
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 6rpx;
      color: #fff;
      font-size: 30rpx;
    }
    .tips {
      color: #999;
      font-size: 22rpx;
      margin-left: 36rpx;
    }
  }
</style>
