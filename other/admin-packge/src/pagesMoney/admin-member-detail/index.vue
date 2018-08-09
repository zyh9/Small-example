<template>
    <div class="container">
        <div class="memberInfo">
            <div class="memberInfoTop" @click="go">
                <div class="memberInfoTopL">
                    <div class="memberInfoTopImg">
                        <img :src="memberItem.MemberHeader">
                    </div>
                    <div class="memberInfoTopText">
                        <p>
                            <span>{{memberItem.MemberName}}</span>
                        </p>
                    </div>
                </div>
                <i class="icon icon_arrowRight"></i>
            </div>
            <div class="memberInfoBottom">
                <div>
                    <p>账户余额</p>
                    <p>{{memberItem.AccountMoney}}</p>
                </div>
                <div>
                    <p>累计消费</p>
                    <p>{{memberItem.ConsumeMoney}}</p>
                </div>
                <div>
                    <p>开始时间</p>
                    <p>{{timer}}</p>
                </div>
            </div>
            <div class="memberListNav">
                <div class="NavItem" @click="switchList(1)">
                    <div :class="{active:type == 1}">
                        <span>现金消费</span>
                        <!-- <p>现金消费<p> -->
                        <i></i>
                    </div>
                </div>
                <div class="NavItem" @click="switchList(2)">
                    <div :class="{active:type == 2}">
                        <span>充值消费</span>
                        <!-- <p>充值消费</p> -->
                        <i></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="memberList">
            <scroll-view scroll-y="true" class="scroll_view" :style="{height:winHeight+'px'}" @scrolltolower='scrolltolower'>
                <div class="memberListCont">
                    <div class="listItem" v-for="(v,i) in list" :key="i">
                        <div class="listItemText">
                            <span>{{v.SubjectName}}</span>
                            <span>{{v.TradeMoney}}元</span>
                        </div>
                        <div class="listItemDate">
                            {{v.TradeTime}}
                        </div>
                    </div>

                    <div class="listItemNo" v-if="list.length > 0 && isOver">没有更多了</div>
                    <div class="memberLack" v-if="list.length == 0">
                        <i class="icon icon_member_lack"></i>
                        <p>暂时没有消费记录哦~</p>
                    </div>
                </div>
            </scroll-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ShopId: '',
            memberItem: {},
            isOver: false,
            type: -1,
            list: [],
            pageIndex: 1,
            pageSize: 10,
            winHeight: '',
            timer: ''
        }
    },
    onShow() {
        //设置消费高度
        let query = wx.createSelectorQuery();
            query.select('.memberInfo').boundingClientRect();
            query.exec(res => {
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        this.winHeight = res.windowHeight - height;
                    }
                })
            })
        this.type = -1;
        this.ShopId = wx.getStorageSync('loginInfo').ShopID || '';
        this.memberItem = wx.getStorageSync('memberItem') ? wx.getStorageSync('memberItem') : {};
        // this.memberItem.VipDate = this.util.FmtTime(new Date(this.memberItem.VipDate),'yyyy-MM-dd')
        this.timer = this.memberItem.VipDate.split(' ')[0];
        this.list = [];
        this.isOver = false;
        this.switchList(1);
    },
    methods: {
        //详情
        go() {
            wx.navigateTo({
                url: '/pagesMoney/admin-member-personInfo'
            })
        },
        //触底加载
        scrolltolower() {
            if (this.isOver) {
                return;
            }
            this.pageIndex++;
            this.getData();
        },
        //切换
        switchList(type) {
            if(this.type == type) {
                return
            }
            this.type = type;
            this.pageIndex = 1;
            this.list = [];
            this.isOver = false;
            this.getData();
            wx.showLoading({
                title: '加载中',
            })
        },
        //获取流水
        getData() {
            this.util.post({
                url:'/api/Merchant/VipMember/MemberTradeList',
                data: {
                    VipNo: this.memberItem.VipNo,
                    ShopId: this.ShopId,
                    TradeType: this.type,
                    PageSize: this.pageSize,
                    PageIndex: this.pageIndex
                }
            }).then(res => {
                // console.log(res)
                
                res.Body.forEach(element => {
                    this.list.push(element)
                });
                setTimeout( _ => {
                    wx.hideLoading();
                },500)

                if (res.Body.length < this.pageSize) {
                    this.isOver = true;
                    if (this.pageIndex > 1) {
                        this.msg("没有更多信息~");
                    }
                }
            }).catch(err => {
                this.msg(err.Msg)
            })
        }
        
    }
}
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #eeeef4;
        position: relative;
    }
    .scroll_view {
        height: 815rpx;
        background: #fff;
    }
    .memberInfo {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        
        .memberInfoTop {
            padding: 0 36rpx;
            background: #fff;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 135rpx;
            position: relative;
            &:after {
                content: "";
                display: block;
                width: 100%;
                height: 0;
                position: absolute;
                bottom: -1rpx;
                left: 36rpx;
                border-bottom: 1px solid #ebebeb;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            .memberInfoTopL {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                flex: 1;
            }
            .memberInfoTopImg {
                width: 96rpx;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                img {
                    width: 96rpx;
                    height: 96rpx;
                    border-radius: 50%;
                }
            }
            .memberInfoTopText {
                margin-left: 24rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                p {
                    height: 32rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    span {
                        color: #000000;
                        font-size: 32rpx;
                        font-weight: 700;
                        line-height: 32rpx;
                    }
                    // span:last-child {
                    //     color: #999999;
                    //     font-size: 24rpx;
                    //     line-height: 24rpx;
                    // }
                }
            }
        }
        .memberInfoBottom {
            padding: 0 36rpx;
            background: #fff;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 130rpx;
            div {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                text-align: center;
                height: 64rpx;
                p {
                    font-size: 24rpx;
                    color: #999999;
                    line-height: 24rpx;
                }
                p:last-child {
                    font-size: 32rpx;
                    color: #000000;
                    line-height: 32rpx;
                    margin-top: 15rpx;
                }
            }
        }
        .memberListNav {
            padding: 0 36rpx;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            height: 107rpx;
            background: #fff;
            margin-top: 20rpx;
            position: relative;
            &:after {
                content: "";
                display: block;
                width: 100%;
                height: 0;
                position: absolute;
                bottom: -1rpx;
                left: 0;
                border-bottom: 1px solid #ebebeb;
                transform: scaleY(0.5);
                transform-origin: 0 0;
                z-index: 99999;
            }
            .NavItem {
                height: 100%;
                flex: 1;
                text-align: center;
                div {
                    height: 100%;
                    color: #999999;
                    font-size: 28rpx;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    span {
                        line-height: 28rpx;
                    }
                }
                .active {
                    color: #4c4c4c;
                    font-weight: 700;
                    position: relative;
                    i {
                        // margin-top: 25rpx;
                        width: 73rpx;
                        height: 4rpx;
                        background: #0863ee;
                        position: absolute;
                        bottom: 0;
                    }
                }
            }
        }
    }
    .memberList {
        background: #eeeef4;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .memberListCont {
            padding: 0 36rpx;
            padding-top: 14rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            background: #fff;
            .listItem {
                // height: 144rpx;
                padding: 30rpx 0;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
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
                .listItemText {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    // margin-top: 30rpx;
                    span {
                        font-size: 28rpx;
                        color: #1a1a1a;
                    }
                    span:last-child {      

                    }
                }
                .listItemDate {
                    margin-top: 20rpx;
                    font-size: 24rpx;
                    color: #999999;
                    text-align: left;
                }
            }
            .listItemNo {
                text-align: center;
                color: #999999;
                font-size: 22rpx;
                line-height: 22rpx;
                // margin-top: 30rpx;
                margin: 30rpx auto;
            }
            .memberLack {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                margin-top: 130rpx;
                p {
                    font-size: 22rpx;
                    line-height: 22rpx;
                    color: #cccccc;
                    text-align: center;
                    margin-top: 30rpx;
                }
            }
        }
    }
</style>


