<template>
    <div class="container">
        <div class="admin_add_goods">
            <div class="main bannerImg" v-for="(v,i) in list" :key="i">
                <div class="option optionTitle">
                    <div class="label">金额{{i+1}}</div>
                    <div class="item">
                        <i class="icon icon_clear" @click="dealInfo(v, i)"></i>
                    </div>
                </div>
                <div class="option" :class="{optionLine:v.RuleType == 1}">
                    <div class="label labelW">要求金额<span>(元)</span></div>
                    <div class="item">
                        <input class="textInp" type="digit" maxlength="8" v-model="v.RechargeMoney" placeholder-style='color: #ccc;font-size: 30rpx;font-weight: normal;line-height: 34rpx;' placeholder="请输入任意金额">
                        <span @click="selectGive(v, i)">赠送</span>
                        <i @click="selectGive(v, i)" class="icon icon_adminCheck" :class="{icon_adminChecked:v.RuleType == 1}"></i>
                    </div>
                </div>
                <div class="option" :class="{optionLine:v.RuleType == 1}" v-if="v.RuleType == 1">
                    <div class="label">赠送物品</div>
                    <div class="item">
                        <input type="text" v-model="v.Gift" maxlength="16" placeholder-class='placeholerStyle2' placeholder="请输入您要赠送的物品名称，16字以内">
                    </div>
                </div>
                <div class="option option2" v-if="v.RuleType == 1">
                    <div class="optionBox">
                        <div class="label">通知短信</div>
                        <div class="item">
                            <div v-if="v.NoticeMessage">{{v.NoticeMessage}}</div>
                            <div v-else>恭喜您充值（{{v.RechargeMoney}}元）获得（{{v.Gift}}）一个，请到店领取，数量有限，先到先得~</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="emitAdd" @click="add" v-if="isShow == 1">
                <i class="icon icon_emitAdd"></i>
                <div class="label">添加配置</div>
            </div>
            <div class="bottom_tit" v-if="flag == 1">最多添加5条规格</div>
        </div>
        <div class="handler">
            <div class="btn on btnl" @click="cancel">取消</div>
            <div class="btn on btnr" @click="checkForm">保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ShopId: '',
                list: [],
                oldList: [],
                dealList: [],
                isShow: -1,
                flag: -1
            }
        },
        onLoad() {
        },
        onReady() {
        },
        onShow() {
            wx.showLoading({
                title: '加载中',
            })
            this.isShow = -1;
            this.flag = -1;
            this.list = [];
            this.oldList = [];
            this.dealList = [];
            this.ShopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.getData();
        },
        methods: {
            //获取配置数据
            getData() {
                this.util.post({
                    url: '/api/Merchant/VipMember/GetVipRechargeRule',
                    data: {
                        ShopId: this.ShopId
                    }
                }).then(res => {
                    // console.log(res);
                    // this.list = res.Body.sort((a,b) => a.RechargeMoney - b.RechargeMoney);
                    this.list = res.Body
                    this.oldList = JSON.parse(JSON.stringify(res.Body));
                    if(this.list.length) {
                        if(this.list.length < 5) {
                            this.isShow = 1;
                        }else {
                            this.isShow = -1;
                        }
                    }else {
                        this.add();
                    }
                    this.flag = 1;
                    setTimeout(function(){
                        wx.hideLoading()
                    },500)
                }).catch(err => {
                    this.msg(err.Msg);
                })
            },
            //选择
            selectGive(v, i) {
                if (v.RuleType == 1) {
                    v.RuleType = 0;
                } else {
                    v.RuleType = 1;
                }
            },
            //添加
            add() {
                this.list.push({
                    Id: 0,
                    RechargeMoney: '',
                    RuleType: 0,
                    GiveMoney: 0,
                    Gift: '',
                    NoticeMessage: '',
                });
                if(this.list.length < 5) {
                    this.isShow = 1;
                }else {
                    this.isShow = -1;
                }
            },
            /* 删除规格 */
            dealInfo(v, i) {
                for (let j = 0; j < this.list.length; j++) {
                    if (this.list[j].Id == v.Id && v.Id != 0) {
                        v.Status = -1;
                        this.dealList.push(v);
                    }
                }
                this.list.splice(i, 1);
                if(this.list.length < 5) {
                    this.isShow = 1;
                }else {
                    this.isShow = -1;
                }
            },
            //检查表单
            checkForm() {
                for (var i = 0; i < this.list.length; i++) {
                    //判断表单是否为空
                    if (this.list[i].RechargeMoney == '') {
                        this.msg('请填写要求金额');
                        return
                    }
                    if (this.list[i].RuleType == 1) {
                        if (this.list[i].Gift == '') {
                            this.msg('请填写赠送物品');
                            return
                        }
                    }
                }
                this.save();
            },
            //保存
            save() {
                //循环遍历整理数据
                let arr = [];
                this.list.forEach(ele => {
                    if (ele.Id == 0) {
                        if(ele.checked) {
                            ele.NoticeMessage = ele.NoticeMessage ? ele.NoticeMessage : `恭喜您充值（${ele.RechargeMoney}元）获得（${ele.Gift}）一个，请到店领取，数量有限，先到先得~`
                        }else {
                            ele.NoticeMessage = '';
                        }
                        
                        arr.push(ele)
                    }
                })
                this.dealList.forEach(ele => {
                    arr.push(ele)
                });
                this.oldList.forEach(ele => {
                    this.list.forEach(item => {
                        // console.log(item)
                        if (ele.Id == item.Id) {
                            if (ele.RechargeMoney != item.RechargeMoney || ele.Gift != item.Gift || ele.RuleType != item.RuleType) {
                                // console.log('修改了')
                                item.Status = 1;
                                arr.push(item);
                            }
                        }
                    })
                });
                setTimeout(_ => {
                    this.util.post({
                        url: '/api/Merchant/VipMember/UpdateVipRechargeRule',
                        data: {
                            ShopId: this.ShopId,
                            VipRechargeRule: arr
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.msg('修改成功');
                        } else {
                            this.msg(res.Msg);
                        }
                        setTimeout(_ => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 300)
                    }).catch(err => {
                        this.Msg(err.Msg);
                    })
                }, 200)
            },
            //取消
            cancel() {
                wx.navigateBack({
                    delta: 1
                })
            }
        },
        computed: {},
        components: {},
    }
