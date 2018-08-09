<template>
    <div class="container">
        <div class="memberBox">
            <div class="memberItem" v-for="(v, i) in list" :key="i" @click="selectImg(v,i)">

                <div class="memberItemTit" v-if="v.StyleType == 1">
                    <span>{{v.Name}}</span>
                    <i class="icon icon_adminCheck" :class="{icon_adminChecked:v.IsSelected}"></i>
                </div>
                <div class="memberItemTit" v-if="v.StyleType == 2">
                    <span>{{v.Name}}</span>
                    <i class="icon icon_adminCheck" :class="{icon_adminChecked:v.IsSelected}"></i>
                </div>

                <div class="logo" v-if="v.StyleType == 1">
                    <img class="fade_in" :src="ShopLogo+'?x-oss-process=image/resize,w_400/format,jpg'">
                </div>
                <img class="fade_in" v-if="v.StyleType == 1" :src="v.CardImage+'?x-oss-process=image/resize,w_400/format,jpg'">

                <div v-if="v.CardImage && v.StyleType == 2" class="logo"  @click.stop="emitStyle">
                    <img class="fade_in" :src="ShopLogo+'?x-oss-process=image/resize,w_400/format,jpg'">
                </div>
                <img class="fade_in" v-if="v.CardImage && v.StyleType == 2"  @click.stop="emitStyle" :src="v.CardImage+'?x-oss-process=image/resize,w_400/format,jpg'">
                
                <div v-if="v.CardImage == '' && v.StyleType == 2" class="defaultImg"  @click.stop="emitStyle">
                    <i class="icon icon_add"></i>
                    <p>自己上传</p>
                </div>

            </div>
        </div>

        <div class="handler">
            <div class="btn on btnl" @click="cancel">取消</div>
            <div class="btn on btnr" @click="save">保存</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ShopId: '',
            ShopLogo: '',
            list: [],
            custom: {

            },
            customImg: ''
        }
    },
    onUnload() {
        // console.log('unload');
        wx.removeStorageSync('cutImg6');
        this.list = [];
    },
    onReady() {
        // console.log('onReady');
        // this.getConfig();
    },
    onShow() {
        // console.log('onshow');
        wx.showLoading({
            title: '加载中',
        })
        this.customImg = '';
        this.ShopId = wx.getStorageSync('loginInfo').ShopID || '';
        this.ShopLogo = wx.getStorageSync('shopInfo').ShopLogo || '';
        this.getStyle();
    },
    methods: {
        //获取样式数据
        getStyle() {
            this.util.post({
                url: '/api/Merchant/VipMember/GetVipCardStyle',
                data: {
                    ShopId: this.ShopId
                }
            }).then(res => {
                // console.log(res)
                this.list = res.Body;
                let arr = this.list.filter( v=> v.StyleType == 2);
                if(arr.length) {
                    // console.log('有自定义数据')
                    this.list.forEach(ele => {
                        if(ele.StyleType == 2) {
                            ele.CardImage = wx.getStorageSync('cutImg6') ? wx.getStorageSync('cutImg6') : ele.CardImage;
                        }
                    })
                }else {
                    this.list.push({
                        CardImage: wx.getStorageSync('cutImg6') ? wx.getStorageSync('cutImg6') : '',
                        Id:0,
                        Name:"",
                        StyleType:2
                    })
                }
                setTimeout(function(){
                        wx.hideLoading()
                    },300)
                // this.getConfig();
            }).catch(err => {
                this.msg(err.Msg)
            })
        },
        //选择样式
        selectImg(v, i) {
            // console.log(v);
            this.list.forEach((ele,index) => {
                ele.IsSelected = false;
            });
            this.list[i].IsSelected = true;
            // console.log(this.list)
            this.list = JSON.parse(JSON.stringify(this.list));
        },
        //选择自定义
        selectCustom() {
            // console.log('选择自定义');
            this.list.forEach(ele => {
                ele.checked = false;
            });
            this.list = JSON.parse(JSON.stringify(this.list));
        },
        //编辑自定义
        emitStyle() {
            // console.log('编辑自定义');
            wx.navigateTo({
                url: `/pages/upload-shop-img?type=6`
            });
        },
        //保存
        save() {
            for(var i = 0; i < this.list.length; i++) {
                if(this.list[i].IsSelected) {
                    if(this.list[i].CardImage == '') {
                        this.msg('请上传图片');
                        return;
                    }
                }
            }

            let Obj ;

            let filterArr = this.list.filter((v) => v.StyleType == 2);

            this.list.forEach(ele => {

                if(ele.IsSelected) {

                    if(ele.StyleType == 1) {
                        Obj = {
                            ShopId: this.ShopId,
                            CardStyleId: ele.Id,
                            CardImage: filterArr.length ? filterArr[0].CardImage : ele.CardImage
                        }
                    }
                    if(ele.StyleType == 2) {
                        Obj = {
                            ShopId: this.ShopId,
                            CardStyleId: 0,
                            CardImage: ele.CardImage
                        }
                    }
                    
                }
            });

            this.util.post({
                url: '/api/Merchant/VipMember/SetVipCardStyle',
                data: Obj
            }).then(res => {
                // console.log(res);
                this.msg('修改成功');
                wx.navigateBack({
                    delta: 1
                })
            }).catch(err => {
                this.Msg(err.Msg);
            })
        },
        //取消
        cancel() {
            wx.navigateBack({
                delta: 1
            })
        }
    }
}
</script>

