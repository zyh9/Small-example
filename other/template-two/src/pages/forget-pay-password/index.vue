<template>
    <div class="container">
        <div class="list-main ">
            <div class="list-item ">
                <p>手机号</p>
                <input type="number" maxlength="11" placeholder="请输入手机号码" placeholder-class='placeholderStyle' v-model="tel">
            </div>
            <div class="list-item ">
                <p>验证码</p>
                <input type="number" placeholder="请输入验证码" placeholder-class='placeholderStyle' v-model="code" maxlength="4">
                <!-- <button class="sms_click" plain="true" :disabled='time>0' @click='sendCode'>{{countdownInfo}}</button> -->
                <div class="sms_click" @click='sendCode'>{{countdownInfo}}</div>
            </div>
            <div class="list-item ">
                <p>设置密码</p>
                <input type="number" password='true' maxlength="6" placeholder="6位数字" placeholder-class='placeholderStyle' v-model="password">
            </div>
            <div class="list-item ">
                <p>再次输入</p>
                <input type="number" password='true' maxlength="6" placeholder="请再输入一遍" placeholder-class='placeholderStyle' v-model="againPassword">
            </div>
        </div>
        <div class="btn" :class="{on:isAll}" @click="submit">提交</div>
    </div>
</template>

<script>
    import gcoord from 'gcoord';
    export default {
        data() {
            return {
                countdownInfo: '获取验证码',
                time: null,
                createTiem: null,
                tel: '',
                code: '',
                password: '',
                againPassword: '',
                type: '',
                shopInfo: {},
                isSend: true
            };
        },
        onShow() {
            if (wx.getStorageSync('purseInfo').ManagerPhone) {
                this.tel = wx.getStorageSync('purseInfo').ManagerPhone;
            }
            clearInterval(this.createTiem)
            this.code = '';
            this.password = '';
            this.againPassword = '';
            this.countdownInfo = '获取验证码';
            this.createTiem = null;
            this.isSend = true;
        },
        mounted() {
            this.type = this.$mp.query.type; /* 1:绑定银行卡进入；2：忘记密码进入 */
            this.shopInfo = wx.getStorageSync('shopInfo');
        },
        methods: {
            sendCode() {
                if (!this.isSend) {
                    return
                }
                if (this.tel == '') {
                    this.msg('手机号不能为空');
                    return;
                }
                var regTel = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!regTel.test(this.tel)) {
                    this.msg('请输入有效手机号')
                    return
                };
                this.time = 60;
                this.isSend = false;
                this.util.post({
                    url: '/api/Customer/VerifyCode/SendSmsCode',
                    data: {
                        Mobile: this.tel,
                        BizType: 9,
                        ShopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.countdownInfo = this.time + 'S后重新获取'
                        this.createTiem = setInterval(_ => {
                            this.time--;
                            if (this.time > 0) {
                                this.countdownInfo = this.time + 'S后重新获取'
                            } else {
                                this.isSend = true;
                                clearInterval(this.createTiem);
                                this.countdownInfo = '重新获取';
                            }
                        }, 1000)
                    }
                }).catch(err => {
                    this.isSend = true;
                    this.msg(err.Msg)
                })
            },
            submit() {
                if(this.tel.length<11){
                    this.msg('请输入手机号');
                    return;
                }
                if (this.code.length == 4) {
                    if (this.password.length == 6) {
                        if (this.againPassword.length == 6) {
                            if (this.password != this.againPassword) {
                                this.msg('支付密码输入不一致')
                            } else {
                                let QQmap = wx.getStorageSync('QQmap');
                                var result = gcoord.transform(
                                    [QQmap.longitude, QQmap.latitude], // 经纬度坐标
                                    gcoord.WGS84, // 当前坐标系
                                    gcoord.BD09 // 目标坐标系
                                );
                                console.log(result)
                                this.util.post({
                                    url: '/api/Customer/VerifyCode/CommitSmsCode',
                                    data: {
                                        Mobile: this.tel,
                                        BizType: 9,
                                        VerifyCode: this.code,
                                        Loction: `${result[0]},${result[1]}`,
                                        CityName: QQmap.city,
                                        PassWord: this.password,
                                        wxUserInfo: '',
                                        ShopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                                    }
                                }).then(res => {
                                    this.msg(res.Msg)
                                    setTimeout(_ => {
                                        wx.navigateBack({
                                            delta: 1
                                        });
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
                } else {
                    this.msg('请输入验证码')
                }
            },
        },
        components: {},
        computed: {
            isAll() {
                return this.tel.length == 11 && this.code.length == 4 && this.password.length == 6 && this.againPassword.length == 6 ? true : false;
            }
        }
    };
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #fff;
        overflow: hidden;
        .list-main {
            background: #fff;
            padding: 0 35rpx;
            .list-item {
                padding: 35rpx 0;
                display: flex;
                align-items: center;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0;
                }
                p {
                    width: 134rpx;
                    font-size: 28rpx;
                    color: #1a1a1a;
                }
                input {
                    flex: 1;
                    flex: 1;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    padding-right: 20rpx;
                    line-height: 34rpx;
                }
                .placeholderStyle {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 34rpx;
                }
                .sms_click {
                    // margin-right: 20rpx;
                    height: 50rpx;
                    line-height: 50rpx;
                    font-size: 24rpx;
                    color: #ff4d3a;
                    background: transparent;
                    border: 1px solid #ff4d3a;
                    border-radius: 6rpx;
                    outline: none;
                    white-space: nowrap;
                    padding: 0 10rpx;
                }
            }
        }
        .btn {
            margin: 0 36rpx;
            height: 88rpx;
            line-height: 88rpx;
            border-radius: 6rpx;
            text-align: center;
            font-size: 28rpx;
            color: #fff;
            margin-top: 56rpx;
            background: #ccc;
            &.on {
                background: #000;
            }
        }
    }
</style>
