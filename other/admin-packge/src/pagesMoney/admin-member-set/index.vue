<template>
    <div class="admin_dd_set">
        <!-- 编辑信息 -->
        <div class="emit">
            <div class="main">
                <div class="option">
                    <div class="label" style="width:250rpx;">会员卡开关</div>
                    <div class="item">
                        <switch @change="open" :checked="config.IsOpen == 1 ? true : false" class="witch" />
                    </div>
                </div>
                <div class="option" @click="typeSelect(1)">
                    <div class="label">卡类型</div>
                    <div class="item">
                        <p>充值卡</p>
                    </div>
                </div>
                <div class="option" @click="typeSelect(2)">
                    <div class="label">充值规则</div>
                    <div class="item">
                        <p v-if="type">{{type}}</p>
                        <i class="icon icon_arrowRight"></i>
                    </div>
                </div>
                <div class="option" @click="typeSelect(3)">
                    <div class="label">卡样式</div>
                    <div class="item">
                        <p v-if="type">{{type}}</p>
                        <i class="icon icon_arrowRight"></i>
                    </div>
                </div>
                <div class="option" @click="typeSelect(4)">
                    <div class="label">卡信息</div>
                    <div class="item">
                        <p v-if="type">{{type}}</p>
                        <i class="icon icon_arrowRight"></i>
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
                name: '',
                tel: '',
                type: '',
                state: 0,
                Id: null,
                config: {},
            }
        },
        onShow() {
            this.ShopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.getConfig();
        },
        mounted() {

        },
        methods: {
            //开关
            open(e) {
                this.config.IsOpen = e.target.value ? 1 : 0;
                this.util.post({
                    url: '/api/Merchant/VipMember/ChangeVipConfig',
                    data: {
                        ShopId: this.ShopId,
                        VipStatus: this.config.IsOpen ? 1 : 0
                    }
                }).then(res => {
                    // console.log(res);
                    if(res.State == 1) {
                        this.msg('修改成功');
                    }else {
                        this.msg(res.Msg);
                        this.config.IsOpen = !e.target.value ? 1 : 0;
                    }
                }).catch(err => {
                    this.msg(err.Msg);
                    this.config.IsOpen = !e.target.value ? 1 : 0;
                })
            },
            //获取配置信息
            getConfig() {
                this.util.post({
                    url: '/api/Merchant/VipMember/GetVipConfig',
                    data: {
                        ShopId: this.ShopId
                    }
                }).then(res => {
                    // console.log(res);
                    if(res.State == 1) {
                        this.config = res.Body;
                    }else {
                        this.msg(res.Msg);
                    }
                }).catch(err => {
                    this.msg(err.Msg);
                });
            },
            //充值规则
            typeSelect(type) {
                let Link = '';
                switch(type) {
                    case 1:
                        return
                        break;
                    case 2:
                        Link = '/pagesMoney/admin-member-config'
                        break;
                    case 3:
                        Link = '/pagesMoney/admin-member-style'
                        break;
                    case 4:
                        Link = '/pagesMoney/admin-member-info'
                        break;
                }
                wx.navigateTo({
                    url: Link
                });
            }
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
                    height:110rpx;
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
                        color: #1a1a1a;
                        // padding: 36rpx 0;
                        width: 150rpx;
                        
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
                            text-align:left;
                            flex:1;
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
                            text-align:left;
                            flex:1;
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
