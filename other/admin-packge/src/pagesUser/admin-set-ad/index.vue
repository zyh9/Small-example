<template>
    <div style="height:100%;">
        <div class="wrap">
            <div class="main goodsImg">
                <ul class="emitImg">
                    <li v-for='(v,i) in adList' :key='i' @click='editImg(v,i)'>
                        <div class="set" @click.stop="goClassify(v,i)">
                            <p>广告图配置</p>
                            <p>
                                <span v-if="v.LinkType">{{stateList[v.LinkType-1].name}}</span>
                                <span class="def" v-else>请配置</span>
                                <!-- <input v-else type="text" disabled placeholder="请配置" placeholder-style="color:#ccc"> -->
                                <i class="icon icon_arrowRight"></i>
                            </p>
                        </div>
                        <!-- <img :src="v.PicUrl+'?x-oss-process=image/resize,w_400/format,jpg'" alt=""> -->
                        <img v-if="v.PictureUrl" :src="v.PictureUrl" alt="">
                        <div class="imgBg" v-else><i class="icon icon_add"></i></div>
                        <div class="sort">
                            <p @click.stop='dealImg(v,i)'><i class="icon icon_redDel"></i>删除</p>
                        </div>
                    </li>
                    <li @click='addImg' class="add" v-if="adList.length < 3">
                        <i class="icon icon_emitAdd"></i>
                        <p>添加广告配置</p>
                    </li>
                    <p class="tips">最多可配置3张</p>
                </ul>
            </div>
        </div>
        <div class="commodity_bottom">
            <p class="btn" @click='emitImgBtn'>保存</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //原有图片
            oldAdList: [],
            //图片展示
            adList: [],
            //删除数据
            delAdList: [],
            //选择类型
            stateIndex: 0,
            stateList: [
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
    onUnload() {
        //console.log('广告区onUnload');
        wx.removeStorageSync('cutImg3');
        wx.removeStorageSync('cutImg');
        let arr = [];
        let l = wx.getStorageSync('adList',this.adList);
        if(l) {
            l.forEach(ele => {
                if(ele.PictureUrl&&ele.LinkType) {
                    arr.push(ele)
                }
            });
            wx.setStorageSync('adList',arr);
        }
        
    },
    // onShow() {
    //     // 图片编辑 缓存
    //     if (wx.getStorageSync('cutImg3')) {
    //         this.adList.push({
    //             Id: 0,
    //             Type: 1,
    //             LinkType: '',
    //             PictureUrl: wx.getStorageSync('cutImg3'),
    //             ActivityLink: '',
    //             GoodsTypeId: 0,
    //             GoodsId: 0,
    //             State: 0
    //         });
    //     }
    //     // 跳转类型 缓存
    //     if(wx.getStorageSync('linkType')) {
    //         let linkType = wx.getStorageSync('linkType');
    //         this.adList[linkType.index].LinkType = linkType.Type;
    //     }
    // },
    onShow() {
        // 进入页面加载缓存
        let dataList = wx.getStorageSync('oldAdList');
        this.oldAdList = dataList ? dataList : [];
        let newAdList = wx.getStorageSync('adList');
        this.adList = newAdList ? newAdList : [];

        //数据回填补全数据
        this.adList = wx.getStorageSync('adList') ? wx.getStorageSync('adList') : [];
        // if(this.adList.length < 3) {
        //     this.stateIndex = 2;
        //     let len = 3-this.adList.length;
        //     for(var i = 0; i < len; i++) {
        //         this.adList.push({
        //             Id: 0,
        //             Type: 3,
        //             LinkType: '',
        //             PictureUrl: '',
        //             ActivityLink: '',
        //             GoodsTypeId: 0,
        //             GoodsId: 0,
        //             State: 0
        //         });
        //     }
        // }

        // 图片编辑 缓存
        let cutImg = wx.getStorageSync('cutImg');
        if (cutImg) {
            this.adList[cutImg.index].PictureUrl = cutImg.url;
        }
        // console.log(this.adList)
        // 跳转类型 缓存
        if(wx.getStorageSync('linkType')) {
            let linkType = wx.getStorageSync('linkType');
            this.adList[linkType.index].LinkType = linkType.Type;
        }

        wx.setStorageSync('adList',this.adList);
    },
    
    methods: {
        /* 添加图片 */
        addImg() {
            this.adList.push({
                Id: 0,
                Type: 3,
                LinkType: '',
                PictureUrl: '',
                ActivityLink: '',
                GoodsTypeId: 0,
                GoodsId: 0,
                State: 0
            });
            wx.setStorageSync('adList',this.adList);
        },

        /* 删除商品介绍图片*/
        dealImg(v, i) {
            this.adList.splice(i, 1);
            for (let i = 0; i < this.oldAdList.length; i++) {
                //console.log(this.oldAdList[i].Id)
                //console.log(v.Id)
                if (v.Id == this.oldAdList[i].Id) {
                    this.delAdList.push(Object.assign({}, v, {
                        State: -1
                    }));
                }
            }
            wx.setStorageSync('adList',this.adList);
            wx.setStorageSync('delAdList',this.delAdList);
            wx.removeStorageSync('cutImg');
        },

        /* 上传商品介绍图片 */
        editImg(v,i) {
            const that = this;
            wx.navigateTo({
                url: `/pages/upload-shop-img?type=5&adIndex=${i}`
            });
        },

        /* 设置分类 */
        goClassify(v,i) {
            wx.setStorageSync('setClassify', v);
            wx.setStorageSync('adList',this.adList);
            wx.navigateTo({
                url: `/pagesUser/admin-jump-type?adIndex=${i}`
            });
        },

        /* 保存图片 */
        emitImgBtn() {
            for(var i=0;i<this.adList.length;i++) {
                if(this.adList[i].PictureUrl) {
                    if(!this.adList[i].LinkType) {
                        return this.msg('请配置跳转类型');
                    }
                }
                if(!this.adList[i].LinkType) {
                    if(!this.adList[i].PictureUrl) {
                        return this.msg('请配置图片');
                    }
                }
            };
            wx.removeStorageSync('cutImg3');
            wx.navigateBack({
                delta: 1
            })
            // wx.redirectTo({
            //     url: '/pagesUser/admin-online-retailers'
            // });
        }
    }
}
</script>

