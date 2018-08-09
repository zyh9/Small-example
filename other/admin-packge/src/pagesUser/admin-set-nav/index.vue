<template>
    <div class="nav">
        <div class="nav-show">
            <div class="nav-set" @click="setStyle">
                <p>区域样式</p>
                <p>
                    <span>{{stateList[stateIndex].name}}</span>
                    <i class="icon icon_arrowRight"></i>
                </p>
            </div>
            <div class="showList">
                <div class="showItem" :class="{showItemBig:navList.length < 4}" v-for="(v,i) in navList" :key="i">
                    <img v-if="v.PictureUrl" :src="v.PictureUrl+'?x-oss-process=image/resize,w_200/format,jpg'">
                </div>
            </div>
        </div>

        <div class="nav-edit">
            <div class="nav-set" @click="goSet(1)">
                <div class="nav-set-l">区域图片配置</div>
            </div>
            <div class="editList">
                <div class="editItem" v-for="(v,i) in navList" :key="i">
                    <div class="editItemL" @click.stop='editImg(v,i)'>
                        <img v-if="v.PictureUrl" :src="v.PictureUrl+'?x-oss-process=image/resize,w_200/format,jpg'">
                        <i v-else class="icon icon_add"></i>
                    </div>
                    <div class="editItemR" @click.stop="goClassify(v,i)">
                        <div class="editItemRTit">0{{i+1}}</div>
                        <div class="editItemRCont">
                            <span>图{{i+1}}跳转至</span>
                            <div>
                                <p v-if="v.LinkType">{{typeList[v.LinkType-1].name}}</p>
                                <input v-else type="text" disabled placeholder="请配置" placeholder-style="color:#ccc">
                                <!-- <span>{{stateList[v.LinkType-1].name}}</span> -->
                                <i class="icon icon_arrowRight"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="commodity_bottom">
            <p class="btn" @click='emitImgBtn'>保存</p>
        </div>

        <!-- 模态框 -->
        <div v-if="stateModal">
            <div class="modalBg" @click="stateModal = false"></div>
            <div class="modalCont">
                <div class="modalCont_Tit">区域样式</div>
                <div class="modalCont_cont">
                    <div class="row" :class="{row1:index == 0}" v-for="(item,index) in stateList" :key="index" @click="stateSelect(index)">
                        <div class="rowItem">
                            <div class="audioBox">
                                <i class="icon icon_adminCheck" :class="{icon_adminChecked:stateIndex == index}"></i>
                            </div>
                            <div class="column1">
                                <p>{{item.name}}</p>
                            </div>
                        </div>
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
            //是否点保存离开
            isSave: false,
            stateModal: false,
            typeText: '',
            stateIndex: 0,
            //选择类型
            stateList: [
                {
                    name: '8图样式',
                    num: 8,
                },
                {
                    name: '4图样式',
                    num: 4,
                },
                {
                    name: '3图样式',
                    num: 3,
                }
            ],
            navList:[],
            delNavList:[],
            //选择类型
            typeList: [
                {
                    name: '活动页',
                    type: 1,
                },
                {
                    name: '会员页',
                    type: 2,
                },
                {
                    name: '分类页',
                    type: 3,
                },
                {
                    name: '商品详情页',
                    type: 4,
                }
            ],
        }
    },
    onLoad() {

    },
    onShow() {
        //初始化
        this.stateIndex = 0;
        this.stateModal = false;
        this.navList = [];
        // this.delNavList = [];
        this.isSave = false;
        //console.log(wx.getStorageSync('navList'))
        //数据回填补全数据
        this.navList = wx.getStorageSync('navList') ? wx.getStorageSync('navList') : [];
        if(this.navList.length <= 3 && this.navList.length > 0) {
            this.stateIndex = 2;
            let len = 3-this.navList.length;
            for(var i = 0; i < len; i++) {
                this.navList.push({
                    Id: 0,
                    Type: 2,
                    LinkType: '',
                    PictureUrl: '',
                    ActivityLink: '',
                    GoodsTypeId: 0,
                    GoodsId: 0,
                    State: 0
                });
            }
        }else if(this.navList.length > 3 && this.navList.length <= 4) {
            this.stateIndex = 1;
            let len = 4-this.navList.length;
            for(var i = 0; i < len; i++) {
                this.navList.push({
                    Id: 0,
                    Type: 2,
                    LinkType: '',
                    PictureUrl: '',
                    ActivityLink: '',
                    GoodsTypeId: 0,
                    GoodsId: 0,
                    State: 0
                });
            }
        }else{
            this.stateIndex = 0;
            let len = 8-this.navList.length;
            for(var i = 0; i < len; i++) {
                this.navList.push({
                    Id: 0,
                    Type: 2,
                    LinkType: '',
                    PictureUrl: '',
                    ActivityLink: '',
                    GoodsTypeId: 0,
                    GoodsId: 0,
                    State: 0
                });
            }
        }
        // 图片编辑 缓存
        let cutImg = wx.getStorageSync('cutImg');
        if (cutImg) {
            this.navList[cutImg.index].PictureUrl = cutImg.url;
        }
    },
    onReady() {

    },
    onUnload() {
        //console.log('小图区onUnload');
        wx.removeStorageSync('cutImg3');
        wx.removeStorageSync('cutImg');
        if(!this.isSave) {
            let l = wx.getStorageSync('navList');
            l.forEach( ele => {
                if(ele.PictureUrl=='' || ele.LinkType=='') {
                    wx.removeStorageSync('navList');
                }
            })
            wx.removeStorageSync('delNavList');
        }else {

        }
        
    },
    methods: {
        /* 上传商品介绍图片 */
        editImg(v,i) {
            const that = this;
            wx.setStorageSync('navList',this.navList);
            wx.navigateTo({
                url: `/pages/upload-shop-img?type=4&navIndex=${i}`
            });
        },
        /* 设置分类 */
        goClassify(v,i) {
            //console.log(v);
            wx.setStorageSync('setClassify', v);
            wx.setStorageSync('navList',this.navList);
            wx.navigateTo({
                url: `/pagesUser/admin-jump-type?navIndex=${i}`
            });
        },
        //选择样式
        setStyle() {
            this.stateModal = true;
        },
        stateSelect(index) {
            if(index == this.stateIndex) {
                this.stateModal = false;
                return
            }
            this.stateIndex = index;
            this.typeText = this.stateList[this.stateIndex].name;
            this.navList.forEach(ele => {
                // console.log(ele)
                if(ele.Id) {
                    ele.State = -1;
                    this.delNavList.push(ele);
                } 
            });
            // console.log(this.delNavList)
            this.navList = [];
            this.styleList(this.stateList[this.stateIndex].num);
            this.stateModal = false;
        },
        //样式
        styleList(num) {
            for(var i = 0; i < num; i++) {
                this.navList.push({
                    Id: 0,
                    Type: 2,
                    LinkType: '',
                    PictureUrl: '',
                    ActivityLink: '',
                    GoodsTypeId: 0,
                    GoodsId: 0,
                    State: 0
                });
            }
        },
        /* 保存 */
        emitImgBtn() {
            //console.log(this.navList);
            for(var i=0;i<this.navList.length;i++) {
                if(this.navList[i].PictureUrl) {
                    if(!this.navList[i].LinkType) {
                        return this.msg('请配置跳转类型');
                    }
                }
                if(!this.navList[i].LinkType) {
                    if(!this.navList[i].PictureUrl) {
                        return this.msg('请配置图片');
                    }
                }
            };
            for(var i=0;i<this.navList.length;i++) {
                if(this.navList[i].LinkType) {
                    if(!this.navList[i].PictureUrl) {
                        return this.msg('请配置图片');
                    }
                }
                if(!this.navList[i].PictureUrl) {
                    if(!this.navList[i].LinkType) {
                        return this.msg('请配置跳转类型');
                    }
                }
            };

            this.navList = this.navList.filter(function(v) {
                return v.LinkType != ''
            })
            //console.log(this.navList)
            wx.removeStorageSync('cutImg3');
            // console.log(this.delNavList)
            wx.setStorageSync('delNavList', this.delNavList);
            wx.setStorageSync('navList', this.navList);
            //console.log('点击保存');
            this.isSave = true;
            wx.navigateBack({
                delta: 1
            })
        }
    }
}
</script>

