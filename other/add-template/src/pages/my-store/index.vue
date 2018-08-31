<template>
    <div class="store">
        <div class="loading">
            <img src="../../../static/loading.gif" alt="">
            <p>欢迎进入我的小店</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                scene: ''
            }
        },
        onLoad(options) {
            this.scene = options.scene;
            wx.setStorageSync('scene', this.scene);
        },
        onReady() { //进入页面触发，回退不触发
        },
        onShow() { //页面渲染就会触发
            this.util.wxLogin().then(res => {
                // console.log(res)
                //分享有参数，才去解析
                if (this.scene) { //太阳码跳转
                    console.log('太阳码跳转')
                    this.sceneInfo()
                } else { //发送好友跳转
                    console.log('发送好友跳转')
                    let {
                        ShopId,
                        temp
                    } = this.$root.$mp.query;
                    if (temp == 1) {
                        wx.redirectTo({
                            url: `/pages/food-store/main?ShopId=${ShopId}`
                        })
                    } else {
                        wx.redirectTo({
                            url: `/pages/business/main?ShopId=${ShopId}`
                        })
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        methods: {
            //二维码信息获取
            sceneInfo() {
                this.util.post({
                    url: '/api/Customer/Browse/GetSceneInfo',
                    data: {
                        Scene: this.scene || ''
                    }
                }).then(res => {
                    let {
                        ShopId,
                        GoodId,
                        ShopTemplateId
                    } = res.Body;
                    ShopId && wx.setStorageSync('ShopId', ShopId);
                    if (ShopTemplateId == 1) {
                        wx.redirectTo({
                            url: `/pages/food-store/main?ShopId=${ShopId}&share=1`
                        })
                    } else {
                        wx.redirectTo({
                            url: `/pages/business/main?ShopId=${ShopId}&share=1`
                        })
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
        },
        computed: {},
    }
</script>

<style lang="less">
    .store {
        height: 100%;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center; // justify-content: center;
    }
    .loading {
        padding-top: 352rpx;
        img {
            width: 218rpx;
            height: 120rpx;
        }
        p {
            margin-top: 12rpx;
            text-align: center;
            font-size: 28rpx;
            color: #999;
        }
    }
</style>
