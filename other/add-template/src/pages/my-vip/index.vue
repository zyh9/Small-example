<template>
    <div class="my_vip" v-if="block">
        <div class="no_vip" v-if="!isVip">
            <div class="vip_con">
                <img class="vip_bg fade_in" src="../../../static/red-vip.png" alt="">
                <div class="vip_card_info">
                    <img :src="shopLogo?shopLogo+'?x-oss-process=image/resize,w_200/format,jpg':''" alt="">
                    <p>{{shopName}}</p>
                </div>
            </div>
            <div class="vip_btn" @click="loginVip">立即成为会员</div>
        </div>
        <div class="is_vip" v-else>
            <div class="vip_card_con">
                <div class="vip_con">
                    <img class="vip_bg fade_in" src="../../../static/red-vip.png" alt="">
                    <div class="vip_card_info">
                        <img :src="shopLogo?shopLogo+'?x-oss-process=image/resize,w_200/format,jpg':''" alt="">
                        <p>{{shopName}}</p>
                    </div>
                </div>
                <canvas class="qrcode" canvas-id="barcode" />
                <p class="qrcode_num">{{info.VipNo}}</p>
                <div class="pay_vip">
                    <i class="icon icon_over"></i>
                    <p>余额支付</p>
                    <i class="icon icon_red_pay"></i>
                </div>
            </div>
            <div class="vip_card_bot" :class="{vip_card_bot_active:active}">
                <div @click="openCartNum" class="open_cart_num">
                    <p class="rmb">{{info.AccountMoney}}</p>
                    <div class="pay_cart_money">
                        <p>卡内余额(元)</p>
                        <i class="icon icon_money_right"></i>
                    </div>
                </div>
                <div class="recharge" @click="openRecharge">充值</div>
                <div class="options" @click="vipInfo">
                    <p>会员信息</p>
                </div>
                <img class="qrcode_bg" src="../../../static/qrcode-bg.png" alt="">
                <img class="qrcode_img" :src="active?qrcodeTop:qrcodeImg" alt="" @click="rotate">
            </div>
        </div>
    </div>
</template>

