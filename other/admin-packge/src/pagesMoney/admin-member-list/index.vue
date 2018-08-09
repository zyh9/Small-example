<template>
    <div class="container" :class="{container2:list.length}">
        <!-- <div class="headTop">
            <div class="searchBox set-flex set-align ">
                <div class="item set-flex set-grow set-align">
                    <i class="icon icon_search"></i>
                    <input type="text" class="set-grow" v-model="searchKey" focus="true" placeholder="在这里搜索你的商品">
                    <i class="icon icon_del" @click="searchKeyNull" v-if="searchKey"></i>
                </div>
                <span class="gosearch" @click="search">搜索</span>
            </div>
        </div> -->
        <!-- <scroll-view scroll-y="true" class="scroll_view" @scrolltolower='scrolltolower'> -->
        <div class="scroll_view">
            <ul>
                <li @click="goDetail(item,index)" v-for="(item, index) in list" :key="index">
                    <div class="itemL">
                        <img :src="item.MemberHeader">
                    </div>
                    <div class="itemR">
                        <div class="itemRTitle">{{item.MemberName}}</div>
                        <div class="itemRPrice">余额￥{{item.AccountMoney}}</div>
                        <div class="itemRInfo">
                            <span>共消费{{item.ConsumeNum}}次</span>
                            <span>共消费{{item.ConsumeMoney}}元</span>
                            <span>使用时长{{item.VipDay}}天</span>
                        </div>
                    </div>
                </li>
                <!-- <li v-for="i in arr" :key="i">
                    <div class="itemL">
                        <img src="http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg">
                    </div>
                    <div class="itemR">
                        <div class="itemRTitle">123</div>
                        <div class="itemRPrice">余额￥123</div>
                        <div class="itemRInfo">
                            <span>共消费100次</span>
                            <span>共消费10000元</span>
                            <span>使用时长365天</span>
                        </div>
                    </div>
                </li> -->
            </ul>
            
            <div class="memberTip" v-if="isLength == 1">
                <i class="icon icon_member_tip"></i>
                <p>您的店铺还没有会员注册哟~</p>
            </div>
        </div>
        <p class="tip" v-if="isOver && list.length">没有更多了</p>
        <!-- </scroll-view> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            ShopId: '',
            searchKey: '',
            pageIndex: 1,
            pageSize: 10,
            isOver: false,
            isPullDown: false,
            list: [],
            arr: [1,2,3,4,5,6,7,8,9,10],
            isLength: -1,
        }
    },
    onShow() {
        wx.showLoading({
            title: '加载中',
        })
        this.isLength = -1;
        this.ShopId = wx.getStorageSync('loginInfo').ShopID || '';
        this.pageIndex = 1;
        this.isOver = false;
        this.isPullDown = false;
        this.list = [];
        this.getList();
    },
    //下拉刷新
    onPullDownRefresh() {
        // console.log('下拉')
        this.pageIndex = 1;
        this.isOver = false;
        this.isPullDown = true;
        this.getList();
    },
    //上拉触底
    onReachBottom() {
        // console.log('上拉')
        if (this.isOver) {
            return;
        }
        this.pageIndex++;
        this.getList();
    },
    methods: {
        //获取会员列表数据
        getList() {
            this.util.post({
                url:'/api/Merchant/VipMember/MemberList',
                data: {
                    ShopId: this.ShopId,
                    PageSize: this.pageSize,
                    PageIndex: this.pageIndex
                }
            }).then(res => {
                // console.log(res)

                setTimeout( _ => {
                    wx.stopPullDownRefresh();
                    wx.hideLoading();
                },100)
                
                if (!res.Body.length && this.pageIndex == 1) {
                    this.list = [];
                    this.isLength = 1;
                    return;
                }else {
                    this.isLength = -1;
                }
                // this.list = res.Body;
                if(this.isPullDown) {
                    res.Body.forEach(ele => {
                        // ele.VipDates = this.util.activityTime((new Date().getTime()-new Date(ele.VipDate).getTime())/1000);
                    });
                    this.list = res.Body;
                    this.isPullDown = false;
                }else {
                    res.Body.forEach(ele => {
                        // console.log(new Date(ele.VipDate))
                        // ele.VipDate = this.util.FmtTime(new Date()-new Date(ele.VipDate),'yyyy-MM-dd')
                        // ele.VipDates = this.util.activityTime((new Date().getTime()-new Date(ele.VipDate).getTime())/1000);
                        this.list.push(ele)
                    });
                }
                
                if (res.Body.length < this.pageSize) {
                    this.isOver = true;
                    if (this.pageIndex > 1) {
                        this.msg("没有更多信息~");
                    }
                }
                
            }).catch(err => {

            });
        },
        //会员详情
        goDetail(v,i) {
            wx.setStorageSync('memberItem',v);
            wx.navigateTo({
                url: '/pagesMoney/admin-member-detail'
            })
        },
        //搜索
        search() {

        },
        searchKeyNull() {
            this.searchKey = "";
            this.pageIndex = 1;
            this.getList();
        }
    }
}
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #eeeef4;
        background: #fafafa;
        position: relative;
    }
    .container2 {
        background: #eeeef4;
    }
    .scroll_view {
        background: #fafafa;
        
        ul {
            overflow: hidden;
            padding: 0 35rpx;
            background: #fff;
            li {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                height: 140rpx;
                padding: 30rpx 0;
                position: relative;
                &:after {
                    content: "";
                    display: block;
                    width: 100%;
                    height: 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    border-bottom: 1px solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                .itemL {
                    width: 88rpx;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 100%;
                        height: 88rpx;
                        border-radius: 50%;
                    }
                }
                .itemR {
                    flex:1;
                    height: 100%;
                    margin-left: 40rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .itemRTitle {
                        font-size: 30rpx;
                        color: #060606;
                        line-height: 30rpx;
                        font-weight: 700;
                    }
                    .itemRPrice {
                        font-size: 22rpx;
                        color: #444444;
                        line-height: 22rpx;
                    }
                    .itemRInfo {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        span {
                            padding: 10rpx;
                            font-size: 22rpx;
                            color: #666666;
                            line-height: 22rpx;
                            margin-right: 15rpx;
                            background: #eee;
                        }
                    }
                }
            }
            li:last-child {
                &:after {
                    border: none;
                }
            }
        }
        .memberTip {
            position: absolute;
            top: 260rpx;
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            p {
                color: #cccccc;
                font-size: 22rpx;
                margin-top: 20rpx;
                line-height: 1;
            }
        }
        
    }
    .tip {
        text-align: center;
        font-size: 22rpx;
        color: #999999;
        margin: 32rpx auto;
    }
</style>

