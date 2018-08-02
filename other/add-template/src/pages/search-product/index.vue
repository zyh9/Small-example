<template>
    <div class="search_product">
        <div class="search_top">
            <div class="search">
                <i class="icon icon_search_2"></i>
                <input type="text" placeholder="搜索" v-model="val" focus="true">
                <i class="icon icon_del" v-if="val" @click="clear"></i>
            </div>
            <p class="text" @click="searchClick">搜索</p>
        </div>
        <scroll-view scroll-y="true" :style="{height:winHeight+'px'}" lower-threshold="20" @scrolltolower="scrollHandler">
            <p class="no_search" v-if="tips">暂无搜索结果</p>
            <ul class="search-product-list">
                <li class="product-list-item" v-for="(v,i) in productList" :key="i" @click="goDetails(v)">
                    <img :src="v.GoodsMasterPic?v.GoodsMasterPic+'?x-oss-process=image/resize,w_300/format,jpg':''" class="fade_in" alt="" />
                    <div class="product-list-item-title">{{v.GoodName}}</div>
                    <div class="product-list-item-price" v-if="v.State!=3">
                        <i class="icon icon_discount_text" v-if="v.GoodsType==-1"></i>
                        <p class="price"><span>¥</span>{{v.SalesPrice?v.SalesPrice:v.OriginalPrice}}</p>
                        <p class="original_price" v-if="v.GoodsType==-1">¥{{v.OriginalPrice}}</p>
                    </div>
                    <div class="sold_out" v-if="v.State==3">已售罄</div>
                    <div class="sold_out_mask" v-if="v.State==3"></div>
                </li>
                <div class="no_more" v-if="nomore">没有更多</div>
            </ul>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                val: '',
                mapInfo: {},
                productList: [],
                tips: false,
                page: 1,
                quest: true,
                nomore: false,
            }
        },
        onShow() {
            this.page = 1;
            this.quest = true;
            this.val = '';
            this.productList = [];
            this.tips = false;
            this.nomore = false;
            this.mapInfo = wx.getStorageSync('QQmap')
            // console.log(this.mapInfo)
            let query = wx.createSelectorQuery();
            query.select('.search_top').boundingClientRect()
            query.exec(res => {
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        // console.log(res)
                        this.winWidth = res.windowWidth;
                        //减去上方的高度
                        this.winHeight = res.windowHeight - height;
                    }
                })
            })
        },
        methods: {
            scrollHandler() {
                if (this.quest) {
                    this.page++;
                    this.search()
                }
            },
            searchClick() {
                this.page = 1;
                this.productList = [];
                this.quest = true;
                this.nomore = false;
                this.search()
            },
            search() {
                if (this.val) {
                    this.util.post({
                        url: '/api/Customer/Browse/SearchGoods',
                        data: {
                            ShopId: String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                            GoodsName: this.val,
                            PageSize: 10,
                            PageIndex: this.page
                        }
                    }).then(res => {
                        if (res.Body.GoodsList.length < 10 && this.page > 1) {
                            this.quest = false;
                            this.nomore = true;
                        }
                        this.productList.push(...res.Body.GoodsList);
                        if (this.productList.length == 0) this.tips = true;
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                } else this.msg('您还没有输入内容哦')
            },
            clear() {
                this.val = '';
                this.productList = [];
                this.tips = false;
                this.nomore = false;
            },
            openShop(info) {
                console.log(info.ShopId)
                wx.redirectTo({
                    url: `/pages/my-store/main?ShopId=${info.ShopId}&type=1`
                })
            },
            goDetails(item) {
                // console.log(item)
                if (item.State == 3) {
                    this.msg('商品已售罄')
                    return;
                }
                let {
                    GoodId
                } = item;
                let ShopId = String(wx.getStorageSync('shopInfo').ShopId) || '';
                wx.redirectTo({
                    url: `/pages/product-details/main?ShopId=${ShopId}&GoodId=${GoodId}&type=1&temp=2`
                })
            }
        },
        watch: {
            val: function(newOld, oldVal) {
                if (newOld == "") {
                    this.tips = false;
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .search_product {
        height: 100%;
        background: #fff;
        overflow: hidden;
    }
    .search_top {
        padding: 16rpx 0 16rpx 35rpx;
        display: flex;
        justify-content: flex-start;
        .search {
            flex: 1;
            background: #f5f5f5;
            height: 64rpx;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
            border-radius: 32rpx;
            i {
                margin: 0 20rpx;
            }
            input {
                flex: 1;
                color: #333;
                font-size: 26rpx;
            }
        }
        .text {
            height: 64rpx;
            width: 120rpx;
            font-size: 28rpx;
            color: #444;
            line-height: 64rpx;
            text-align: center;
        }
    }
    .no_search {
        font-size: 24rpx;
        color: #999;
        text-align: center;
        padding-top: 60rpx;
    }
    .search-product-list {
        padding: 40rpx 36rpx 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        .product-list-item {
            width: 325rpx;
            margin-bottom: 35rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            position: relative;
            img {
                width: 100%;
                height: 332rpx;
                border-radius: 10rpx;
                box-shadow: 0 6rpx 10rpx rgba(0, 0, 0, 0.18);
            }
            .product-list-item-title {
                margin-top: 20rpx;
                font-size: 30rpx;
                font-weight: 700;
                color: #1a1a1a;
                line-height: 40rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .product-list-item-price {
                line-height: 32rpx;
                margin-top: 10rpx;
                display: flex;
                align-items: center;
                i {
                    transform: translateY(0);
                }
                .price {
                    color: #ff4d3a;
                    font-size: 32rpx;
                    font-weight: 700;
                    span {
                        font-size: 24rpx;
                        margin-right: 6rpx;
                    }
                }
                .original_price {
                    font-size: 24rpx;
                    color: #ccc;
                    margin-left: 12rpx;
                    position: relative;
                    &:after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-bottom: 1px solid #ccc;
                        position: absolute;
                        bottom: 50%;
                        left: 0;
                        transform: scale(1, 0.5);
                        transform-origin: 0 0;
                    }
                }
            }
            .sold_out {
                margin-top: 10rpx;
                line-height: 32rpx;
                font-size: 24rpx;
                color: #1a1a1a;
            }
            .sold_out_mask {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.55);
            }
        }
    }
    .no_more {
        height: 60rpx;
        width: 100%;
        line-height: 60rpx;
        font-size: 26rpx;
        color: #999;
        text-align: center;
        background: #fff;
    }
</style>
