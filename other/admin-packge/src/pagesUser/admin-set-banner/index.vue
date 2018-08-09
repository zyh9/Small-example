<template>
    <div style="height:100%;">
        <div class="wrap">
            <div class="main goodsImg">
                <ul class="emitImg">
                    <li v-for='(v,i) in newBanners' :key='i' @click='editImg(v,i)'>
                        <div class="set" @click.stop="goClassify(v,i)">
                            <p>头部图配置</p>
                            <p>
                                <span v-if="v.LinkType">{{stateList[v.LinkType-1].name}}</span>
                                <span class="def" v-else>请配置</span>
                                <!-- <input v-else type="text" disabled placeholder="请配置" placeholder-style="color:#ccc"> -->
                                <!-- <input type="text" v-model="stateList[v.LinkType-1].name" disabled placeholder="请配置" placeholder-style="color:#ccc"> -->
                                <i class="icon icon_arrowRight"></i>
                            </p>
                        </div>
                        <img v-if="v.PictureUrl" :src="v.PictureUrl" alt="">
                        <div class="imgBg" v-else><i class="icon icon_add"></i></div>
                        <div class="sort">
                            <p @click.stop='dealImg(v,i)'><i class="icon icon_redDel"></i>删除</p>
                        </div>
                    </li>
                    <li @click='addImg' class="add" v-if="newBanners.length < 4">
                        <i class="icon icon_emitAdd"></i>
                        <p>添加头图配置</p>
                    </li>
                    <p class="tips">最多可配置4张</p>
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
            oldBanners: [],
            //图片展示
            newBanners: [],
            //删除数据
            delBanners: [],
            //选择类型
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
        console.log('轮播区onUnload');
        wx.removeStorageSync('cutImg3');
        wx.removeStorageSync('cutImg');
        // let arr = [];
        // let l = wx.getStorageSync('newBanners',this.adList);
        // if(l) {
        //     l.forEach(ele => {
        //         if(ele.PictureUrl&&ele.LinkType) {
        //             arr.push(ele)
        //         }
        //     });
        //     wx.setStorageSync('newBanners',arr);
        // }
        wx.removeStorageSync('bannerList');
        wx.removeStorageSync('delBannerList');
        wx.removeStorageSync('oldBannerList');
    },
    onShow() {
        // 进入页面加载缓存
        let dataList = wx.getStorageSync('oldBannerList');
        this.oldBanners = dataList ? dataList : [];
        let newBannersList = wx.getStorageSync('bannerList');
        this.newBanners = newBannersList ? newBannersList : [];
        //清楚点击过保存
        wx.removeStorageSync('bannerListSave');


        // 图片编辑 缓存
        let cutImg = wx.getStorageSync('cutImg');
        if (cutImg) {
            this.newBanners[cutImg.index].PictureUrl = cutImg.url;
        }
        // 跳转类型 缓存
        if(wx.getStorageSync('linkType')) {
            let linkType = wx.getStorageSync('linkType');
            this.newBanners[linkType.index].LinkType = linkType.Type;
        }

        wx.setStorageSync('bannerList',this.newBanners);
    },
    
    methods: {
        /* 添加图片 */
        addImg() {
            this.newBanners.push({
                Id: 0,
                Type: 1,
                LinkType: '',
                PictureUrl: '',
                ActivityLink: '',
                GoodsTypeId: 0,
                GoodsId: 0,
                State: 0
            });
            wx.setStorageSync('bannerList',this.newBanners);
        },
        /* 删除商品介绍图片*/
        dealImg(v, i) {
            //console.log(123456)
            this.newBanners.splice(i, 1);
            for (let i = 0; i < this.oldBanners.length; i++) {
                //console.log()
                if (v.Id == this.oldBanners[i].Id) {
                    this.delBanners.push(Object.assign({}, v, {
                        State: -1
                    }));
                }
            }
            wx.setStorageSync('bannerList',this.newBanners);
            wx.setStorageSync('delBannerList',this.delBanners);
        },
        /* 上传商品介绍图片 */
        editImg(v,i) {
            const that = this;
            wx.setStorageSync('bannerList',this.newBanners);
            wx.navigateTo({
                url: `/pages/upload-shop-img?type=3&bannerIndex=${i}`
            });
        },

        /* 设置分类 */
        goClassify(v,i) {
            // console.log(v);
            wx.setStorageSync('setClassify', v);
            wx.setStorageSync('bannerList',this.newBanners);
            wx.navigateTo({
                url: `/pagesUser/admin-jump-type?bannerIndex=${i}`
            });
        },
        /* 保存图片 */
        emitImgBtn() {
            for(var i=0;i<this.newBanners.length;i++) {
                if(this.newBanners[i].PictureUrl) {
                    if(!this.newBanners[i].LinkType) {
                        return this.msg('请配置跳转类型');
                    }
                }
                if(!this.newBanners[i].LinkType) {
                    if(!this.newBanners[i].PictureUrl) {
                        return this.msg('请配置图片');
                    }
                }
            };
            wx.removeStorageSync('cutImg3');
            //这里需要循环oldBannerList  bannerlist  对比   提交在bannerlist 
            this.oldBanners.forEach(ele => {
                this.newBanners.forEach(item => {
                    // console.log(item)
                    if (ele.Id == item.Id && (ele.Type != item.Type || ele.LinkType != item.LinkType || ele.PictureUrl != item.PictureUrl || ele.ActivityLink != item.ActivityLink || ele.GoodsTypeId != item.GoodsTypeId || ele.GoodsId != item.GoodsId)) {
                        item.State = 0;
                    }
                });
            });
            let banners = wx.getStorageSync('bannerList') ? wx.getStorageSync('bannerList') : JSON.parse(JSON.stringify(this.bannerList));
            let delBanners = wx.getStorageSync('delBannerList') ? wx.getStorageSync('delBannerList') : [];

            if (banners.length == 0) {
                //console.log('banner判断')
                banners.push({
                    Id: 0,
                    Type: 1,
                    LinkType: '',
                    PictureUrl: '',
                    ActivityLink: '',
                    GoodsTypeId: 0,
                    GoodsId: 0,
                    State: 0
                })
            }
            if (delBanners.length == 0) {
                delBanners.push({
                    Id: 0,
                    Type: 1,
                    LinkType: '',
                    PictureUrl: '',
                    ActivityLink: '',
                    GoodsTypeId: 0,
                    GoodsId: 0,
                    State: -1
                })
            }
            let lists = banners.concat([...delBanners]);
            let arrs = [];
            lists.forEach(ele => {
                if (ele.Type && ele.LinkType) {
                    arrs.push(ele);
                    // if(ele.GoodsTypeId != undefined) {
                    //   arrs.push(ele);
                    // }else {
                    //   arrs.push(ele);
                    // }
                }
            })
            this.util.post({
                url: '/api/Merchant/ShopManage/UpdateECommerceTemplate',
                data: {
                    ShopId: wx.getStorageSync('loginInfo').ShopID || '',
                    TemplateId: 2,
                    ShopAdvertisements: arrs
                }
            }).then(res => {
                //console.log(res)
                if (res.State == 1) {
                    wx.setStorageSync('bannerList', this.newBanners);
                    setTimeout(_ => {
                        wx.navigateBack({
                            delta: 1
                        })
                    })
                } else {
                    this.msg(res.Msg);
                }
            }).catch(err => {
                this.msg(err.Msg);
            })
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
                height: 514rpx;
                // position: relative;
                margin: 0 auto 20rpx;
                background: #fff;
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
                    height: 320rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background:#f5f5fa;
                    border-radius: 10rpx;
                    i {
                        width: 113rpx;
                        height: 99rpx;
                    }
                }
                img {
                    width: 100%;
                    height: 320rpx;
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


