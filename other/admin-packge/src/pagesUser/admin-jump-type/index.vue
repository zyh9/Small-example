<template>
    <div class="admin_store_manage">
        <div class="list">
            <div class="options" @click="selectType">
                <p>跳转页面类型</p>
                <div>
                    <input v-if="stateIndex == -1" type="text" placeholder="请选择" disabled placeholder-style="color:#ccc">
                    <p v-if="stateIndex != -1">{{stateList[stateIndex].name}}</p>
                    <i class="icon icon_arrowRight"></i>
                </div>
            </div>
        </div>

        <!-- 活动页 -->
        <div class="selectList" v-if="stateIndex == 0">
            <div class="selectItem" v-for="(v, i) in activityList" :key="i" @click="selectActivity(i,v)">
                <div class="selectAudio">
                    <i class="icon icon_adminCheck" :class="{icon_adminChecked:i==selectActivityIndex}"></i>
                </div>
                <div class="selectText">
                    <p>文字</p>
                </div>
            </div>
        </div>
        <!-- 会员页 -->
        <div class="selectList" v-if="stateIndex == 1">
            <div class="selectItem" v-for="(v, i) in vipList" :key="i" @click="selectVip(i,v)">
                <div class="selectAudio">
                    <i class="icon icon_adminCheck" :class="{icon_adminChecked:i==selectVipIndex}"></i>
                </div>
                <div class="selectText">
                    <p>文字</p>
                </div>
            </div>
        </div>
        <!-- 商品分类 -->
        <div class="selectList" v-if="stateIndex == 2">
            <div class="selectItem" v-for="(v, i) in classList" :key="i" @click="selectClass(i,v)">
                <div class="selectAudio">
                    <i class="icon icon_adminCheck" :class="{icon_adminChecked:i==selectClassIndex}"></i>
                </div>
                <div class="selectText">
                    <p>{{v.Name}}</p>
                </div>
            </div>
            <div class="defText" v-if="isClass&&classList.length == 0">无分类</div>
        </div>

        <!-- 商品管理 -->
        <div class="admin-commodity-manage_list_class" :class="{n:stateIndex != 3}">
            <scroll-view scroll-y="true" class="admin-commodity-manage_list_class_cont">
                <div class="admin-commodity-manage_list_class_item" :class="{item_active:(classIndex||0)==index}" v-for="(item,index) in classList" :key="index" @click="clickClass(item,index)">
                    {{item.Name}}
                </div>
            </scroll-view>
        </div>
        <scroll-view scroll-y="true" class="scroll_view fade_in" :style="{width:winWidth+'px'}" v-if="stateIndex == 3">
            <div v-for="(v,i) in shopListSum" :key="i" v-if="v.list.length">
                <div class="list_top" @click="rotate(v)">
                    <p>{{v.state}}<span>(共计{{v.list.length}}件商品)</span></p>
                    <div class="black" :class="{black_rotate:!v.onoff}"><i class="icon icon_right_black"></i></div>
                </div>
                <ul class="admin-commodity-manage_list" :style="{height:v.onoff?lisHeight*v.list.length+'px':0}">
                    <li v-for='(item,index) in v.list' :key='index' :data-item='item' :data-goodid='item.GoodId' @click='selectGoods(item,index,i)' class="sumLis">
                        <i class="icon icon_adminCheck" :class="{icon_adminChecked:item.checked}"></i>
                        <div class="goodsImg"><img :src="item.MasterPic+'?x-oss-process=image/resize,h_100'" alt="">
                            <div class="label" :class="'state'+item.State">{{item.State==1?'在售':item.State==2?'下架':'停售'}}</div>
                        </div>
                        <div class="item">
                            <div class="name">{{item.GoodName}}</div>
                            <div class="info">
                                <div class="price" v-if='item.MultiSpec<=1'><span>&yen;</span>{{item.OriginalPrice}}</div>
                                <div class="price" v-if='item.MultiSpec>1'><span>&yen;</span>{{item.OriginalPrice}}起</div>
                                <div class="num">({{item.MultiSpec}}个规格)</div>
                            </div>
                            <div class="specs" v-if="item.MultiSpec == 1"><span>{{item.MinSpecGoodsStock > 99999 ? '库存无限' : '库存'+item.MinSpecGoodsStock}}</span><i class="icon icon_arrowSpec"></i></div>
                            <div class="specs" v-else><span>{{item.MinSpecGoodsStock > 99999 ? '库存无限' : '库存'+item.MinSpecGoodsStock+'起'}}</span><i class="icon icon_arrowSpec"></i></div>
                        </div>
                    </li>
                </ul>
                <div v-if="v.onoff" class="item_bottom_b"></div>
            </div>
            <p class="nodata" v-if="classFlag">暂无商品信息</p>
        </scroll-view>

        <!-- 模态框 -->
        <div v-if="stateModal">
            <div class="modalBg" @click="stateModal = false"></div>
            <div class="modalCont">
                <div class="modalCont_Tit">修改状态</div>
                <div class="modalCont_cont">
                    <div class="row" :class="{row1:index == 0}" v-for="(item,index) in stateList" :key="index" @click="stateSelect(index)">
                        <div class="rowItem">
                            <div class="audioBox">
                                <i v-if="index == 1" class="icon icon_disClick"></i>
                                <i v-else class="icon icon_adminCheck" :class="{icon_adminChecked:stateIndex == index}"></i>
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
            isClass: -1,
            jumpType: '',
            jumpState: '',
            stateModal: false,
            typeText: '',
            stateIndex: -1,
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
            selectActivityIndex: -1,
            selectVipIndex: -1,
            selectClassIndex: -1,
            //活动页
            activityList: [],
            //会员页
            vipList: [],

            //商品管理
            winWidth: 0,
            winHeight: 0,
            goodType: null,
            GoodState: 0,
            goodsList: [],
            classListIndex: null,
            classList: [],
            classIndex: 0,
            shopListSum: [{
                onoff: true,
                list: [],
                state: '上架'
            }, {
                onoff: true,
                list: [],
                state: '下架'
            }, {
                onoff: true,
                list: [],
                state: '停售'
            }],
            goodsIdArr: [],  //存放选择商品
            page: 1,
            pageSize: 9999,
            classFlag: false,
        }
    },
    onUnload() {
        // console.log('跳转类型onUnload');
        this.stateModal = false;
        //卸载页面   缓存对应数据
        //拿到数组缓存   修改对应数据
        let bannerList = wx.getStorageSync('bannerList');
        let navList = wx.getStorageSync('navList');
        let adList = wx.getStorageSync('adList');
        if(this.$mp.query.bannerIndex) {
            //console.log('从banner')
            switch(this.stateIndex) {
                //活动
                case 0:
                    // bannerList[this.$mp.query.bannerIndex].ActivityLink = '/pagesUser/admin-set-commodity';
                break;
                //会员
                case 1:
                    // bannerList[this.$mp.query.bannerIndex].ActivityLink = '/pagesUser/admin-set-commodity';
                break;
                //分类
                case 2:
                //console.log(this.classList[this.selectClassIndex].ID)
                    bannerList[this.$mp.query.bannerIndex].GoodsTypeId = this.classList[this.selectClassIndex].ID;
                break;
                //商品详情
                case 3:
                    bannerList[this.$mp.query.bannerIndex].GoodsId = this.goodsIdArr[0];
                break;
            }
            bannerList[this.$mp.query.bannerIndex].LinkType = this.stateList[this.stateIndex].type;
            wx.setStorageSync('bannerList',bannerList);
        }else if(this.$mp.query.navIndex) {
            //console.log('从nav')
            switch(this.stateIndex) {
                //活动
                case 0:
                    // navList[this.$mp.query.navIndex].ActivityLink = '/pagesUser/admin-set-commodity';
                break;
                //会员
                case 1:
                    // bannerList[this.$mp.query.bannerIndex].ActivityLink = '/pagesUser/admin-set-commodity';
                break;
                //分类
                case 2:
                    navList[this.$mp.query.navIndex].GoodsTypeId = this.classList[this.selectClassIndex].ID;
                break;
                //商品详情
                case 3:
                    navList[this.$mp.query.navIndex].GoodsId = this.goodsIdArr[0];
                break;
            }
            navList[this.$mp.query.navIndex].LinkType = this.stateList[this.stateIndex].type;
            wx.setStorageSync('navList',navList);
        }else if(this.$mp.query.adIndex) {
            //console.log('从ad')
            switch(this.stateIndex) {
                //活动
                case 0:
                    // adList[this.$mp.query.navIndex].ActivityLink = '/pagesUser/admin-set-commodity';
                break;
                //会员
                case 1:
                    // bannerList[this.$mp.query.bannerIndex].ActivityLink = '/pagesUser/admin-set-commodity';
                break;
                //分类
                case 2:
                    adList[this.$mp.query.adIndex].GoodsTypeId = this.classList[this.selectClassIndex].ID;
                break;
                //商品详情
                case 3:
                    adList[this.$mp.query.adIndex].GoodsId = this.goodsIdArr[0];
                break;
            }
            adList[this.$mp.query.adIndex].LinkType = this.stateList[this.stateIndex].type;
            wx.setStorageSync('adList',adList);
        }else {
            //console.log('从商品列表')
        };
    },
    onShow() {
        //初始化
        this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
        this.stateIndex = -1;
        this.selectActivityIndex = -1;
        this.selectVipIndex = -1;
        this.selectClassIndex = -1;
        this.goodsList = [];
        //console.log(this.shopListSum)
        //回填勾选的类型
        if(this.$mp.query.bannerIndex) {
            let lt = wx.getStorageSync('bannerList')[this.$mp.query.bannerIndex].LinkType;
            this.stateIndex = lt == ''? -1 : lt-1;
            // if(this.stateIndex!=-1) {
            //     setTimeout(_ => {
            //         this.classList.forEach((item,index) => {
            //             console.log(item.ID==wx.getStorageSync('bannerList')[this.$mp.query.bannerIndex].GoodsTypeId)
            //             if(item.ID = wx.getStorageSync('bannerList')[this.$mp.query.bannerIndex].GoodsTypeId) {
            //                 this.selectClassIndex = index;
            //                 item.checked = true;
            //             }else {
            //                 item.checked = false;
            //             }
                        
            //         });
            //     },200)
            // }
        }else if(this.$mp.query.navIndex) {
            let lt = wx.getStorageSync('navList')[this.$mp.query.navIndex].LinkType;
            this.stateIndex = lt == ''? -1 : lt-1;
            // if(this.stateIndex!=-1) {
            //     setTimeout(_ => {
            //         this.classList.forEach(item => {
            //             console.log(item.ID)
            //             item.checked = false;
            //         });
            //     },200)
            // }
        }else if(this.$mp.query.adIndex) {
            console.log('广告数据')
            let lt = wx.getStorageSync('adList')[this.$mp.query.adIndex].LinkType;
            this.stateIndex = lt == ''? -1 : lt-1;
            // if(this.stateIndex!=-1) {
            //     setTimeout(_ => {
            //         this.classList.forEach(item => {
            //             console.log(item.ID)
            //             item.checked = false;
            //         });
            //     },200)
            // }
        }else {
            this.stateIndex = 2;
        }


        

        //回填勾选的商品
        if(this.$mp.query.bannerIndex) {
            this.goodsIdArr[0] = wx.getStorageSync('bannerList')[this.$mp.query.bannerIndex].GoodsId;
        }else if(this.$mp.query.navIndex) {
            this.goodsIdArr[0] = wx.getStorageSync('navList')[this.$mp.query.navIndex].GoodsId;
        }else if(this.$mp.query.adIndex) {
            //console.log('广告商品数据')
            this.goodsIdArr[0] = wx.getStorageSync('adList')[this.$mp.query.adIndex].GoodsId;
        }else {

        }
        

        //从商品列表跳转过来
        this.jumpState = this.$mp.query.type;

        
        //判断从商品列表跳转类型缓存  渲染
        this.jumpType = wx.getStorageSync('jumpType') ? wx.getStorageSync('jumpType') : '';
        if(this.jumpType) {
            this.typeText = this.jumpType.name;
            this.stateList.forEach((element,index) => {
                if(this.jumpType.type == element.type) {
                    this.stateIndex = index;
                }
            });
        };
        
        //获取分类
        this.getClass();

        //默认勾选商品
        // setTimeout(_=> {
        //     //默认回填勾选商品
        //     this.checkedGood(this.goodsIdArr[0]);
        // },1000)
        //设置商品列表宽度
        let query = wx.createSelectorQuery();
            query.select('.admin-commodity-manage_list_class').boundingClientRect();
            query.exec(res => {
                //console.log(res)
                let width = res[0].width;
                wx.getSystemInfo({
                    success: res => {
                        this.winWidth = res.windowWidth - width;
                    }
                })
            })
    },
    methods: {
        //回填勾选商品
        checkedGood(id) {
            this.shopListSum.forEach((ele,index) => {
                if(ele.list) {
                    ele.list.forEach((item,i) => {
                        //console.log(item.GoodId)
                        if(item.GoodId == id) {
                            item.checked = true;
                            this.goodsIdArr[0] = item.GoodId;
                        }else {
                            item.checked = false;
                        }
                    })
                }
            })
            this.shopListSum.forEach(ele => {
                if(ele.list) {
                    ele.list.forEach((item,i) => {
                        //console.log(item.GoodId == id)
                        if(item.GoodId == id) {
                            item.checked = true;
                            this.goodsIdArr[0] = item.GoodId;
                        }else {
                            item.checked = false;
                        }
                    })
                }
            })
        },
        //选择活动
        selectActivity(index) {
            this.selectActivityIndex = index;
            wx.navigateBack({
                delta: 1
            })
        },
        //选择会员页
        selectVip(index) {
            this.selectVipIndex = index;
            wx.navigateBack({
                delta: 1
            })
        },
        //会员分类页
        selectClass(index,v) {
            //console.log('选择分类')
            this.selectClassIndex = index;
            if(this.jumpState == 3) {
                wx.setStorageSync('classType',v)
                wx.navigateBack({
                    delta: 1
                })
                return
            }
            wx.navigateBack({
                delta: 1
            })
        },
        //选择类型
        stateSelect(index) {
            //会员类型暂不可用
            if(index == 1) {
                return
            }
            if(index == 2) {
                //判断是否有分类
                if(this.classList.length == 0) {
                    this.msg('暂无分类，请添加分类信息')
                    return
                }
                
            }
            if(index == 3) {
                if(this.goodsList.length == 0) {
                    this.msg('暂无商品，请添加商品')
                    return
                }
            }
            
            this.stateIndex = index;
            // this.typeText = this.stateList[this.stateIndex].name;
            // wx.setStorageSync('jumpType', this.stateList[this.stateIndex]);
            this.stateModal = false;
            if(this.stateIndex == 0) {
                wx.navigateBack({
                    delta: 1
                })
            }
            if(this.stateIndex == 1) {
                wx.navigateBack({
                    delta: 1
                })
            }
            // this.getTypeData(this.stateList[this.stateIndex].type);
        },
        selectType() {
            //判断是否从商品列表跳转过来 只能选择分类
            if(this.jumpState == 3) {
                return
            }
            
            this.stateModal = true;
        },
        //获取选择的类型数据
        getType(type) {
            //console.log(type);
            switch(type) {
                case '1':
                break;
                case '2':
                break;
                case '3':
                break;
            }
        },


        /* 商品管理 */
        //获取商品数据
        getGoodsList() {
            let jsonObj = {
                ShopId: this.shopId,
                // GoodState 0:全部
                GoodState: this.goodType==-1 ? 1 :this.GoodState,
                PageSize: this.pageSize,
                PageIndex: this.page,
                GoodType: this.goodType,
            };
            for (var key in jsonObj) {
                if (jsonObj[key] == null) {
                    delete jsonObj[key]
                }
            }
            // //console.log(jsonObj)
            this.util.post({
                url: '/api/Merchant/Goods/GoodList',
                data: jsonObj
            }).then(res => {
                
                this.goodsList = this.goodsList.concat(res.Body);
                
                this.shopListSum[0].list = this.goodsList.filter(e => e.State == 1); //上架
                this.shopListSum[1].list = this.goodsList.filter(e => e.State == 2); //下架
                this.shopListSum[2].list = this.goodsList.filter(e => e.State == 3); //停售
                
                //console.log(this.shopListSum)
                for (let i = 0; i < this.goodsList.length; i++) {
                    this.goodsList[i] = Object.assign({}, this.goodsList[i], {
                        checked: this.goodsIdArr.findIndex(ele => ele == this.goodsList[i].GoodId) > -1 ? true : false
                    })
                }
                //console.log('商品列表')
                
                this.shopListSum.forEach(ele => {
                    if(ele.list) {
                        ele.list.forEach((item,index) => {
                            //商品回填 勾选
                            if(this.goodsIdArr[0]) {
                                if(item.GoodId == this.goodsIdArr[0]) {
                                    item.checked = true;
                                    this.goodsIdArr[0] = item.GoodId;
                                }else {
                                    item.checked = false;
                                }
                            }else {
                               if(index == 0) {
                                   item.checked = true;
                                   this.goodsIdArr[0] = item.GoodId;
                               }else {
                                   item.checked = false;
                               }
                            }
                            
                            // item.checked = false;
                        })
                    }
                })
                if (res.Body.length < this.pageSize) {
                    if (this.page > 1) {
                        this.msg('没有更多信息~')
                    }
                }
                if (this.goodsList.length == 0) {
                    this.classFlag = true;
                } else {
                    this.classFlag = false;
                }
                
                if (this.lisHeight == 0) {
                    setTimeout(_ => {
                        if (this.goodsList.length) {
                            let query = wx.createSelectorQuery();
                            query.select('.sumLis').boundingClientRect();
                            query.exec(res => {
                                this.lisHeight = res[0].height;
                            })
                        }
                    }, 600)
                }
                
            }).catch(err => {
                wx.hideLoading();
                this.msg(err.Msg)
            })
        },
        //获取分类信息
        getClass() {
            this.util.post({
                url: '/api/Merchant/ShopManage/GetGoodsTypes',
                data: {
                    ShopID: this.shopId
                }
            }).then(res => {
                if (res.Body.length == 0) {
                   
                } else {
                    this.classList = res.Body;
                    this.classList.forEach(item => {
                        item.checked = false;
                    });
                    this.goodType = this.classList[this.classIndex].ID;
                    this.getGoodsList();
                }
            }).catch(err => {
                wx.hideLoading();
                this.msg(err.Msg)
            })
        },
        //点击分类
        clickClass(item, index) {
            if (this.classIndex == index) return;
            this.goodsList = [];
            this.shopListSum = [{
                onoff: true,
                list: [],
                state: '上架'
            }, {
                onoff: true,
                list: [],
                state: '下架'
            }, {
                onoff: true,
                list: [],
                state: '停售'
            }];
            this.goodType = item.ID;
            this.GoodState = this.goodType==-1?1:0;
            this.PageIndex = 1;
            this.classIndex = index;
            this.getGoodsList();
        },
        //选择商品
        selectGoods(item, index, i) {
            item.checked = !item.checked;
            this.goodsIdArr[0] = item.GoodId;
            wx.navigateBack({
                delta: 1
            })
        },
    }
}
</script>