<style lang="less">
page {
    // background: #eeeef4;
    background: #fff;
}
.modalBg {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
}
.modalCont {
    position: absolute;
    z-index: 999999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 562rpx;
    height: 490rpx;
    border-radius: 18rpx;
    padding-top: 30rpx;
    padding-bottom: 30rpx;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .modalCont_Tit {
        // height: 50rpx;
        line-height: 80rpx;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 35rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #333333;
        padding-left: 28rpx;
        padding-right: 28rpx;
    }
    .modalCont_head {
        font-size: 30rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-top: 40rpx;
        padding-bottom: 30rpx;
        padding-left: 28rpx;
        padding-right: 28rpx;
        .audioBox {
            flex: 0.3;
            text-align: center;
        }
        .column1 {
            flex: 1;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 26rpx;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #999999;
        }
        .column2 {
            flex: 1;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 26rpx;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #999999;
        }
        .column3 {
            flex: 1;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 26rpx;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #999999;
        }
    }
    .modalCont_cont {
        height: 400rpx;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-left: 28rpx;
        padding-right: 28rpx;
        .row {
            // font-size: 26rpx;
            width: 100%;
            height: 100rpx;
            line-height: 100rpx;
            width: 100%;
            font-size: 26rpx;
            color: #1a1a1a;
            position: relative;
            &::after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                position: absolute;
                bottom: 0;
                left: 0;
                border-bottom: 1PX solid #ebebeb;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            .rowItem {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                position: relative;
                .audioBox {
                    position: absolute;
                    width: 100rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100rpx;
                }
                .column1 {
                    flex: 1;
                    text-align: left;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    text-align: center;
                    p {
                        width: 100%;
                        text-align: center;
                    }
                }
                .column2 {
                    flex: 1;
                    text-align: center;
                    p {
                        width: 100%;
                        text-align: center;
                    }
                }
                .column3 {
                    flex: 1;
                    text-align: center;
                    p {
                        width: 100%;
                        text-align: center;
                    }
                }
                div {
                    font-family: PingFangSC-Regular;
                    font-size: 24rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #1a1a1a;
                }
            }
        }
    }
}
.nav {
    .nav-set {
        padding: 31rpx 36rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        p {
            flex: 1;
            font-size: 28rpx;
            color: #1a1a1a;
            line-height: 1;
            display:flex;
            align-items:center;
        }
        p:last-child {
            text-align: left;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            input {
                margin-right: 21rpx;
            }
            span {
                margin-right:20rpx;
            }
        }
        
    }
    .nav-set-l {
        flex: 1;
        font-size: 28rpx;
        color: #1a1a1a;
        line-height: 1;
        display:flex;
        align-items:center;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .nav-show {
        background: #fff;
        position: relative;
        &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            border-bottom: 1px solid #e6e6e6;
            position: absolute;
            bottom: 0;
            left: 0;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
        .showList {
            padding: 0 36rpx 34rpx 36rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            background: #fff;
            .showItem {
                width: 159rpx;
                height: 159rpx;
                margin-bottom: 14rpx;
                background-color: #f5f5fa;
                border-radius: 10px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                }
            }
            .showItemBig {
                width: 212rpx;
                height: 212rpx;
            }
        }
    }
    .nav-edit {
        background: #fff;
        .editList {
            padding-left: 36rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding-bottom:110rpx;
            .editItem {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                margin-bottom: 48rpx;
                .editItemL {
                    width: 159rpx;
                    height: 159rpx;
                    border-radius: 10rpx;
                    line-height: 159rpx;
                    text-align: center;
                    background: #f5f5fa;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 10rpx;
                    }
                    i {
                        
                    }
                }
                .editItemR {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex: 1;
                    margin-left: 36rpx;
                    padding-right: 36rpx;
                    position: relative;
                    &:after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-bottom: 1px solid #e6e6e6;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                    .editItemRTit {
                        font-size: 36rpx;
                        color: #ebebeb;
                        line-height: 36rpx;
                        margin-top: 18rpx;
                    }
                    .editItemRCont {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 28rpx;
                        margin-bottom: 19rpx;
                        color: #1a1a1a;
                        span {
                            line-height: 1;
                            width: 200rpx;
                        }
                        div {
                            flex: 1;
                            line-height: 1;
                            display: flex;
                            align-items: center;
                            p {
                                flex: 1;
                                margin-right: 20rpx;
                                text-align: right;
                            }
                            input {
                                flex: 1;
                                text-align: right;
                                margin-right: 20rpx;
                            }
                        }
                    }
                }
            }
        }
    }
    .commodity_bottom {
        padding: 19rpx 36rpx;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 9999;
        background: #fff;
        border-top: 1rpx solid #eeeef4;
        .btn {
            width: 678rpx;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            font-size: 26rpx;
            color: #fff;
            background: #0863ee;
        }
    }
}
</style>
