<template>
    <div class="admin_store_templet">
        <ul class="templet_top">
            <li v-for="(v,i) in BusinessType" :key="i" @click='choiceTemplate(v)'>
                <img :src="v.ID==1?'https://otherfiles-ali.uupt.com/Stunner/FE/M/e59cd825e16f4a728ea6e17e7c9335ed_big.png':'https://otherfiles-ali.uupt.com/Stunner/FE/M/d956117ac1a542d3a31eccb7852e19a6_big.png'" alt="">
                <div class="text"><i class="icon icon_adminCheck" :class="{icon_adminChecked:templateId==v.ID}"></i>{{v.ID == 1 ? v.BusinessType : '电商'}}</div>
            </li>
        </ul>
        <!-- <cover-view  class="hander" v-if="isTemplate">
            <cover-view class="btn" @click='setTemplate'>配置模板</cover-view>
        </cover-view> -->
        <div class="hander" v-if="isTemplate">
            <div class="btn" @click='setTemplate'>配置模板</div>
        </div>

        <div class="mask" v-if='isShow' @click='ishide'></div>
        <div class="layBox" v-if='isShow'>
            <h2 class="title">模板配置</h2>
            <p>配置完模板页面才能生效哟</p>
            <div class="modalCont_btn">
                <div class="modalCont_btn_cont">
                    <div class="modalCont_btn_cont_cancel" @click="ishide">
                        再想一下
                    </div>
                    <div class="modalCont_btn_cont_conf" @click="selectSave">
                        确定
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
                BusinessType:[
                    {
                        ID: 1,
                        BusinessType: '',
                        Sort: ''
                    }
                ],
                templateId: 1, /* 1：餐饮；2：电商 */
                isShow: false,
                //是否配置好了电商模板
                isTemplate: false,
            }
        },
        onShow() {
            this.isShow = false;
            this.templateId=wx.getStorageSync('shopInfo').ShopViewTemplate;
            //console.log('模板'+this.templateId)
            if(this.templateId == 2) {
                this.isTemplate = true;
            }else {
                this.isTemplate = false;
            }
            //获取是否配置过电商模板

        },
        mounted() {
            this.templateId=wx.getStorageSync('shopInfo').ShopViewTemplate;
            this.GetBusinessType();  
        },
        methods: {
            //配置模板
            setTemplate() {
                this.selectSave();
            },
            //选择模板
            choiceTemplate(v) {
                if(v.ID == this.templateId) {
                    return
                }
                //如果从餐饮选电商 =>弹框
                if(this.templateId == 1) {
                    if(v.ID == 2) {
                        this.isTemplate = true;
                        this.isShow = true;
                        return;
                    }else {
                        this.isTemplate = false;
                    }
                }
                if(v.ID == 1) {
                    this.isTemplate = false;
                }
                this.templateId = v.ID;
                this.changeTemplate();
            },
            //取消
            ishide() {
                this.isShow = false;
                if(this.templateId == 1) {
                    this.isTemplate = false;
                }
                if(this.templateId == 2) {
                    this.isTemplate = true;
                }
                
            },
            //确定
            selectSave() {
                this.templateId = 2;
                // this.isShow = false;
                wx.redirectTo({
                    url: '/pagesUser/admin-online-retailers'
                });
            },
             /* 获取店铺类型 */
            GetBusinessType() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetBusinessTypeDic',
                    data: {}
                }).then(res => {
                    if (res.State == 1) {
                        this.BusinessType = res.Body;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            changeTemplate() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ChangeViewTemplate',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID || '',
                        TemplateID: this.templateId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        let shopInfo=wx.getStorageSync('shopInfo');
                        shopInfo.ShopViewTemplate=this.templateId;
                        wx.setStorageSync('shopInfo',shopInfo);
                        this.msg('修改成功');
                        setTimeout(function(){
                            wx.redirectTo({
                                url: '/pages/admin-index'
                            })
                        },300)
                    }
                }).catch(err => {
                    //console.log(err)
                    this.msg(err.Msg)
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    page{
        background: #eeeef4;
    }
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .7);
        z-index: 20;
    }
    .layBox {
        position: absolute;
        top: 350rpx;
        left: 0;
        right: 0;
        padding: 87rpx 30rpx 30rpx;
        margin: 0 90rpx;
        background: #fff;
        border-radius: 16rpx;
        box-sizing: border-box;
        z-index: 30;
        h2.title {
            line-height: 37rpx;
            font-size: 34rpx;
            color: #656782;
            text-align: center;
            width: 502rpx;
        }
        p {
            font-size: 28rpx;
            color: #656782;
            line-height: 28rpx;
            padding-top: 33rpx;
            text-align: center;
            width: 502rpx;
        }
        .modalCont_btn {
            // width: 100%; 
            overflow: hidden;
            position: relative;
            width: 502rpx;
            .modalCont_btn_cont {
                width: 100%;
                display: flex;
                flex-direction: row; // justify-content: space-between;
                font-size: 26rpx;
                margin-top: 81rpx;
                .modalCont_btn_cont_cancel {
                    // flex: 1;
                    text-align: center;
                    width: 245rpx;
                    height: 72rpx;
                    border: solid 1rpx #3c59ee;
                    font-family: PingFangSC-Regular;
                    font-size: 26rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 72rpx;
                    letter-spacing: 0px;
                    color: #3c59ee;
                }
                .modalCont_btn_cont_conf {
                    // flex: 1;
                    text-align: center;
                    color: #0863ee;
                    width: 245rpx;
                    height: 72rpx;
                    background-color: #3c59ee;
                    font-family: PingFangSC-Regular;
                    font-size: 26rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 72rpx;
                    letter-spacing: 0px;
                    color: #ffffff;
                    border: 1rpx solid #3c59ee;
                    margin-left: 24rpx;
                }
                .btn_dis {
                    border: 1rpx solid #cccccc;
                    background: #cccccc;
                }
            }
        }
    }
    .admin_store_templet {
        height: 100%;
        background: #eeeef4;
        position: relative;
        overflow-x: hidden;
        padding: 35rpx 35rpx 0;
        box-sizing: border-box;
        .templet_top {
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #fff;
                padding: 15rpx 15rpx 0;
                img {
                    width: 298rpx;
                    height: 493rpx;
                }
                .text {
                    height: 110rpx;
                    text-align: center;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    line-height: 110rpx;
                    .icon {
                        vertical-align: middle;
                        margin-right: 19rpx;
                    }
                }
            }
        }
        .hander{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 118rpx;
            background: #fff;
            border-top: 1rpx solid #ebebeb;
            .btn{
                margin:19rpx 36rpx;
                height:80rpx;
                background-color: #0863ee;
                text-align: center;
                color: #fff;
                line-height: 80rpx;
                font-size: 28rpx;
            }
        }
    }
</style>
