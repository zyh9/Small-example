<template>
    <div class="admin_dd_set">
        <!-- 编辑信息 -->
        <div class="emit">
            <div class="main">
                <div class="option" v-for="(v,i) in infos" :key="i">
                    <div class="label">{{v.Name}}</div>
                    <div class="item">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ShopId: '',
                infos: []
            }
        },
        onShow() {
            this.ShopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.getInfo();
        },
        mounted() {},
        methods: {
            //获取卡信息
            getInfo() {
                this.util.post({
                    url: '/api/Merchant/VipMember/GetVipInfos',
                    data: {
                        ShopId: this.ShopId
                    }
                }).then(res => {
                    this.infos = res.Body;
                }).catch(err => {
                    this.msg(err.Msg);
                })
            },
        },
        components: {},
        watch: {},
    }
</script>

<style lang="less">
    .admin_dd_set {
        background: #eeeef4;
        padding-bottom: 102rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .emit {
            .main {
                background: #fff;
                .option {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-left: 36rpx;
                    padding-right: 36rpx;
                    position: relative;
                    height: 110rpx;
                    &::after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-bottom: 1PX solid #ebebeb;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                    &:last-child {
                        &::after {
                            display: none;
                        }
                    }
                    .label {
                        font-size: 30rpx;
                        color: #1a1a1a; // padding: 36rpx 0;
                        // width: 250rpx;
                        width: 100%;
                        text-align: left;
                    }
                    .item {
                        display: flex;
                        font-size: 30rpx;
                        color: #1a1a1a;
                        flex: 1;
                        align-items: center;
                        justify-content: flex-end;
                        div {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            margin-left: 25rpx;
                            .icon {
                                margin-right: 10rpx;
                                vertical-align: middle;
                            }
                        }
                        input {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            line-height: 34rpx;
                            text-align: left;
                            flex: 1;
                        }
                        .placeholderStyle {
                            font-size: 30rpx;
                            color: #ccc;
                            line-height: 34rpx;
                        }
                        .icon {
                            margin-left: 20rpx;
                        }
                        p {
                            font-size: 30rpx;
                            color: #1a1a1a;
                            line-height: 34rpx;
                            text-align: right;
                        }
                        span {
                            font-size: 30rpx;
                            color: #ccc;
                            line-height: 34rpx;
                            text-align: left;
                            flex: 1;
                        }
                    }
                }
            }
        }
        .witch {
            transform: scale(0.8);
            margin-right: -20rpx;
        }
    }
</style>
