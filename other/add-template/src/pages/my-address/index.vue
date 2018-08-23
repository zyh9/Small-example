<template>
    <div class="my_address set-flex set-ver fade_in" v-if="block">
        <div class="address_con">
            <div class="pageTitle pl36">我的地址</div>
            <div v-if="noAddress" class="no_address">
                <i class="icon icon_no_address"></i>
                <p class="no_address_text">您还没有地址<br/>可点击底部按钮进行添加</p>
            </div>
            <ul class="my_address_list" v-if="addressList.length">
                <li v-for="(v,i) in addressList" :key="i" :data-index="i">
                    <div class="address_item_top" @click="setAddress(v,i)">
                        <div class="user_name_tel">
                            <div class="item_top_left">
                                <i class="icon" v-if='type==1' :class="checkId==v.Id?'icon_checked':'icon_check'"></i>
                                <p>{{v.LinkMan}}</p>
                            </div>
                            <p class="name">{{v.LinkManMobile}}</p>
                        </div>
                        <p class="pos">{{v.AddressTitle}}{{v.UserNote}}</p>
                    </div>
                    <div class="edit_item_bot">
                        <div class="edit_box" @click='delAddress(v)'><i class="icon icon_delete"></i></div>
                        <div class="edit_box" @click='goEdit(v)'><i class="icon icon_edit"></i></div>
                    </div>
                </li>
            </ul>
            <div class="address_bottom">
                <p @click="synchronize" class="set-flex set-align set-center"><i class="icon icon_synchro"></i>使用UU跑腿地址</p>
                <p @click="addAddress" class="set-flex set-align set-center"><i class="icon icon_addAddress"></i>添加新地址</p>
            </div>
        </div>
        <div class="address_mask" v-if="maskOnoff">
            <div class="mask_con">
                <h3>UU跑腿地址</h3>
                <ul class="my_address_list" v-if="uuptList.length">
                    <li v-for="(v,i) in uuptList" :key="i" :data-index="i" @click="setAddress(v,i)" style="margin:0;" :class="{select_bg:uuIndex==i}">
                        <div class="address_item_top">
                            <div class="user_name_tel">
                                <div class="item_top_left">
                                    <p>{{v.LinkMan}}</p>
                                </div>
                                <p class="name">{{v.LinkManMobile}}</p>
                            </div>
                            <p class="pos">{{v.AddressTitle}}{{v.UserNote}}</p>
                        </div>
                    </li>
                </ul>
                <div class="uu_address_bottom">
                    <p class="set-flex set-align set-center" @click="maskOnoff=false">取消</p>
                    <p class="set-flex set-align set-center" @click="uuAddress">确定</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                checkId: -1,
                addressList: [],
                startX: 0,
                delBtnWidth: 60,
                /* type:  1: 选择地址进入，可点击选择；2：我的地址进入，不可点击 */
                type: 1,
                uupt: true,
                uuptList: [],
                block: false,
                noAddress: false,
                maskOnoff: false,
                uuIndex: -1, //跑腿地址索引
            }
        },
        onLoad() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        },
        onShow() {
            this.type = this.$root.$mp.query.type;
            this.block = this.maskOnoff = false;
            this.uupt = true;
            this.uuIndex = -1;
            this.checkId = this.$root.$mp.query.addressId || wx.getStorageSync('selectAddress').Id || -1;
            this.noAddress = false;
            this.addressList = this.uuptList = [];
            this.addressInfo();
        },
        methods: {
            check() {},
            addAddress() {
                wx.removeStorageSync('address')
                wx.navigateTo({
                    url: '/pages/add-address/main?type=1'
                })
            },
            //获取所有地址
            addressInfo() {
                this.util.post({
                    url: '/api/Customer/PersonerCenter/Addresses',
                    data: {}
                }).then(res => {
                    this.block = true;
                    wx.hideLoading();
                    res.Body.forEach(e => {
                        e.AddressTitle = e.AddressTitle.split('($)').join(' ');
                        e.type = 1;
                    });
                    this.addressList = res.Body;
                    this.noAddress = this.addressList.length ? false : true;
                    if (this.type == 1) {
                        !this.addressList.length && wx.removeStorageSync('selectAddress');
                        this.checkId = this.$root.$mp.query.addressId || wx.getStorageSync('selectAddress').Id || -1;
                    }
                }).catch(err => {
                    console.log(err)
                    this.msg(err.Msg)
                })
            },
            //同步UU跑腿地址
            synchronize() {
                // if (this.uupt) {
                this.util.post({
                    url: '/api/Customer/PersonerCenter/PaotuiAddresses',
                    data: {}
                }).then(res => {
                    if (!res.Body.length) {
                        this.msg('您还没有UU跑腿的地址哦')
                    } else {
                        this.uuIndex = -1;
                        this.maskOnoff = true;
                        res.Body.forEach(e => {
                            e.Id = 0;
                            e.type = 2;
                        })
                        // this.msg('已同步UU跑腿地址')
                        this.uuptList = res.Body;
                        // this.uupt = false;
                    }
                }).catch(err => {
                    console.log(err)
                })
                // } else {
                //     this.msg('已经同步过了哦')
                // }
            },
            goEdit(item) {
                wx.setStorageSync('address', {
                    AddressNote: item.AddressNote,
                    name: item.AddressNote,
                    location: {
                        lat: item.AddressLoc.split(',')[1],
                        lng: item.AddressLoc.split(',')[0]
                    },
                    title: item.AddressTitle.split(' ')[0],
                    UserNote: item.UserNote,
                    LinkMan: item.LinkMan,
                    LinkManMobile: item.LinkManMobile,
                    CityName: item.CityName,
                    CountyName: item.CountyName
                })
                // return;
                wx.navigateTo({
                    url: '/pages/add-address/main?type=2&addressId=' + item.Id
                })
            },
            //删除某条地址
            delAddress(v) {
                this.util.post({
                    url: '/api/Customer/PersonerCenter/DeleteAddress',
                    data: {
                        AddressId: v.Id
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('删除成功')
                        setTimeout(_ => {
                            this.addressInfo();
                        }, 400)
                    } else {
                        this.msg(res.Msg);
                    }
                }).catch(err => {
                    this.msg(err);
                })
            },
            touchS(e) {
                if (e.touches.length == 1) {
                    this.startX = e.touches[0].clientX;
                }
            },
            touchM(e) {
                let index = e.currentTarget.dataset.index;
                if (e.touches.length == 1) {
                    //手指滑动开始的位置记录
                    let moveX = e.touches[0].clientX;
                    let disX = this.startX - moveX;
                    let left = 0;
                    if (disX == 0 || disX < 0) { //如果移动距离小于等于0，位置不变
                        left = "0px";
                    } else if (disX > 0) { //移动距离大于0，left值等于手指移动距离
                        left = "-" + disX + "px";
                        if (disX >= this.delBtnWidth) {
                            left = "-" + this.delBtnWidth + "px";
                        }
                    }
                    if (index != "" && index != null) {
                        this.addressList[index].leftVal = left;
                    }
                }
            },
            touchE(e) {
                let index = e.currentTarget.dataset.index;
                if (e.mp.changedTouches.length == 1) {
                    //手指抬起的位置
                    let endX = e.mp.changedTouches[0].clientX;
                    let disX = this.startX - endX;
                    let left = 0;
                    //如果距离小于删除按钮的1/2，不显示删除按钮
                    left = disX > this.delBtnWidth / 2 ? "-" + this.delBtnWidth + "px" : "0px";
                    if (index !== "" && index != null) {
                        this.addressList = this.addressList.map(item => {
                            item.leftVal = 0;
                            return item;
                        })
                        this.addressList[index].leftVal = left;
                    }
                }
            },
            setAddress(item, index) {
                if (this.type == 1) {
                    if (item.type == 2) {
                        this.uuIndex = index;
                    } else {
                        this.checkId = item.Id;
                        setTimeout(_ => {
                            item.AddressTitle = item.AddressTitle.split(' ').join('($)');
                            wx.setStorageSync('selectAddress', item)
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 200)
                    }
                } else {
                    this.uuIndex = index;
                }
            },
            uuAddress() {
                if (this.uuIndex > -1) {
                    let item = this.uuptList[this.uuIndex];
                    this.util.post({
                            url: '/api/Customer/PersonerCenter/UpdateAddress',
                            data: {
                                Id: 0,
                                AddressTitle: item.AddressTitle,
                                AddressNote: item.AddressNote,
                                AddressLoc: item.AddressLoc,
                                UserNote: item.UserNote,
                                LinkMan: item.LinkMan,
                                LinkManMobile: item.LinkManMobile,
                                LinkManSex: item.LinkManSex,
                                CityName: item.CityName,
                                CountyName: item.CountyName,
                                Type: 2
                            }
                        })
                        .then(res => {
                            if (res.State == -1010 || res.State == 1) {
                                if (res.State == -1010) {
                                    this.msg(res.Msg)
                                } else {
                                    this.checkId = res.Body.AddressId;
                                    this.maskOnoff = false;
                                    if (this.type == 1) {
                                        item.AddressTitle = item.AddressTitle.split(' ').join('($)');
                                        item.Id = res.Body.AddressId;
                                        wx.setStorageSync('selectAddress', item)
                                    }
                                    this.addressInfo();
                                }
                            }
                        }).catch(err => {
                            this.msg(err.Msg)
                        })
                } else {
                    this.msg('您还没有选择地址哦')
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">
    page {
        background-color: #f5f5f5;
    }
    .my_address {
        position: relative;
        height: 100%;
        padding-bottom: 104rpx;
        box-sizing: border-box;
    }
    .address_con {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        .pl36 {
            padding-left: 36rpx;
            background-color: #fff;
        }
        .address_bottom {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            height: 104rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top: 1rpx solid #ededde;
            background: #fff;
            padding: 0 36rpx;
            box-sizing: border-box;
            z-index: 10;
            p {
                height: 80rpx;
                width: 50%;
                text-align: center;
                line-height: 50rpx;
                font-size: 26rpx;
                box-sizing: border-box;
                border-radius: 6rpx;
                .icon {
                    margin-right: 10rpx;
                }
            }
            p:nth-of-type(1) {
                margin-right: 24rpx;
                color: #ff8b03;
                border: 1px solid #ff8b03;
            }
            p:nth-of-type(2) {
                background-color: #ff4d3a;
                color: #fff;
                border: 1px solid #ff4d3a;
            }
        }
    }
    .my_address_list {
        li {
            box-sizing: border-box; // transition: margin-left 0.6s ease;
            margin-bottom: 20rpx;
            background-color: #fff;
            .edit_box {
                padding: 12rpx;
                line-height: 1;
                margin: 0 24rpx;
            }
            .address_item_top {
                position: relative;
                margin: 0 36rpx;
                padding: 30rpx 0;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
                .user_name_tel {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .item_top_left {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        i {
                            margin-right: 20rpx;
                        }
                    }
                    p {
                        font-size: 30rpx;
                        color: #1a1a1a;
                    }
                }
                .pos {
                    margin-top: 10rpx;
                    font-size: 26rpx;
                    color: #666;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
            }
            .edit_item_bot {
                padding: 20rpx 36rpx;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
        } // li:nth-last-of-type(1){
        //     margin-bottom: 0;
        // }
    }
    .no_address {
        position: absolute;
        top: 120rpx;
        left: 0;
        right: 0;
        bottom: 104rpx;
        text-align: center;
        background-color: #fff;
        i {
            margin-top: 250rpx;
        }
        .no_address_text {
            font-size: 24rpx;
            color: #999;
        }
    }
    .address_mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10;
        transition: all 0.1s ease;
        display: flex;
        .mask_con {
            margin: auto;
            width: 600rpx;
            height: 840rpx;
            border-radius: 8rpx;
            background-color: #fff;
            overflow: hidden;
            position: relative;
            h3 {
                text-align: center;
                font-size: 36rpx;
                color: #1a1a1a;
                padding: 46rpx 0 20rpx;
                line-height: 40rpx;
                height: 40rpx;
            }
            ul {
                height: 630rpx;
                overflow-x: hidden;
                overflow-y: scroll;
                li {
                    background-color: #fff;
                }
                .select_bg {
                    background-color: #fff4f2;
                }
            }
            .uu_address_bottom {
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                height: 104rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                border-top: 1rpx solid #ededde;
                background: #fff;
                padding: 0 36rpx;
                box-sizing: border-box;
                p {
                    height: 72rpx;
                    width: 50%;
                    text-align: center;
                    line-height: 50rpx;
                    font-size: 26rpx;
                    box-sizing: border-box;
                    border-radius: 6rpx;
                }
                p:nth-of-type(1) {
                    margin-right: 24rpx;
                    color: #1a1a1a;
                    border: 1px solid #999;
                }
                p:nth-of-type(2) {
                    background-color: #ff4d3a;
                    color: #fff;
                    border: 1px solid #ff4d3a;
                }
            }
        }
    }
</style>