<style lang="less">
    page {
        background: #eeeef4;
    }
    .wrap {
        height: 100%;
        overflow-y: scroll;
        padding-bottom: 120rpx;
        box-sizing: border-box;
    }
    .set {
      padding: 31rpx 0;
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
        text-align: right;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        input {
          margin-right: 21rpx;
        }
        .def {
            color: #ccc;
        }
        span {
            margin-right:20rpx;
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
    .main {
        background: #eeeef4;
        margin-bottom: 20rpx;
        .detailImg {
            background: #fff;
            display: flex;
            flex-wrap: wrap;
            margin: 0 36rpx;
            padding: 10rpx 0;
            img {
                width: 216rpx;
                height: 216rpx;
                margin-bottom: 15rpx;
                margin-right: 15rpx;
                &:nth-child(3n) {
                    margin-right: 0;
                }
            }
        }
        ul.emitImg {
            .tips {
                font-size: 22rpx;
                line-height: 22rpx;
                color: #999;
                text-align: center;
                margin-top: 28rpx;
            }
            // padding: 0 36rpx;
            li {
                // width: 678rpx;
                padding: 0 36rpx;
                // height: 540rpx;
                // position: relative;
                margin: 0 auto 20rpx;
                background: #fff;
                height: 390rpx;
                &.add {
                    height: 100rpx;
                    background: #fff;
                    line-height: 100rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    i {
                        margin-right: 15rpx;
                    }
                    p {
                        font-size: 32rpx;
                        color: #333333;
                    }
                }
                .imgBg {
                    width: 100%;
                    height: 200rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background:#f5f5fa;
                    border-radius: 10rpx;
                    i {
                        width: 100rpx;
                        height: 90rpx;
                    }
                }
                img {
                    width: 100%;
                    height: 200rpx;
                    background-color: #f5f5fa;
                    border-radius: 10rpx;
                }
                .icon_dealImg {
                    position: absolute;
                    top: 24rpx;
                    right: 24rpx;
                    z-index: 10;
                }
                .sort {
                    height: 64rpx;
                    background: #fff;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                    margin-top: 20rpx;
                    p {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        width: 184rpx;
                        height: 64rpx;
                        font-size: 28rpx;
                        color: #eb4e3d;
                        text-align: center;
                        line-height: 64rpx;
                        border: solid 1px #eb4e3d;
                        // &:last-child {
                        //     border: none;
                        // }
                        .icon {
                            margin-right: 10rpx;
                            vertical-align: middle;
                        }
                    }
                }
            }
            
        }
    }
</style>


