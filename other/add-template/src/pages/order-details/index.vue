<template>
    <div class="order_details fade_in" v-if="block">
        <div class="order_con">
            <div class="order_details_top">
                <h3 class="title" @click="tracking">{{orderInfo.stateText}}
                    <i v-if='orderInfo.State>3||orderInfo.State<0' class="icon icon_arrowRight"></i>
                </h3>
                <p class='tip' v-if='orderInfo.State>=4&&orderInfo.State<10'>{{tips}}</p>
                <ul class="lis_bottom_btn">
                    <li v-if='orderInfo.State==0||orderInfo.State==1||(orderInfo.State==2&&orderInfo.CancelApplyState==0)' @click="cancelOrder">取消订单</li>
                    <li @click='againOrder' v-if='orderInfo.State==10||orderInfo.State<0' :class="{btn_other:orderInfo.State==10}">再来一单</li>
                    <li class="btn_other" v-if="orderInfo.State==4" @click="okOrder">确认收货</li>
                    <li v-if='orderInfo.State==2&&orderInfo.CancelApplyState==1' @click="cancelOrder">已申请取消</li>
                    <li class="btn_other" v-if='orderInfo.State==0' @click='OrderRePay'>继续支付</li>
                </ul>
                <!-- 跑腿配送 -->
                <div class="uu_man_info" @click='tel(orderInfo.PaotuiInfo.DriverMobile)' v-if='orderInfo.PaotuiInfo!=null&&orderInfo.ExpressType==1&&(orderInfo.State==4||orderInfo.State==5||orderInfo.State==10)'>
                    <div class="info_left">
                        <img :src="orderInfo.PaotuiInfo.DriverPhoto?orderInfo.PaotuiInfo.DriverPhoto:'https://otherfiles-ali.uupt.com/Stunner/FE/C/man.png'" alt="" class="left_icon">
                        <div class="info_text">
                            <p class="company">UU跑腿</p>
                            <p class="uu_man_name">{{orderInfo.PaotuiInfo.DriverName}}为您服务</p>
                        </div>
                    </div>
                    <i class="icon icon_tel"></i>
                </div>
                <!-- 快递配送 -->
                <div class="uu_man_info" v-if='orderInfo.ExpressInfo!=null&&orderInfo.ExpressType==2&&(orderInfo.State==4||orderInfo.State==5||orderInfo.State==10)'>
                    <div class="info_left">
                        <i class="icon icon_express left_icon"></i>
                        <div class="info_text">
                            <p class="company">{{orderInfo.ExpressInfo.CompanyNamge}}</p>
                            <p class="uu_man_name">{{orderInfo.ExpressInfo.OrderId}}</p>
                        </div>
                        <span class="copy_info" @click='copyInfo(orderInfo.ExpressInfo.OrderId)'>复制</span>
                    </div>
                </div>
                <!-- 达达配送 -->
                <div class="uu_man_info" @click='tel(orderInfo.PaotuiInfo.DriverMobile)' v-if='orderInfo.PaotuiInfo!=null&&orderInfo.ExpressType==3&&(orderInfo.State==4||orderInfo.State==5||orderInfo.State==10)'>
                    <div class="info_left">
                        <i class="icon icon_dada left_icon"></i>
                        <div class="info_text">
                            <p class="company">达达跑腿</p>
                            <p class="uu_man_name">{{orderInfo.PaotuiInfo.DriverName}}为您服务</p>
                        </div>
                    </div>
                    <i class="icon icon_tel"></i>
                </div>
                <!-- 商家自送 -->
                <div class="uu_man_info" @click='tel(orderInfo.PaotuiInfo.DriverMobile)' v-if='orderInfo.PaotuiInfo!=null&&orderInfo.ExpressType==4&&(orderInfo.State==4||orderInfo.State==5||orderInfo.State==10)'>
                    <div class="info_left">
                        <i class="icon icon_shop_set left_icon"></i>
                        <div class="info_text">
                            <p class="uu_man_name">商家自送</p>
                        </div>
                    </div>
                    <i class="icon icon_tel"></i>
                </div>
            </div>
            <div class="order_details_con">
                <div class="shop_info_sum">
                    <!-- <img class="fade_in" :src="orderInfo.ShopLogo+'?x-oss-process=image/resize,w_100/format,jpg'" alt=""> -->
                    <p>{{orderInfo.ShopName}}</p>
                </div>
                <ul class="con_order_list">
                    <li v-for="(v,i) in orderInfo.OrderGoods" :key="i" class="con_list_item">
                        <img class="fade_in" :src="v.GoodMasterPic+'?x-oss-process=image/resize,w_100/format,jpg'" alt="">
                        <div class="item">
                            <p class="name">{{v.GoodName}}</p>
                            <p class="spec">{{v.SpecName=="默认"?'':v.SpecName}}</p>
                            <p class="num">X{{v.GoodNum}}</p>
                        </div>
                        <div class="sum">
                            <i class="icon icon_discount_text" v-if="v.GoodType==-1"></i>
                            <span>¥</span> {{v.TotalPrice}}
                        </div>
                    </li>
                </ul>
                <div class="consume bor_t">
                    <p class="consume_l">配送费</p>
                    <p class="consume_r">
                        <i v-if="orderInfo.PaotuiMoneyOff">已减{{orderInfo.PaotuiMoneyOff}}元</i>
                        <span>¥</span> {{orderInfo.PaotuiMoney}}
                    </p>
                </div>
                <div class="consume">
                    <p class="consume_l">打包费</p>
                    <p class="consume_r">
                        <span>¥</span> {{orderInfo.PackageMoney}}
                    </p>
                </div>
                <div class="consume" v-if="orderInfo.CouponAmountMoney>0">
                    <p class="consume_l">
                        <i class="icon icon_coupon"></i>
                        <span>店铺优惠券</span>
                    </p>
                    <p class="consume_r color_text">
                        -<span>¥</span> {{orderInfo.CouponAmountMoney}}
                    </p>
                </div>
                <div class="consume_sum">
                    <p class="consume_l">小计</p>
                    <p class="consume_r">
                        <i v-if="orderInfo.orderSumPrice>0">共节省{{orderInfo.orderSumPrice}}元</i>
                        <span>¥</span> {{orderInfo.TotalMoney}}
                    </p>
                </div>
                <div class="shop_info_list">
                    <div class="shop_tel" @click="tel(orderInfo.ShopMobile)">
                        <i class="icon icon_shop_tel icon_info"></i>
                        <p>商家电话</p>
                    </div>
                    <div class="shop_wx" @click="copyInfo(orderInfo.ShopWechat,1)">
                        <i class="icon icon_shop_wx icon_info"></i>
                        <p>商家微信</p>
                    </div>
                </div>
            </div>
            <div class="distribution_info">
                <div class="distribution">
                    <p>配送信息</p>
                </div>
                <div class="options">
                    <p>支付方式</p>
                    <p>{{orderInfo.PayType==1?'微信支付':'会员卡支付'}}</p>
                </div>
                <div class="options other">
                    <p>备注</p>
                    <p>{{orderInfo.Remark?orderInfo.Remark:'无'}}</p>
                </div>
                <div class="options">
                    <p>配送方式</p>
                    <p>{{orderInfo.ExpressType== 2 ? '快递配送' : orderInfo.ExpressType== 4?'商家自送':'跑腿配送'}}</p>
                </div>
                <div class="options other">
                    <p>收货地址</p>
                    <p>{{orderAdress}}</p>
                </div>
            </div>
            <div class="order_list_info">
                <div class="order_info">
                    <p>订单信息</p>
                </div>
                <div class="options">
                    <p>订单号</p>
                    <div class="options_r">
                        <p>{{orderInfo.OrderID}}</p>
                        <span @click='copyInfo(orderInfo.OrderID)'>复制</span>
                    </div>
                </div>
                <div class="options">
                    <p>订单时间</p>
                    <p>{{orderInfo.OrderCreateTime}}</p>
                </div>
            </div>
        </div>
        <div class="order_btn">
            <i class="icon icon_look_map" @click="mapOnoff=true" v-if="(orderInfo.ExpressType== 1||orderInfo.ExpressType== 3)&&orderInfo.State>=4&&orderInfo.State<10"></i>
            <i class="icon icon_go_index" v-if="goIndexBlock" @click="goIndex"></i>
        </div>
        <div class="mask" v-if='isTracking||saleMask' @click='isTracking=false,saleMask=false'></div>
        <div class="orderTracking" v-if='isTracking'>
            <h2 class="title">订单状态跟踪</h2>
            <div class="main">
                <ul>
                    <li v-for='(v,i) in trackingList' :key='i'>
                        <div class="text">{{v.StateName}}</div>
                        <div class="time">{{v.StateTime}}</div>
                    </li>
                </ul>
            </div>
            <div class="close" @click='isTracking=false,saleMask=false'>关闭</div>
        </div>
        <div class="after_sale" :class="{after_sale_active:saleMask}" v-if="saleMask">
            <div class="after_sale_item">
                <div class="after_sale_title">
                    <p>售后申请</p>
                </div>
                <ul class="after_sale_list">
                    <li class="after_sale_lis" v-for="(v,i) in saleList" :key="i">
                        <i class="icon icon_red_tel" v-if="i==0"></i>
                        <i class="icon icon_refund" v-if="i==1"></i>
                        <p>{{v.text}}</p>
                    </li>
                </ul>
                <div class="after_sale_other">
                    <div class="after_sale_other_lis mb60">
                        <h3>申请须知：</h3>
                        <p>① 建议先与商家沟通后再申请售后<br/>② 售后仅能在订单完成后24小时内申请</p>
                    </div>
                    <div class="after_sale_other_lis">
                        <h3>退款须知：</h3>
                        <p>店铺同意退款后，需通过微信退款，预计3-5个工作日，请及时联系商家处理</p>
                    </div>
                </div>
            </div>
            <div class="after_sale_close" @click="saleMask=false">关闭</div>
        </div>
        <div class="cancel_mask" v-if="false">
            <div class="cancel_con">
                <h3>售后申请提示</h3>
                <p>建议您先跟商家沟通后再申请售后，商家处理会更加高效</p>
                <div class="btn_sum">
                    <div class="btn btn_left">继续申请</div>
                    <div class="btn btn_right">立即联系</div>
                </div>
            </div>
        </div>
        <div class="cancel_mask" v-if="false">
            <div class="cancel_con">
                <h3>取消确认</h3>
                <p>跑男已接单，此时取消将扣除跑男上门费，剩余费用将退回</p>
                <span class="deduct">本次将扣取上门费：15元</span>
                <div class="btn_sum">
                    <div class="btn btn_left">确认取消</div>
                    <div class="btn btn_right">再想想</div>
                </div>
            </div>
        </div>
        <div class="map_mask fade_in" :class="{map_mask_active:mapOnoff}">
            <map id="myMap" :longitude="longitude" :latitude="latitude" scale="15" :markers="markers" include-points="" :style="{height:winHeight+'px'}"></map>
            <cover-view class="close_map" @click="mapOnoff=false">
                <cover-image class="icon_close_map" src="https://otherfiles-ali.uupt.com/Stunner/FE/C/black-close.png" />
            </cover-view>
        </div>
    </div>
