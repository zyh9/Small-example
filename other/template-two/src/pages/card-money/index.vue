<template>
    <div class="card-money">
        <div class="card-money_con">
            <div class="card_info">
                <img src="../../../static/vip-bg.png" alt="">
                <div class="info">
                    <p class="rmb">{{money}}</p>
                    <p class="money">卡内余额(元)</p>
                </div>
            </div>
            <div class="vip_card_bot">
                <div class="recharge" @click="openRecharge">充值</div>
                <div class="options top" @click="payPassword">
                    <p>支付密码管理</p>
                </div>
                <div class="options" @click="moneyDetails">
                    <p>余额消费明细</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                money:0
            }
        },
        onShow() {
            this.money = wx.getStorageSync('vipUserInfo').AccountMoney;
        },
        methods: {
            rotate() {
                this.active = !this.active;
            },
            moneyDetails() {
                wx.navigateTo({
                    url: '/pages/pay-list/main'
                })
            },
            payPassword(){
                wx.navigateTo({
                    url: '/pages/pay-password-management/main'
                })
            },
            openRecharge() {
                wx.navigateTo({
                    url: '/pages/vip-recharge/main'
                })
            },
        },
        computed: {},
    }
</script>

<style lang="less">
    page {
        background: #fff;
    }
    .card-money {
        height: 100%;
        position: relative;
        .card-money_con {
            height: 100%;
            padding: 36rpx 0;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        .card_info {
            width: 726rpx;
            height: 450rpx;
            position: relative;
            margin: 0 auto 28rpx;
            img {
                width: 726rpx;
                height: 450rpx;
            }
            .info {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                .rmb {
                    font-size: 72rpx;
                    color: #1a1a1a;
                }
                .money {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }
        .vip_card_bot {
            padding: 0 36rpx;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .recharge {
                width: 100%;
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
            }
            .top {
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
        }
        .vip_card_bot_active {
            margin-top: 0;
        }
    }
</style>
