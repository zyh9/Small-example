<template>
    <div class="container">
        <div class="main">
            <ul class="platSum">
                <li class="set-flex set-between set-align">
                    <div class="item set-flex ">
                        <img class="fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/VipCardStyle/memberManage.png" alt="">
                        <div>
                            <p class="tit">会员管理</p>
                            <p class="text">会员列表，会员余额查询等</p>
                        </div>
                    </div>
                    <div class="look" @click='goLink(1)'>查看</div>
                </li>
                <li class="set-flex set-between set-align">
                    <div class="item set-flex ">
                        <img class="fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/VipCardStyle/memberAd.png" alt="">
                        <div>
                            <p class="tit">会员卡管理</p>
                            <p class="text">会员卡配置，会员级别配置</p>
                        </div>
                    </div>
                    <div class="look" @click='goLink(2)'>查看</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                flag:false
            }
        },
        onShow() {
            // this.getData();
        },
        methods: {
            getData() {
                this.util.post({
                    url:''
                })
            },
            goLink(type) {
                let link = '';
                switch (type) {
                    case 1:
                        link='/pagesMoney/admin-member-list'
                        break;
                    case 2:
                        //判断权限
                        // if(!flag) {
                        //     this.msg('无权限');
                        //     return
                        // }
                        link='/pagesMoney/admin-member-set'
                        break;
                }
                wx.navigateTo({
                    url: link
                })
            },
        }
    }
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #fff;
    }    
    .main {
        padding: 0 17rpx 0 36rpx;
        box-sizing: border-box;
        .platSum {
            overflow: hidden;
            // padding-left: 30rpx;
            box-sizing: border-box;
            background: #fff;
            li {
                // padding-right: 9rpx;
                height: 142rpx;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                &:last-child {
                    &::after {
                        display: none;
                    }
                }
                .item {
                    img {
                        width: 78rpx;
                        height: 78rpx;
                        margin-right: 20rpx;
                    }
                    .tit {
                        font-size: 28rpx;
                        color: #1a1a1a;
                        font-weight: 900;
                    }
                    .text {
                        margin-top: 8rpx;
                        font-size: 20rpx;
                        color: #999;
                    }
                }
                .look {
                    width: 160rpx;
                    height: 92rpx;
                    background: url('../../../static/look.png') no-repeat;
                    background-size: 100%;
                    line-height: 92rpx;
                    font-size: 22rpx;
                    color: #fff;
                    text-align: center;
                }
            }
        }
    }
</style>