<style lang="less">
    .container {
        background: #eeeef4;
        height: 100%;
        overflow: hidden;
        
        .memberBox {
            height: 100%;
            overflow-y: scroll;
            // display: flex;
            // flex-direction: column;
            // justify-content: flex-start;
            // align-items: center;
            .memberItem {
                padding: 0 36rpx 80rpx;
                margin-bottom: 40rpx;
                background: #fff;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                position: relative;
                .memberItemTit {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 40rpx 0;
                    span {
                        font-size: 30rpx;
                        color: #666666;
                        line-height: 30rpx;
                        font-weight: 600;
                    }
                }
                img {
                    width: 100%;
                    height: 380rpx;
                    border-radius: 32rpx;
                }
                .defaultImg {
                    width: 100%;
                    height: 380rpx;
                    background: #f5f5f5;
                    border-radius: 32rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .icon_add {
                        margin-top: 124rpx;
                        width: 110rpx;
                        height: 100rpx;
                    }
                    p {
                        margin-top: 20rpx;
                        color: #999999;
                        font-size: 24rpx;
                    }
                }
                .logo {
                    position: absolute;
                    left: 78rpx;
                    top: 142rpx;
                    width: 67rpx;
                    height: 67rpx;
                    border-radius: 50%;
                    z-index: 5;
                    // background: #fff;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
            }
            .memberItem:last-child {
                margin-bottom: 145rpx;
            }          
        }
        .handler {
            position: absolute;
            bottom: 0;
            left: 0;
            background: #fff;
            width: 100%;
            height: 110rpx;
            z-index: 10;
            border-top: 1rpx solid #ebebeb;
            display: flex;
            align-items: center;
            padding: 0 26rpx;
            box-sizing: border-box;
            .btn {
                background: #ccc;
                text-align: center;
                font-size: 28rpx;
                color: #fff;
                line-height: 72rpx;
                height: 72rpx;
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                i {
                    margin-right: 8rpx;
                }
                &.on {
                    background: #0863ee;
                }
            }
            .btn1 {
                margin-right: 20rpx;
                background-color: #fff;
                color: #0863ee;
                border: 1px solid #0863ee;
                &.on {
                    background: #fff;
                }
            }
            .btn2 {
                background-color: #fff;
                color: #0863ee;
                border: 1px solid #0863ee;
                &.on {
                    background: #fff;
                }
            }
            .btnl {
                margin-right: 12rpx;
                background-color: #fff;
                color: #0863ee;
                border: 1px solid #0863ee;
                &.on {
                    background: #fff;
                }
            }
            .btnr {
                margin-left: 12rpx;
            }
        }
    }
</style>