</template>

<script>
    import gcoord from 'gcoord';
    export default {
        data() {
            return {
                orderInfo: [],
                isTracking: false,
                trackingList: [],
                block: false,
                timer: null,
                markers: [],
                latitude: 0,
                longitude: 0,
                shopMap: '',
                userMap: '',
                manMap: '',
                tips: '',
                mapErr: true,
                saleMask: false, //售后弹窗
                saleList: [{
                    text: '预先联系商家'
                }, {
                    text: '直接申请退款'
                }],
                forOrder: false,
                mapOnoff: false,
                winHeight: 0, //高度
                scrollTop: 0, //滚动距离
                goIndexBlock: false, //回到首页按钮
            }
        },
        onLoad() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.forOrder = false;
            this.mapOnoff = false;
            this.goIndexBlock = false;
        },
        onReady() {
            if (this.$mp.query.from && this.$mp.query.from == 1) {
                //服务通知进入
                this.goIndexBlock = true;
            }
            clearInterval(this.timer);
            this.timer = null;
            this.isTracking = false;
            this.saleMask = false;
            this.tips = '';
            this.orderDetails()
        },
        methods: {
            /* 订单状态文字 */
            orderLabels(state, CancelApplyState, ExpressType) {
                // console.log(ExpressType)
                let text = '';
                switch (state) {
                    case 0:
                        text = '待支付';
                        break;
                    case 1:
                        text = '等待商家接单';
                        break;
                    case 2:
                        switch (CancelApplyState) {
                            case 0:
                                text = '商家已接单';
                                break;
                            case 1:
                                /* 用户发起申请 */
                                text = '已申请取消，待商家确认';
                                break;
                            case -1:
                                text = '商家已接单';
                                break;
                                // case 2:
                                // /* 商户同意取消 */
                                // break;
                        }
                        break;
                    case 3:
                        text = '正在配货';
                        break;
                    case 4:
                        text = ExpressType == 2 || ExpressType == 4 ? '已发货' : '跑男已接单';
                        break;
                    case 5:
                        text = '跑男已取货';
                        break;
                    case 10:
                        text = '已完成';
                        break;
                    case -1:
                    case -2:
                    case -3:
                    case -4:
                    case -5:
                    case -6:
                    case -7:
                    case -8:
                    case -9:
                        text = '已取消';
                        break;
                }
                return text;
            },
            tel(tel) {
                wx.makePhoneCall({
                    phoneNumber: tel
                })
            },
            copyInfo(info, num) {
                if (num) {
                    console.log('微信')
                    if (info == '') {
                        this.msg('商家未提供微信联系方式')
                    } else {
                        wx.setClipboardData({
                            data: `${info}`,
                            success: res => {
                                this.msg("复制成功")
                            },
                            fail: err => {
                                this.msg("复制失败")
                            }
                        })
                    }
                } else {
                    console.log('非微信')
                    wx.setClipboardData({
                        data: `${info}`,
                        success: res => {
                            this.msg("复制成功")
                        },
                        fail: err => {
                            this.msg("复制失败")
                        }
                    })
                }
            },
            /* 再次生成订单信息 */
            OrderRePay() {
                wx.redirectTo({
                    url: `/pages/uu-pay/main?OrderId=${this.orderInfo.OrderID}&shopId=${this.orderInfo.ShopID}`
                })
            },
            async requireImg(ExpressType, State) {
                this.shopMap = await this.util.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/shop-map.png');
                this.userMap = await this.util.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/user-map.png');
                this.manMap = await this.util.downImg(ExpressType == 1 ? 'https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/uupt-map.png' : 'https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/dada-map.png');
                // this.orderInfo.ShopLoc 店铺坐标
                // this.orderInfo.PaotuiInfo.DriverLastLoc 跑实时坐标
                // this.orderInfo.ReceiverLoc 收货人坐标
                let ShopLoc = this.trans({
                    latitude: this.orderInfo.ShopLoc.split(',')[1],
                    longitude: this.orderInfo.ShopLoc.split(',')[0],
                });
                let ReceiverLoc = this.trans({
                    latitude: this.orderInfo.ReceiverLoc.split(',')[1],
                    longitude: this.orderInfo.ReceiverLoc.split(',')[0],
                });
                let DriverLastLoc;
                if (ExpressType == 1) {
                    console.log('跑腿订单');
                    if (this.orderInfo.PaotuiInfo.DriverLastLoc) {
                        DriverLastLoc = this.trans({
                            latitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[1],
                            longitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[0],
                        })
                    }
                    //  else {
                    //     this.mapErr = false;
                    // }
                } else {
                    console.log('达达订单');
                    if (this.orderInfo.PaotuiInfo.DriverLastLoc) {
                        DriverLastLoc = this.gdMap({
                            latitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[1],
                            longitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[0],
                        })
                    }
                    //  else {
                    //     this.mapErr = false;
                    // }
                }
                // console.log(ShopLoc, DriverLastLoc, ReceiverLoc)
                //跑男坐标存在
                if (this.orderInfo.PaotuiInfo.DriverLastLoc) {
                    this.markers = [{
                        iconPath: this.shopMap,
                        id: 0,
                        latitude: ShopLoc.latitude,
                        longitude: ShopLoc.longitude,
                        width: 30,
                        height: 36
                    }, {
                        iconPath: this.manMap,
                        id: 1,
                        latitude: DriverLastLoc.latitude,
                        longitude: DriverLastLoc.longitude,
                        width: 40,
                        height: 50
                    }, {
                        iconPath: this.userMap,
                        id: 2,
                        latitude: ReceiverLoc.latitude,
                        longitude: ReceiverLoc.longitude,
                        width: 30,
                        height: 36
                    }];
                    this.latitude = DriverLastLoc.latitude;
                    this.longitude = DriverLastLoc.longitude;
                    if (State == 4) {
                        let num = Math.floor(this.distance(DriverLastLoc.latitude, DriverLastLoc.longitude, ShopLoc.latitude, ShopLoc.longitude) * 1000);
                        this.tips = `跑男距店${num}m`;
                    } else {
                        let num = Math.floor(this.distance(DriverLastLoc.latitude, DriverLastLoc.longitude, ReceiverLoc.latitude, ReceiverLoc.longitude) * 1000);
                        this.tips = `跑男距您${num}m`;
                    };
                    setTimeout(_ => {
                        let query = wx.createSelectorQuery();
                        query.select('.order_details_top').boundingClientRect()
                        query.exec(res => {
                            let height = res[0].height;
                            wx.getSystemInfo({
                                success: res => {
                                    // console.log(res)
                                    this.winHeight = res.windowHeight - height;
                                }
                            })
                        })
                    }, 200)
                }
                // else {
                //     this.mapErr = false;
                // }
            },
            distance(lat1, lng1, lat2, lng2) {
                var radLat1 = lat1 * Math.PI / 180.0;
                var radLat2 = lat2 * Math.PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137;
                s = Math.round(s * 10000) / 10000;
                return s * 10
            },
            //订单详情
            orderDetails() {
                this.util.post({
                    url: '/api/Customer/Order/OrderDetail',
                    data: {
                        OrderID: this.$mp.query.orderId
                    }
                }).then(res => {
                    wx.hideLoading();
                    this.block = true;
                    this.orderInfo = Object.assign({}, res.Body, {
                        stateText: this.orderLabels(res.Body.State, res.Body.CancelApplyState, res.Body.ExpressType)
                    })
                    this.orderInfo.orderSumPrice = (Math.round(this.orderInfo.PaotuiMoneyOff * 10000) + Math.round(this.orderInfo.CouponAmountMoney * 10000)) / 10000;
                    // console.log(this.orderInfo.orderSumPrice)
                    //地图所需信息 （不包含快递和商家自送）
                    if ((this.orderInfo.ExpressType == 1 || this.orderInfo.ExpressType == 3) && this.orderInfo.State >= 4 && this.orderInfo.State < 10) {
                        // console.log(this.util.downImg)
                        // this.mapOnoff = true;
                        this.forOrder = true;
                        this.requireImg(this.orderInfo.ExpressType, this.orderInfo.State).catch(err => {
                            this.msg('地图信息获取失败')
                        })
                    } else {
                        this.mapOnoff = false; //地图去除
                    }
                    //订单跟踪信息 (不包含商家自送)
                    if (this.orderInfo.State > 3 || this.orderInfo.State < 0) {
                        this.orderTracking()
                    }
                    //订单超时取消 => 跳转至订单列表页
                    if (this.orderInfo.State == -1 || this.orderInfo.State == -9) {
                        if (this.$mp.query.type == 1) {
                            setTimeout(_ => {
                                /* 支付成功跳转订单列表 */
                                wx.redirectTo({
                                    url: '/pages/my-order/main'
                                })
                            }, 800)
                        } else {
                            setTimeout(_ => {
                                /* 支付成功跳转订单列表 */
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 800)
                        }
                    }
                    if (this.orderInfo.State == 10) {
                        this.tips = '感谢光临，很高兴为您服务';
                        this.mapOnoff = false; //地图去除
                        this.timer = null;
                        clearInterval(this.timer);
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            //取消订单
            cancelOrder() {
                if (this.orderInfo.CancelApplyState == 1) {
                    this.msg('已申请取消，请耐心等待商户处理');
                    return
                }
                this.util.post({
                    url: '/api/Customer/Order/CancelOrder',
                    data: {
                        OrderId: this.$mp.query.orderId
                    }
                }).then(res => {
                    this.orderDetails();
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //确认订单
            okOrder() {
                this.util.post({
                    url: '/api/Customer/Order/FinishOrder',
                    data: {
                        OrderId: this.$mp.query.orderId
                    }
                }).then(res => {
                    console.log(res)
                    this.msg('您已确认收货');
                    this.orderDetails();
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 订单跟踪 */
            orderTracking() {
                this.util.post({
                    url: '/api/Customer/Order/OrderStateTrace',
                    data: {
                        OrderID: this.$mp.query.orderId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.trackingList = res.Body;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 再来一单 */
            againOrder() {
                wx.navigateTo({
                    url: `/pages/submit-order/main?orderId=${this.orderInfo.OrderID}&shopId=${this.orderInfo.ShopID}&temp=${this.orderInfo.ShopTemplateId}`
                });
            },
            tracking() {
                if (this.orderInfo.State > 3 || this.orderInfo.State < 0) {
                    this.isTracking = true;
                }
            },
            trans(pos) {
                // console.log(pos)
                let {
                    latitude,
                    longitude
                } = pos;
                var result = gcoord.transform(
                    [latitude, longitude], // 经纬度坐标
                    gcoord.BD09, // 当前坐标系
                    gcoord.WGS84, // 目标坐标系
                );
                let location = {
                    latitude: String(result[0]),
                    longitude: String(result[1])
                }
                // console.log(location)
                return location;
            },
            gdMap(pos) {
                // console.log(pos)
                let {
                    latitude,
                    longitude
                } = pos;
                var result = gcoord.transform(
                    [latitude, longitude], // 经纬度坐标
                    gcoord.GCJ02, // 当前坐标系
                    gcoord.WGS84, // 目标坐标系
                );
                let location = {
                    latitude: String(result[0]),
                    longitude: String(result[1])
                }
                // console.log(location)
                return location;
            },
            goIndex() {
                wx.redirectTo({
                    url: `/pages/my-store/main?ShopId=${this.orderInfo.ShopID}&temp=${this.orderInfo.ShopTemplateId}`
                })
            }
        },
        components: {},
        computed: {
            orderAdress: function() {
                return this.orderInfo.ReceiveAddress ? this.orderInfo.ReceiveAddress.split('($)').join(' ') : '';
            }
        },
        watch: {
            forOrder: function(newVal, oldVal) {
                if (newVal) {
                    this.forOrder = false;
                    //轮训前清除上一个定时器
                    clearInterval(this.timer)
                    this.timer = null;
                    this.timer = setInterval(_ => {
                        this.orderDetails();
                    }, 7000)
                }
            },
        },
        onUnload() {
            clearInterval(this.timer)
            this.timer = null;
        }
    }
</script>

<style lang="less">
    .bor_t {
        position: relative;
        &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            border-bottom: 1px solid #ebebeb;
            position: absolute;
            top: 0;
            left: 0;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
    }
    .order_details {
        background: #ebebeb;
        position: relative;
        height: 100%;
        overflow: hidden;
        .order_con {
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        .order_details_top {
            margin-bottom: 20rpx;
            background: #fff;
            overflow: hidden;
            position: relative;
            .title {
                font-size: 36rpx;
                color: #000;
                font-weight: 700;
                height: 60rpx;
                line-height: 60rpx;
                padding: 0 35rpx;
                text-align: center;
                margin-top: 46rpx;
                margin-bottom: 4rpx;
                .icon {
                    margin-right: -25rpx;
                }
            }
            .tip {
                text-align: center;
                font-size: 22rpx;
                color: #adadad;
                line-height: 30rpx;
                margin-bottom: 6rpx;
            }
            .uu_man_info {
                display: flex;
                padding: 20rpx 0;
                margin: 0 35rpx;
                align-items: center;
                justify-content: space-between;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                .info_left {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .left_icon {
                        width: 80rpx;
                        height: 80rpx;
                        margin-right: 30rpx;
                    }
                    .info_text {
                        flex: 1;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        .company {
                            font-size: 28rpx;
                            color: #555;
                        }
                        .uu_man_name {
                            font-size: 30rpx;
                            color: #000;
                        }
                    }
                    .copy_info {
                        font-size: 22rpx;
                        color: #ff4d3a;
                        border: 1rpx solid #ff4d3a;
                        line-height: 36rpx;
                        height: 36rpx;
                        width: 62rpx;
                        text-align: center;
                        transform: translateY(16rpx);
                    }
                }
                .uu_man_tel {
                    width: 34rpx;
                    height: 34rpx;
                }
            }
            .lis_bottom_btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20rpx 120rpx 30rpx;
                margin: 0 35rpx;
                li {
                    width: 184rpx;
                    height: 64rpx;
                    background: #fff;
                    color: #1a1a1a;
                    font-size: 26rpx;
                    margin-left: 20rpx;
                    line-height: 64rpx;
                    text-align: center;
                    box-sizing: border-box;
                    position: relative;
                    background-color: #fff;
                    border-radius: 6rpx;
                    &:before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        bottom: -50%;
                        left: -50%;
                        right: -50%;
                        -webkit-transform: scale(0.5);
                        transform: scale(0.5);
                        border: 1px solid #999;
                        border-radius: 6rpx;
                    }
                }
                .btn_other {
                    color: #fff;
                    background-color: #ff4d3a;
                    &:before {
                        border: 0;
                    }
                }
            } //地图线条
            .line_box {
                position: absolute;
                left: 50%;
                top: 4rpx;
                transform: translateX(-50%);
                padding: 16rpx;
                z-index: 2;
                i {
                    width: 46rpx;
                    height: 3rpx;
                    border-radius: 1.5rpx;
                    background: #e4e4e4;
                    margin-bottom: 6rpx;
                }
            }
        }
        .order_details_con {
            margin-bottom: 20rpx;
            background: #fff;
            .shop_info_sum {
                background: #fff;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 28rpx 0;
                margin: 0 35rpx;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                img {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 20rpx;
                    border-radius: 10rpx;
                }
                p {
                    // flex: 1;
                    max-width: 80%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: #383838;
                    font-size: 32rpx;
                    font-weight: 700;
                }
                .small {
                    margin-left: 10rpx;
                    width: 25rpx;
                    height: 25rpx;
                }
            }
            .con_order_list {
                .con_list_item {
                    padding: 30rpx 35rpx;
                    display: flex;
                    justify-content: flex-start;
                    img {
                        width: 96rpx;
                        height: 96rpx;
                        margin-right: 20rpx;
                        border-radius: 10rpx;
                    }
                    flex: 1;
                    .item {
                        flex: 1;
                        padding-left: 18rpx;
                        display: flex;
                        flex-direction: column;
                        align-content: space-between;
                        height: 96rpx;
                        .name {
                            font-size: 28rpx;
                            color: #1d1d1d;
                            line-height: 30rpx;
                            width: 426rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .spec {
                            font-size: 22rpx;
                            color: #b2b2b2;
                            line-height: 46rpx;
                            height: 46rpx;
                            width: 426rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .num {
                            font-size: 22rpx;
                            color: #b2b2b2;
                            line-height: 22rpx;
                        }
                    }
                    .sum {
                        display: flex;
                        align-items: center;
                        font-size: 30rpx;
                        color: #1d1d1d;
                        line-height: 28rpx;
                        height: 28rpx;
                        span {
                            font-size: 22rpx;
                            margin-right: 6rpx;
                            transform: translateY(2rpx);
                        }
                    }
                }
            }
            .consume {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 27rpx 0;
                margin: 0 35rpx;
                .consume_l {
                    font-size: 28rpx;
                    white-space: nowrap;
                    color: #1a1a1a;
                    display: flex;
                    align-items: center;
                    i {
                        margin-right: 8rpx;
                    }
                }
                .consume_r {
                    display: flex;
                    align-items: center;
                    font-size: 30rpx;
                    white-space: nowrap;
                    color: #1d1d1d;
                    span {
                        font-size: 22rpx;
                        margin-right: 6rpx;
                        transform: translateY(2rpx);
                    }
                    &.color_text {
                        color: #ff4d3a;
                        span {
                            color: #ff4d3a;
                        }
                    }
                    i {
                        font-size: 24rpx;
                        color: #ff4d3a;
                        margin-right: 16rpx;
                    }
                }
            }
            .consume_sum {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24rpx 0;
                margin: 0 35rpx;
                .bor_t;
                .consume_l {
                    font-size: 28rpx;
                    white-space: nowrap;
                    color: #1a1a1a;
                }
                .consume_r {
                    display: flex;
                    align-items: center;
                    font-size: 36rpx;
                    white-space: nowrap;
                    color: #ff4d3a;
                    span {
                        font-size: 24rpx;
                        margin-right: 6rpx;
                        transform: translateY(2rpx);
                    }
                    i {
                        font-size: 24rpx;
                        color: #666;
                        margin-right: 16rpx;
                    }
                }
            }
            .shop_info_list {
                display: flex;
                padding: 20rpx 35rpx 35rpx;
                align-items: center;
                .shop_tel,
                .shop_wx {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f5f5;
                    height: 84rpx;
                    border-radius: 8rpx;
                    .icon_info {
                        width: 30rpx;
                        height: 30rpx;
                        margin-right: 10rpx;
                    }
                    p {
                        font-size: 28rpx;
                        color: #444;
                    }
                }
                .shop_wx {
                    margin-left: 20rpx;
                }
            }
        }
        .distribution_info,
        .order_list_info {
            margin-bottom: 20rpx;
            background: #fff;
            padding: 0 35rpx;
            .distribution,
            .order_info {
                padding: 28rpx 0;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                p {
                    font-size: 30rpx;
                    color: #010101;
                    font-weight: 700;
                }
            }
            .options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 27rpx 0;
                &.other {
                    align-items: flex-start;
                }
                &>p:nth-of-type(1) {
                    font-size: 28rpx;
                    width: 140rpx;
                    text-align: left;
                    white-space: nowrap;
                    margin-right: 30rpx;
                    color: #666;
                }
                &>p:nth-of-type(2) {
                    font-size: 28rpx;
                    flex: 1;
                    text-align: right;
                    color: #444;
                    display: -webkit-box !important;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                .options_r {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    p {
                        font-size: 28rpx;
                        flex: 1;
                        text-align: right;
                        color: #444;
                        margin-right: 0;
                        margin-right: 20rpx;
                    }
                    span {
                        font-size: 24rpx;
                        color: #444;
                        padding: 0 10rpx;
                        position: relative;
                        &:before {
                            content: '';
                            position: absolute;
                            top: -50%;
                            bottom: -50%;
                            left: -50%;
                            right: -50%;
                            -webkit-transform: scale(0.5);
                            transform: scale(0.5);
                            border: 1px solid #999; // border-radius: 6rpx;
                        }
                    }
                }
            }
        }
        .order_list_info {
            margin-bottom: 0;
        }
        .mask {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
        }
        .orderTracking {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
            background: #fff;
            z-index: 20;
            h2.title {
                font-size: 30rpx;
                color: #1a1a1a;
                text-align: center;
                line-height: 98rpx;
                font-weight: 900;
                position: relative;
                &::after {
                    content: '';
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
            }
            .main {
                padding: 0 48rpx 0 72rpx;
                max-height: 600rpx;
                overflow: scroll;
                ul {
                    border-left: 1rpx #ebebeb dashed;
                    li {
                        padding: 36rpx 0;
                        margin-left: 33rpx;
                        position: relative;
                        &::before {
                            content: '';
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
                        &:after {
                            content: '';
                            display: block;
                            width: 18rpx;
                            height: 18rpx;
                            border-radius: 50%;
                            background: #ccc;
                            position: absolute;
                            top: 43rpx;
                            left: -40rpx;
                        }
                        &:last-child {
                            border: none;
                            &:after {
                                background: #ff4d3a;
                            }
                            &::before {
                                display: none;
                            }
                            .text {
                                color: #ff4d3a;
                            }
                        }
                        .text {
                            font-size: 28rpx;
                            color: #1a1a1a;
                            line-height: 28rpx;
                            margin-bottom: 19rpx;
                        }
                        .time {
                            font-size: 22rpx;
                            color: #999;
                            line-height: 22rpx;
                        }
                    }
                }
            }
            .close {
                font-size: 30rpx;
                color: #1a1a1a;
                text-align: center;
                line-height: 98rpx;
                border-top: 1rpx solid #ebebeb;
            }
        }
        .after_sale {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
            background: #fff;
            z-index: 20;
            width: 100%;
            background: #fff;
            transform: translateY(100%);
            transition: transform 0.4s ease;
            z-index: 20;
            box-sizing: border-box;
            .after_sale_item {
                .after_sale_title {
                    position: relative;
                    padding: 30rpx 0;
                    &:after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-bottom: 1px solid #ebebeb;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                    p {
                        text-align: center;
                        color: #1d1d1d;
                        font-size: 30rpx;
                        font-weight: 700;
                    }
                }
                .after_sale_list {
                    padding: 0 36rpx 60rpx;
                }
                .after_sale_lis {
                    position: relative;
                    background: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_arrowRight.png') no-repeat right center;
                    background-size: 25rpx 25rpx;
                    height: 108rpx;
                    display: flex;
                    align-items: center;
                    p {
                        color: #1d1d1d;
                        font-size: 30rpx;
                    }
                    .icon {
                        margin-right: 16rpx;
                    }
                    &:after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-bottom: 1px solid #ebebeb;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                }
            }
            .after_sale_other {
                padding: 0 36rpx 60rpx;
                .after_sale_other_lis {
                    overflow: hidden;
                }
                .mb60 {
                    margin-bottom: 40rpx;
                }
                h3 {
                    font-size: 28rpx;
                    color: #1a1a1a;
                    font-weight: 700;
                    margin-bottom: 8rpx;
                }
                p {
                    font-size: 24rpx;
                    color: #999;
                }
            }
            .after_sale_close {
                height: 88rpx;
                line-height: 88rpx;
                text-align: center;
                color: #1a1a1a;
                font-size: 30rpx;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    left: 0;
                    top: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
            }
        }
        .after_sale_active {
            transform: translateY(0);
        }
        .cancel_mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10;
            transition: all 0.1s ease;
        }
        .cancel_mask {
            display: flex;
            .cancel_con {
                width: 500rpx;
                margin: auto;
                background: #fff;
                padding: 46rpx 36rpx 36rpx;
                border-radius: 8rpx;
                h3 {
                    font-size: 36rpx;
                    color: #1a1a1a;
                    font-weight: 700;
                    text-align: center;
                }
                p {
                    margin-top: 42rpx;
                    color: #444;
                    font-size: 28rpx;
                    line-height: 48rpx;
                }
                .deduct {
                    margin-top: 16rpx;
                    font-size: 28rpx;
                    color: #ff4d3a;
                    line-height: 46rpx;
                    display: block;
                }
                .btn_sum {
                    margin-top: 46rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .btn {
                    height: 72rpx;
                    border: 30rpx;
                    border-radius: 8rpx;
                    text-align: center;
                    line-height: 72rpx;
                    font-size: 26rpx;
                    width: 100%;
                    box-sizing: border-box;
                }
                .btn_left {
                    border-radius: 6rpx;
                    border: 1px solid #999;
                    color: #1a1a1a;
                    background-color: #fff;
                    margin-right: 24rpx;
                }
                .btn_right {
                    border-radius: 6rpx;
                    border: 1px solid #ff4d3a;
                    color: #fff;
                    background-color: #ff4d3a;
                }
            }
        }
        .map_mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            transform: translateY(100%);
            transition: all 0.4s ease;
            map {
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
            }
            .close_map {
                position: absolute;
                bottom: 60rpx;
                left: 50%;
                transform: translateX(-50%);
                .icon_close_map {
                    width: 96rpx;
                    height: 96rpx;
                }
            }
            .map_none {
                height: 0;
            }
        }
        .map_mask_active {
            transform: translateY(0%);
        }
        .order_btn {
            position: absolute;
            right: 36rpx;
            bottom: 188rpx;
            display: flex;
            flex-direction: column;
            i {
                margin-top: 40rpx;
            }
        }
    }
</style>