</script>

<style lang="less">
    .container {
        height: 100%;
        overflow: hidden;
    }
    .admin_add_goods {
        background: #eeeef4;
        // padding-bottom: 118rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .main {
            background: #fff; // margin-bottom: 20rpx;
            .option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 36rpx; // padding: 20rpx 0;
                min-height: 100rpx;
                box-sizing: border-box;
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    width: 114rpx;
                }
                .labelW {
                    font-weight: 700;
                    font-size: 30rpx;
                    line-height: 30rpx;
                    width: 180rpx;
                    span {
                        color: #999;
                        line-height: 30rpx; // font-size:30rpx;
                        font-weight: normal;
                    }
                }
                .item {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 34rpx;
                    input {
                        flex: 1;
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 28rpx;
                        margin-left: 34rpx;
                    }
                    .textInp {
                        font-size: 28rpx;
                        font-weight: 700;
                    }
                    .placeholerStyle2 {
                        font-size: 28rpx;
                        color: #ccc;
                        line-height: 34rpx;
                        font-weight: normal;
                    }
                    .placeholerStyle {
                        font-size: 30rpx;
                        font-weight: normal;
                        color: #ccc;
                        line-height: 34rpx;
                    }
                    textarea {
                        flex: 1;
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 34rpx;
                        width: 100%;
                        height: auto;
                        min-height: 34rpx;
                    }
                    span {
                        line-height: 28rpx;
                        font-size: 28rpx;
                        color: #3c5aee;
                        margin-right: 11rpx;
                    }
                    .kc_btn {
                        width: 164rpx;
                        height: 48rpx;
                        border: solid 1px #cccccc;
                        font-size: 24rpx;
                        color: #999999;
                        text-align: center;
                        line-height: 48rpx;
                        margin-right: 22rpx;
                        position: relative;
                    }
                    .kc_active {
                        border: solid 1px #3c59ee;
                        font-family: PingFangSC-Regular;
                        font-size: 24rpx;
                        color: #3c59ee;
                        text-align: center;
                        line-height: 48rpx;
                        i {
                            position: absolute;
                            width: 0;
                            height: 0;
                            bottom: -20rpx;
                            right: -20rpx;
                            border-width: 20rpx;
                            border-style: solid;
                            border-color: transparent transparent transparent #3c59ee;
                            transform: rotate(45deg);
                        }
                    }
                }
            }
            .optionLine {
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
            }
            .optionTitle {
                background: #eeeef4;
                height: 70rpx;
                margin-left: 0;
                .label {
                    margin-left: 36rpx;
                }
            }
            .option2 {
                min-height: 160rpx;
                max-height: 180rpx;
                height: auto;
                padding-bottom: 20rpx;
                &::after {
                    border-bottom: 0;
                }
                .optionBox {
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    .label {
                        font-size: 28rpx;
                        line-height: 28rpx;
                        color: #1a1a1a;
                        width: 114rpx;
                        height: 28rpx;
                        margin-top: 34rpx;
                    }
                    .item {
                        justify-content: flex-start;
                        padding-right: 130rpx;
                        height: auto;
                        margin-top: 28rpx;
                        textarea {
                            flex: 1;
                            font-size: 28rpx;
                            color: #1a1a1a;
                            line-height: 34rpx;
                            height: 128rpx;
                        }
                        div {
                            flex: 1;
                            height: 100%;
                            font-size: 28rpx;
                            line-height: 36rpx;
                            color: #ccc;
                            margin-left: 34rpx;
                        }
                    }
                }
            }
            &.bannerImg {
                .option {
                    .item {
                        justify-content: flex-end;
                    }
                }
            }
        }
        .bottom_tit {
            text-align: center;
            font-size: 22rpx;
            color: #cccccc;
            margin-top: 30rpx;
            // margin-bottom: 20rpx;
            padding-bottom: 138rpx;
        }
        .emitAdd {
            background: #fff;
            display: flex;
            padding: 0 36rpx;
            height: 100rpx;
            margin-top: 20rpx;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            // padding-bottom: 118rpx;
            .label {
                font-size: 32rpx;
                line-height: 32rpx;
                color: #1a1a1a;
                margin-left: 15rpx;
            }
        }
    }
    .handler {
        position: absolute;
        bottom: 0;
        left: 0;
        background: #fff;
        width: 100%;
        height: 110rpx;
        z-index: 10;
        border-top: 1rpx solid #ebebeb;
        display: flex;
        align-items: center;
        padding: 0 26rpx;
        box-sizing: border-box;
        .btn {
            background: #ccc;
            text-align: center;
            font-size: 28rpx;
            color: #fff;
            line-height: 72rpx;
            height: 72rpx;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
                margin-right: 8rpx;
            }
            &.on {
                background: #0863ee;
            }
        }
        .btn1 {
            margin-right: 20rpx;
            background-color: #fff;
            color: #0863ee;
            border: 1px solid #0863ee;
            &.on {
                background: #fff;
            }
        }
        .btn2 {
            background-color: #fff;
            color: #0863ee;
            border: 1px solid #0863ee;
            &.on {
                background: #fff;
            }
        }
        .btnl {
            margin-right: 12rpx;
            background-color: #fff;
            color: #0863ee;
            border: 1px solid #0863ee;
            &.on {
                background: #fff;
            }
        }
        .btnr {
            margin-left: 12rpx;
            border: 1px solid #0863ee;
        }
    }
    .placeholerStyle {
        font-size: 30rpx;
        font-weight: normal;
        color: #ccc;
        line-height: 34rpx;
    }
</style>