<script>
    import wxbarcode from 'wxbarcode';
    export default {
        data() {
            return {
                active: false,
                qrcodeImg: require('../../../static/qrcode.png'),
                qrcodeTop: require('../../../static/qrcode-top.png'),
                shopLogo: '',
                shopName: '',
                isVip: false,
                block: false,
                info: {}
            }
        },
        onLoad() {
            this.active = false;
            this.info = {};
            this.shopLogo = wx.getStorageSync('shopInfo').Logo;
            this.shopName = wx.getStorageSync('shopInfo').ShopName;
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.getVipInfo()
        },
        onShow() {},
        methods: {
            getVipInfo() {
                this.util.post({
                    url: '/api/Customer/VipMember/GetVipInfo',
                    data: {
                        ShopId: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                    }
                }).then(res => {
                    wx.hideLoading();
                    this.block = true;
                    this.info = res.Body;
                    this.isVip = res.Body.VipNo == 0 ? false : true;
                    if (res.Body.VipNo != 0) {
                        //生成二维码
                        wxbarcode.barcode('barcode', String(res.Body.VipNo), 358, 154);
                        //存储用户vip信息
                        console.log(res.Body.AccountMoney)
                        wx.setStorageSync('vipUserInfo', {
                            Birthday: this.util.FmtTime(new Date(res.Body.Birthday), 'yyyy-MM-dd'),
                            Mobile: res.Body.Mobile,
                            Name: res.Body.Name,
                            Sex: res.Body.Sex,
                            VipNo: res.Body.VipNo,
                            AccountMoney:res.Body.AccountMoney,
                        })
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            rotate() {
                this.active = !this.active;
            },
            openRecharge() {
                wx.navigateTo({
                    url: '/pages/vip-recharge/main'
                })
            },
            openCartNum() {
                wx.navigateTo({
                    url: '/pages/card-money/main'
                })
            },
            vipInfo() {
                wx.navigateTo({
                    url: '/pages/vip-info/main'
                })
            },
            loginVip() {
                wx.redirectTo({
                    url: '/pages/login-vip/main'
                })
            }
        },
        computed: {},
    }
</script>

<style lang="less">
    page {
        background: #fff;
    }
    .my_vip {
        height: 100%;
        position: relative;
        .no_vip,
        .is_vip {
            height: 100%;
            padding: 36rpx;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: scroll;
            .vip_con {
                width: 100%;
                height: 380rpx;
                position: relative;
                .vip_bg {
                    width: 100%;
                    height: 380rpx;
                }
                .vip_card_info {
                    position: absolute;
                    top: 36rpx;
                    left: 36rpx;
                    width: 400rpx;
                    height: 72rpx;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    img {
                        width: 72rpx;
                        height: 72rpx;
                        margin-right: 12rpx;
                        border-radius: 36rpx;
                    }
                    p {
                        font-size: 40rpx;
                        line-height: 72px;
                        color: #fff;
                    }
                }
            }
            .vip_btn {
                height: 88rpx;
                position: absolute;
                bottom: 0;
                left: 36rpx;
                right: 36rpx;
                margin-bottom: 36rpx;
                background-color: #ff4d3a;
                border-radius: 6rpx;
                font-size: 30rpx;
                line-height: 88rpx;
                text-align: center;
                color: #fff;
            }
        }
        .is_vip {
            padding: 0;
        }
        .vip_card_con {
            background: #fafafa;
            padding: 36rpx 36rpx 0;
            overflow: hidden;
            position: relative;
            z-index: -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            .qrcode {
                width: 358rpx;
                height: 154rpx;
                margin-top: 50rpx;
            }
            .qrcode_num {
                line-height: 30rpx;
                font-size: 28rpx;
                color: #666;
                text-align: center;
                height: 30rpx;
                margin-top: 12rpx;
            }
            .pay_vip {
                height: 36rpx;
                display: flex;
                align-items: center;
                margin: 56rpx 0 60rpx;
                .icon_over {
                    width: 34rpx;
                    height: 34rpx;
                }
                p {
                    font-size: 28rpx;
                    color: #ff4d3a;
                }
            }
        }
        .vip_card_bot {
            transition: margin 0.5s ease;
            margin-top: -580rpx;
            background-color: #fff;
            padding: 36rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .open_cart_num {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 36rpx;
            }
            .rmb {
                font-size: 72rpx;
                color: #1a1a1a;
            }
            .pay_cart_money {
                height: 36rpx;
                display: flex;
                align-items: center;
                p {
                    font-size: 24rpx;
                    color: #999;
                }
            }
            .recharge {
                width: 478rpx;
                height: 88rpx;
                background-color: #ff4d3a;
                border-radius: 6rpx;
                font-size: 30rpx;
                color: #fff;
                line-height: 88rpx;
                text-align: center;
                margin-bottom: 56rpx;
            }
            .options {
                background: url('../../../static/black-right.png') no-repeat right center;
                background-size: 15rpx 25rpx;
                height: 140rpx;
                display: flex;
                align-items: center;
                width: 100%;
                position: relative;
                margin-bottom: 80rpx;
                p {
                    color: #1a1a1a;
                    font-size: 28rpx;
                }
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
                &:before {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    left: 0;
                    top: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    z-index: 10;
                }
            }
            .qrcode_bg {
                width: 100%;
                height: 100rpx;
                position: absolute;
                top: -50rpx;
                left: 0;
                z-index: 5;
            }
            .qrcode_img {
                width: 118rpx;
                height: 118rpx;
                position: absolute;
                right: 40rpx;
                top: -26rpx;
                transform-origin: center;
                transform: rotate(0deg);
                transition: transform 0.5s ease;
                z-index: 10;
            }
            .rotate_deg {
                transform: rotate(180deg);
            }
        }
        .vip_card_bot_active {
            margin-top: 0;
        }
    }
</style>
