<template>
    <div class="vip_recharge">
        <div class="recharge_con">
            <div class="info">
                <i class="icon icon_price" v-if="tips"></i>
                <p>{{tips}}</p>
            </div>
            <ul class="recharge_list" v-if="rechargeList&&rechargeList.length">
                <li v-for="(v,i) in rechargeList" :key="i" :class="{active:lisActive==i}" @click="selectMoney(i)">{{v.RechargeMoney}}<span>元</span></li>
                <li @click="selectMoney(-1)" :class="{active_other:lisActive==-1}"><input type="number" placeholder="其他金额" maxlength="5" class="other" placeholder-style="color:#ccc;" v-model="inpMoney" /></li>
            </ul>
        </div>
        <div class="recharge_bot">
            <div class="bot_left">
                <span>合计:</span><i>¥</i><b>{{MoneySum}}</b>
            </div>
            <button class="sum" plain="true" @click="MoneyRecharge">立即充值</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                lisActive: 0,
                rechargeList: [],
                tips: '',
                payOnoff: true,
                MoneySum: 0,
                inpMoney:'',
            }
        },
        onReady() {
            this.rechargeList = [];
            this.payOnoff = true;
            this.getRecharge()
        },
        methods: {
            getRecharge() {
                this.util.post({
                    url: '/api/Customer/VipMember/GetVipRechargeRule',
                    data: {
                        ShopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                    }
                }).then(res => {
                    this.rechargeList = res.Body;
                    this.tips = this.rechargeList[0].NoticeMessage;
                    this.MoneySum = this.rechargeList[0].RechargeMoney;
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            MoneyRecharge() {
                if (this.payOnoff) {
                    this.payOnoff = false;
                    this.util.post({
                        url: '/api/Customer/VipMember/VipRecharge',
                        data: {
                            ShopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                            VipNo: wx.getStorageSync('vipUserInfo').VipNo || '',
                            RechargeMoney: 10
                        }
                    }).then(res => {
                        wx.requestPayment({
                            timeStamp: res.Body.timeStamp,
                            nonceStr: res.Body.nonceStr,
                            package: res.Body.package,
                            signType: res.Body.signType,
                            paySign: res.Body.paySign,
                            success: payres => {
                                this.payOnoff = true;
                                console.log(payres)
                                wx.redirectTo({
                                    url: `/pages/pay-ok/main?money=${this.val}&shopName=${this.ShopName}&shopId=${this.ShopId}`
                                })
                            },
                            fail: error => {
                                this.payOnoff = true;
                                console.log(error.errMsg)
                                if (error.errMsg == 'requestPayment:fail cancel') {
                                    this.msg('您已取消支付')
                                } else { //支付失败
                                    wx.redirectTo({
                                        url: `/pages/pay-error/main?money=${this.val}&shopName=${this.ShopName}&shopId=${this.ShopId}`
                                    })
                                }
                            }
                        })
                    }).catch(err => {
                        this.payOnoff = true;
                        this.msg(err.Msg)
                    })
                }
            },
            selectMoney(i) {
                // console.log(i)
                this.lisActive = i;
                if (this.rechargeList.length) {
                    if (i == -1) {
                        this.tips = '';
                        this.MoneySum = this.inpMoney?this.inpMoney:0;
                    } else {
                        this.tips = this.rechargeList[i].NoticeMessage;
                        this.MoneySum = this.rechargeList[i].RechargeMoney;
                    }
                }
            }
        },
        computed: {},
        watch: {
            inpMoney:function(newVal,oldVal){
                this.MoneySum = newVal;
            }
        }
    }
</script>

<style lang="less">
    page {
        background: #fff;
    }
    .vip_recharge {
        height: 100%;
        position: relative;
        padding-bottom: 136rpx;
        box-sizing: border-box;
        .recharge_con {
            padding: 36rpx;
            box-sizing: border-box;
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            .info {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 40rpx;
                p {
                    font-size: 28rpx;
                    color: #1a1a1a;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                i {
                    transform: translateY(-2rpx);
                }
            }
            .recharge_list {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex-wrap: wrap;
                li {
                    width: 330rpx;
                    height: 110rpx;
                    background-color: #f5f5f5;
                    border-radius: 6rpx;
                    margin-top: 24rpx;
                    font-size: 32rpx;
                    text-align: center;
                    line-height: 110rpx;
                    color: #ccc;
                    font-weight: 700;
                    box-sizing: border-box;
                    border: 1px solid #f5f5f5;
                    span,
                    input {
                        font-weight: 400;
                    }
                }
                .other {
                    height: 110rpx;
                    color: #1a1a1a;
                    text-align: center;
                }
                .active {
                    background-color: #ff4d3a;
                    color: #fff;
                }
                .active_other {
                    border: 1px solid #ff4d3a;
                }
            }
        }
        .recharge_bot {
            width: 100%;
            height: 136rpx;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 5;
            padding: 0 35rpx;
            box-sizing: border-box;
            z-index: 5;
            &:after {
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
            }
            .bot_left {
                flex: 1;
                line-height: 1;
                font-size: 48rpx;
                color: #ff4d3a;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                span {
                    font-size: 30rpx;
                    margin-right: 10rpx;
                    color: #1a1a1a;
                    font-weight: 700;
                }
                i {
                    font-size: 30rpx;
                    margin-right: 6rpx;
                }
                b {
                    transform: translateY(-6rpx);
                }
            }
            .sum {
                width: 232rpx;
                height: 80rpx;
                background-color: #ff4d3a;
                border-radius: 8rpx;
                font-size: 30rpx;
                color: #fff;
                line-height: 80rpx;
                text-align: center;
                border: 0;
            }
        }
    }
</style>