<style lang="less">
.defText {
    font-size: 28rpx;
    color: #ccc;
    text-align: center;
}
//商品管理
.admin-commodity-manage {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    overflow: hidden;
}
.scroll_view {
    position: absolute;
    top: 130rpx;
    left: 150rpx;
    right: 0;
    bottom: 0;
    background: #ffffff;
    // padding-bottom: 120rpx;
    box-sizing: border-box;
}
.list_top {
    height: 82rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 24rpx;
    box-sizing: border-box;
    p {
        font-size: 28rpx;
        color: #1a1a1a;
        span {
            font-size: 24rpx;
            color: #999;
        }
    }
    .black {
        padding: 10rpx 20rpx;
        line-height: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.3s;
        transform: rotate(90deg);
    }
    .black_rotate {
        transform: rotate(0deg);
    }
}
.admin-commodity-manage_list {
    transition: 0.3s;
    overflow: hidden;
    background: #fff;
    position: relative;
    &::after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        position: absolute;
        top: 0;
        left: 0;
        border-top: 1px solid #ebebeb;
        transform: scaleY(0.5);
        transform-origin: 0 0;
    }
    li {
        display: flex;
        align-items: center;
        padding: 33rpx 20rpx 33rpx 0;
        margin-left: 24rpx;
        position: relative;
        box-sizing: border-box;
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
        &:last-child {
            &::after {
                display: none;
            }
        }
        .icon {
            margin-right: 26rpx;
        }
        .goodsImg {
            width: 160rpx;
            height: 160rpx;
            margin-right: 24rpx;
            position: relative;
            .label {
                position: absolute;
                left: 0;
                bottom: 0;
                text-align: center;
                font-size: 22rpx;
                color: #fff;
                width: 120rpx;
                height: 40rpx;
                line-height: 40rpx;
                border-radius: 0px 40px 0px 0px;
                &.state1 {
                    background-image: linear-gradient(90deg, #38c439 0%, #4be009 100%);
                }
                &.state2 {
                    background-image: linear-gradient(90deg, #f47f19 0%, #f39716 100%), linear-gradient( #38c822, #38c822);
                }
                &.state3 {
                    color: #1a1a1a;
                    background-image: linear-gradient(90deg, #bebebe 0%, #b6b8bd 100%), linear-gradient( #38c822, #38c822);
                }
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .item {
            flex: 1;
            height: 160rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .name {
                width: 300rpx;
                font-size: 30rpx;
                color: #1d1d1d;
                line-height: 30rpx;
                font-weight: 900;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
            .specs {
                width: 268rpx;
                height: 56rpx;
                background-color: #f7f9ff;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                span {
                    font-size: 21rpx;
                    color: #0E72EB;
                    display: inline-block;
                }
                i {
                    margin-left: 6rpx;
                }
            }
            .info {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .num {
                    font-size: 22rpx;
                    color: #444444;
                    line-height: 22rpx;
                    margin-left: 8rpx;
                }
                .price {
                    font-size: 28rpx;
                    color: #1a1a1a;
                    line-height: 28rpx;
                    span {
                        font-size: 24rpx;
                    }
                }
                .goDetail {
                    font-size: 22rpx;
                    color: #0863ee;
                    .icon {
                        margin-right: 0;
                        margin-bottom: -2rpx;
                    }
                }
            }
            .time {
                font-size: 20rpx;
                color: #999999;
                line-height: 20rpx;
            }
        }
    }
    .commodity_item {
        background: #fff;
        border-bottom: 1px solid #e6e6e6;
        padding: 20rpx;
        .commodity_item_top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .top_img_info {
                position: relative;
                margin-right: 30rpx;
                img {
                    width: 100rpx;
                    height: 100rpx;
                }
                p {
                    position: absolute;
                    width: 100%;
                    bottom: 0;
                    left: 0;
                    background: #ccc;
                    color: #666;
                    font-size: 24rpx;
                    text-align: center;
                }
            }
            .top_shop_info {
                flex: 1;
                p {
                    color: #333;
                    font-size: 28rpx;
                }
                span,
                i {
                    color: #666;
                    font-size: 24rpx;
                }
            }
        }
        .commodity_item_bot {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .time {
                color: #666;
                font-size: 24rpx;
            }
        }
    }
}
.nodata {
    text-align: center;
    font-size: 22rpx;
    color: #ccc;
    padding-top: 120rpx;
    p {
        line-height: 1;
        margin-top: 30rpx;
    }
}
.admin-commodity-manage_list_class {
    position: absolute;
    top: 130rpx;
    left: 0;
    bottom: 0;
    width: 150rpx;
    z-index: 9999;
    background-color: #f3f3f3;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    .admin-commodity-manage_list_class_cont {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow-x: hidden;
        // padding-bottom: 120rpx;
        overflow: hidden;
        .admin-commodity-manage_list_class_item {
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 24rpx;
            font-weight: normal;
            font-stretch: normal;
            line-height: 68rpx;
            letter-spacing: 0px;
            color: #1d1d1d;
            width: 100%;
            height: 100rpx;
            box-sizing: border-box;
            position: relative;
            z-index: 999;
            padding: 16rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .item_active {
            background: #ffffff;
        }
    }
    .admin-commodity-manage_list_class_bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 110rpx;
        text-align: center; // line-height: 110rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
            font-family: PingFangSC-Regular;
            font-size: 22rpx;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #999999;
            line-height: 1;
            margin-top: 10rpx;
        }
    }
}
.admin_store_manage {
    height: 100%;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .selectList {
        padding: 0 36rpx;
        background: #fff;
        .selectItem {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            line-height: 1;
            padding: 39rpx 0;
            .selectAudio {
                margin-right: 34rpx;
            }
            .selectText {
                flex: 1;
                font-size: 26rpx;
                color: #555555;
                line-height: 1;
            }
        }
    }
    .list {
        padding-left: 36rpx;
        background: #fff;
    }
    .options {
        background: #fff;
        height: 110rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        &:last-child {
            &::after {
                display: none;
            }
        }
        p {
            color: #1a1a1a;
            font-size: 30rpx;
        }
        img {
            width: 40rpx;
            height: 40rpx;
        }
        div {
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            padding-right: 36rpx;
            input {
                font-size: 28rpx;
                color: #1a1a1a;
                text-align: right;
                margin-right: 21rpx;
            }
        }
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
                &:last-child {
                    &::after {
                        display: none;
                    }
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
                
                .disAudio {
                    background: #f5f5fa;
                }
            }
        }
    }
}
.n {
    display: none;
}
</style>


