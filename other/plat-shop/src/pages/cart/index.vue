<template>
  <div class="cart">
    <div class="cart_con">
      <div class="no_cart_product" v-if="tips">
        <div class="no_cart_product_con">
          <i class="icon icon_no_cart"></i>
          <p>购物车还是空的哦~</p>
        </div>
      </div>
      <ul class="cart_list" v-if="cartListItem.length">
        <li v-for="(v,i) in cartListItem" :key="i">
          <div class="checked_item" @click="isCheck(v)">
            <i class="icon icon_check" :class="{icon_checked:v.check}"></i>
          </div>
          <img class="cart_lis_img" :src="v.GoodsMasterPic?v.GoodsMasterPic+'?x-oss-process=image/resize,w_200/format,jpg':''" alt="">
          <div class="lis_right">
            <p class="lis_shop_name">{{v.GoodName}}</p>
            <p class="lis_shop_norm">{{v.SpecName&&v.MultiSpec==1?v.SpecName:''}}</p>
            <div class="lis_info">
              <i class="icon icon_discount_text" v-if="v.GoodType==-1"></i>
              <p><span>¥</span>{{v.SalesPrice?v.SalesPrice:v.OriginalPrice}}</p>
              <del v-if="v.GoodType==-1">¥{{v.OriginalPrice}}</del>
            </div>
            <div class="count">
              <i class="icon icon_lower_bus" v-if="v.num>0" :data-info="v" @click="lower($event)"></i>
              <span v-if="v.num>0">{{v.num}}</span>
              <i class="icon icon_add_bus" :data-info="v" @click="add($event)"></i>
            </div>
          </div>
        </li>
      </ul>
      <div class="cart_top" v-if="cartListItem.length">
        <p class="checked_sum_item" @click="sumCheck">
          <i class="icon icon_check" :class="{icon_checked:sumCheskState}"></i>
          <span>全选</span>
        </p>
        <p class="edit_cart" @click="deleteState = !deleteState">{{deleteState?'完成':'编辑'}}</p>
      </div>
      <div class="cart_bot" v-if="cartListItem.length">
        <p class="sum_money" v-if="openState==1&&deleteState==false"><span>合计 :</span><i>¥</i>{{count}}</p>
        <p class="sum_money" v-if="deleteState==true"></p>
        <button class="sum" plain="true" v-if="openState==1&&deleteState==false" @click="account" :class="{no_active:!sumNum}">结算</button>
        <div class="del_cart" v-if="deleteState==true" @click="delList">
          <i class="icon icon_del_shop"></i>
          <p>删除</p>
        </div>
        <div class="open_state" v-if="openState==0&&deleteState==false">已打烊</div>
      </div>
    </div>
    <div class="tab_bar">
      <div class="tab_bar_item" @click="openBusiness">
        <img src="../../../static/tabBar/index.png" alt="">
        <p>首页</p>
      </div>
      <div class="tab_bar_item">
        <img src="../../../static/tabBar/cart-active.png" alt="">
        <p class="active">购物车</p>
      </div>
      <div class="tab_bar_item" @click="openUser">
        <img src="../../../static/tabBar/user.png" alt="">
        <p>我的</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cartListItem: [],
        sumCheskState: true,
        deleteState: false,
        count: 0,
        tips: false,
        sumNum: false,
        openState: null,
      }
    },
    onShow() {
      this.count = 0;
      this.cartListItem = [];
      this.deleteState = false;
      this.sumCheskState = true;
      this.tips = false;
      this.sumNum = false;
      // 先获取缓存数据
      let cartListSum = wx.getStorageSync('cartListSum') || [];
      //再找到对应店铺
      let cartItem = cartListSum.filter(e => e.ShopId == (wx.getStorageSync('shopInfo').ShopId || wx.setStorageSync('ShopId')));
      this.cartListItem = cartItem.length ? cartItem[0].cartList : [];
      // console.log(cartItem)
      this.cartListItem = this.cartListItem.filter(e => e.num != 0);
      // 再设置缓存数据
      wx.setStorageSync('cartListSum', cartListSum);
      //缓存length不存在，直接清除
      !cartListSum.length && wx.removeStorageSync('cartListSum');
      // this.cartListItem.forEach(e => {
      //   e.check = true;
      // });
      !this.cartListItem.length && (this.tips = true);
      this.openState = wx.getStorageSync('shopInfo').OpenState;
    },
    methods: {
      openBusiness() {
        let index = getCurrentPages().findIndex(e => e.route == 'pages/business/main');
        if (index > -1) {
          wx.navigateBack({
            delta: getCurrentPages().length - 1 - index
          })
        } else {
          wx.navigateTo({
            url: '/pages/business/main'
          })
        }
      },
      openUser() {
        let index = getCurrentPages().findIndex(e => e.route == 'pages/shop-user/main');
        if (index > -1) {
          wx.navigateBack({
            delta: getCurrentPages().length - 1 - index
          })
        } else {
          wx.navigateTo({
            url: '/pages/shop-user/main'
          })
        }
      },
      isCheck(v) {
        // console.log(v.check)
        this.cartListItem.forEach(e => {
          if (e.Id == v.Id) {
            e.check = !v.check;
            this.saveData(e, wx.getStorageSync('shopInfo').ShopId)
          }
        })
      },
      sumCheck() {
        if (this.sumCheskState) {
          this.cartListItem.forEach(e => e.check = false);
        } else {
          this.cartListItem.forEach(e => e.check = true);
        }
        // 先获取缓存数据
        let cartListSum = wx.getStorageSync('cartListSum') || [];
        //走设置
        cartListSum.forEach(e => {
          if (e.ShopId == wx.getStorageSync('shopInfo').ShopId) {
            e.cartList = this.cartListItem;
          }
        })
        //针对商品列表为空的店铺做清空处理
        cartListSum = cartListSum.filter(e => e.cartList.length > 0);
        // 再设置缓存数据
        wx.setStorageSync('cartListSum', cartListSum);
        //缓存length不存在，直接清除
        !cartListSum.length && wx.removeStorageSync('cartListSum');
        this.sumCheskState = !this.sumCheskState;
      },
      delList() {
        let delLength = this.cartListItem.filter(e => e.check == true);
        if (!delLength.length) {
          this.msg('你还没有选中商品哦')
        } else {
          wx.showModal({
            title: '删除确认',
            content: '确认从购物车中删除选中的商品',
            confirmText: '删除',
            cancelText: '再想一下',
            confirmColor: '#ff4d3a',
            success: res => {
              if (res.confirm) {
                this.cartListItem = this.cartListItem.filter(e => e.check == false);
                // 先获取缓存数据
                let cartListSum = wx.getStorageSync('cartListSum') || [];
                //走设置
                cartListSum.forEach(e => {
                  if (e.ShopId == wx.getStorageSync('shopInfo').ShopId) {
                    e.cartList = this.cartListItem;
                  }
                })
                //针对商品列表为空的店铺做清空处理
                cartListSum = cartListSum.filter(e => e.cartList.length > 0);
                // 再设置缓存数据
                wx.setStorageSync('cartListSum', cartListSum);
                //缓存length不存在，直接清除
                !cartListSum.length && wx.removeStorageSync('cartListSum');
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })
        }
      },
      account() {
        // console.log(this.cartListItem)
        let checkLength = this.cartListItem.filter(e => e.check == true)
        if (checkLength.length) {
          //判断手机号绑定状态
          if (wx.getStorageSync('loginInfo').IsBindPhone == 1) {
            let ShopId = String(wx.getStorageSync('shopInfo').ShopId) || '';
            wx.navigateTo({
              url: `/pages/submit-order/main?ShopId=${ShopId}`
            })
          } else {
            wx.navigateTo({
              url: '/pages/login/main'
            })
          }
        } else {
          this.msg('您还没有选择商品哦')
        }
      },
      countNum(list) {
        let n = 0;
        list.forEach(e => {
          if (e.GoodType == -1) { //折扣
            if (e.PriceOffRule.DiscountRule == 2) { //每份仅限一单
              if (e.num > 0) {
                if (e.num > 1) { //原价
                  n += Math.round(e.OriginalPrice * 10000) * (e.num - 1) + Math.round(e.SalesPrice * 10000);
                  e.sumPrice += (Math.round(e.OriginalPrice * 10000) * (e.num - 1) + Math.round(e.SalesPrice * 10000)) / 10000;
                } else { //折扣价
                  n += Math.round(e.SalesPrice * 10000);
                  e.sumPrice += Math.round(e.SalesPrice * 10000) / 10000;
                }
                // console.log(n)
              }
            } else {
              if (e.num > 0) {
                n += Math.round(e.SalesPrice * 10000) * e.num;
                e.sumPrice = Math.round(e.SalesPrice * 10000) * e.num / 10000;
              }
            }
          } else { //非折扣
            if (e.num > 0) {
              //销售价存在
              if (e.SalesPrice) {
                //javascript(js)的小数点乘法除法问题
                n += Math.round(e.SalesPrice * 10000) * e.num;
                e.sumPrice = Math.round(e.SalesPrice * 10000) * e.num / 10000;
              } else { //不存在
                //javascript(js)的小数点乘法除法问题
                n += Math.round(e.OriginalPrice * 10000) * e.num;
                e.sumPrice = Math.round(e.OriginalPrice * 10000) * e.num / 10000;
              }
            }
          }
        })
        // console.log(n)
        this.count = this.cartListItem.length ? n / 10000 : 0;
      },
      lower(e) {
        let {
          info
        } = e.target.dataset;
        if (info.num == 1) {
          this.msg('该商品不能减少了哦~')
          return;
        }
        if (info.MultiSpec == 0) {
          if (info.GoodType == -1) { //折扣商品
            if (info.PriceOffRule.DiscountRule == 1) { //购买规格  每人限一份
              console.log('每人限一份')
            } else { //每单限一份
              console.log('每单限一份')
            }
          }
          this.cartListItem.forEach(ele => {
            if (ele.GoodId == info.GoodId) {
              ele.num = info.num;
              ele.num--;
              this.saveData(ele, wx.getStorageSync('shopInfo').ShopId)
            }
          })
        } else {
          this.cartListItem.forEach(ele => {
            if (ele.MultiSpec == 1) {
              if (ele.Id == info.Id) {
                ele.num = info.num;
                ele.num--;
                this.saveData(ele, wx.getStorageSync('shopInfo').ShopId)
              }
            }
          })
        }
      },
      add(e) {
        let {
          info
        } = e.target.dataset;
        // console.log(info)
        if (info.MultiSpec == 0) {
          if (info.GoodType == -1) { //折扣商品
            if (info.PriceOffRule.DiscountRule == 1) { //购买规格  每人限一份
              if (info.IsBuyed == 0) { //未购买
                if (info.num == 1) {
                  this.msg('每人限1份的商品仅能购买一次')
                  return;
                }
                this.addFun(info)
              } else { //已购买
                this.msg('每人限1份的商品仅能购买一次')
              }
            } else { //每单限一份
              if (info.num == 1) {
                this.msg('每单仅享1份优惠价')
              }
              this.addFun(info)
            }
          } else {
            console.log('非折扣')
            this.addFun(info)
          }
        } else {
          this.cartListItem.forEach(ele => {
            if (ele.MultiSpec == 1) {
              if (ele.Id == info.Id) {
                ele.num = info.num;
                ele.num++;
                this.saveData(ele, wx.getStorageSync('shopInfo').ShopId)
              }
            }
          })
        }
      },
      addFun(info) {
        this.cartListItem.forEach(ele => {
          if (ele.GoodId == info.GoodId) {
            ele.num = info.num;
            ele.num++;
            this.saveData(ele, wx.getStorageSync('shopInfo').ShopId)
          }
        })
      },
      saveData(info, ShopId) {
        // console.log(info, ShopId)
        // 先获取缓存数据
        let cartListSum = wx.getStorageSync('cartListSum') || [];
        if (cartListSum.length) {
          //先获取到店铺的id
          let cartItem = cartListSum.filter(e => e.ShopId == ShopId)
          if (cartItem.length) {
            // console.log('有此店铺')
            // console.log(cartItem[0].cartList, '过滤')
            if (info.MultiSpec == 0) { //无规格商品
              // console.log(info, '无规格')
              //返回info在列表的索引
              let n = cartItem[0].cartList.findIndex(e => e.GoodId == info.GoodId)
              // console.log(n, '存在索引')
              //数据存在就赋值，不存在就push
              if (n >= 0) {
                // console.log('找到了')
                cartItem[0].cartList.forEach(e => {
                  if (e.GoodId == info.GoodId) {
                    e.num = info.num;
                    e.check = info.check;
                  }
                })
              } else {
                // console.log(cartItem[0].cartList, '没找到')
                cartItem[0].cartList.push(info)
              }
            } else { //有规格商品
              // console.log(info, '有规格')
              //返回info在列表的索引
              let n = cartItem[0].cartList.findIndex(e => e.Id == info.Id)
              // console.log(n, '存在索引')
              if (n >= 0) {
                // console.log('找到了')
                cartItem[0].cartList.forEach(e => {
                  if (e.Id == info.Id) {
                    e.num = info.num;
                    e.check = info.check;
                  }
                })
              } else {
                // console.log(cartItem[0].cartList, '没找到')
                cartItem[0].cartList.push(info)
              }
            }
            //针对num等于0的数据仍保留做清空处理
            this.cartListItem = cartItem[0].cartList.filter(e => e.num != 0)
            // console.log(this.cartListItem)
            //走设置
            cartListSum.forEach(e => {
              if (e.ShopId == ShopId) {
                e.cartList = this.cartListItem;
              }
            })
            //针对商品列表为空的店铺做清空处理
            cartListSum = cartListSum.filter(e => e.cartList.length > 0);
            // 再设置缓存数据
            wx.setStorageSync('cartListSum', cartListSum);
            //缓存length不存在，直接清除
            !cartListSum.length && wx.removeStorageSync('cartListSum');
          } else {
            // console.log('查无此店铺')
            cartListSum.push({
              ShopId: ShopId,
              cartList: [{
                ...info
              }]
            })
            wx.setStorageSync('cartListSum', cartListSum);
            let cartItemInit = cartListSum.filter(e => e.ShopId == ShopId);
            this.cartListItem = cartItemInit[0].cartList.filter(e => e.num != 0);
          }
        } else {
          //没有缓存，添加店铺id以及第一条数据
          cartListSum.push({
            ShopId: ShopId,
            cartList: [{
              ...info
            }]
          })
          wx.setStorageSync('cartListSum', cartListSum);
          let cartItemInit = cartListSum.filter(e => e.ShopId == ShopId);
          this.cartListItem = cartItemInit[0].cartList.filter(e => e.num != 0);
        }
      },
    },
    computed: {},
    watch: {
      cartListItem: {
        handler: function(newVal, oldVal) {
          // console.log(newVal);
          !newVal.length && (this.tips = true);
          let checkList = newVal.filter(e => e.check == true);
          this.sumCheskState = checkList.length == this.cartListItem.length ? true : false;
          //结算按钮高亮
          this.sumNum = checkList.length > 0 ? true : false;
          this.countNum(checkList)
        },
        deep: true
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .cart {
    height: 100%;
    padding-bottom: 104rpx;
    box-sizing: border-box;
    .cart_con {
      height: 100%;
      position: relative;
      box-sizing: border-box;
      padding-top: 108rpx;
      padding-bottom: 100rpx;
    }
    .cart_list::-webkit-scrollbar {
      display: none;
    }
    .cart_list {
      height: 100%;
      padding: 0 36rpx;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: scroll;
      li {
        padding: 36rpx 0;
        overflow: hidden;
        position: relative;
        display: flex;
        align-items: center;
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
          z-index: 10;
        }
        .checked_item {
          width: 60rpx;
          padding: 30rpx 0;
          margin-right: 16rpx;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .cart_lis_img {
          width: 136rpx;
          height: 136rpx;
          border-radius: 10rpx;
          margin-right: 16rpx;
        }
        .lis_right {
          line-height: 42rpx;
          flex: 1;
          position: relative;
          .lis_shop_name {
            font-size: 30rpx;
            color: #1d1d1d;
            font-weight: 700;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 365rpx;
          }
          .lis_shop_norm {
            height: 42rpx;
            font-size: 22rpx;
            color: #999999;
          }
          .lis_info {
            display: flex;
            align-items: center;
            i {
              transform: translateY(-2rpx);
            }
            p {
              font-size: 36rpx;
              color: #ff4d3a;
              span {
                font-size: 24rpx;
                margin-right: 6rpx;
              }
            }
            del {
              font-size: 22rpx;
              color: #ccc;
              transform: translateY(4rpx);
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
        }
        .count {
          position: absolute;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          width: 170rpx;
          justify-content: flex-end;
          .lower,
          .add {
            width: 44rpx;
            height: 44rpx;
          }
          span {
            font-size: 24rpx;
            color: #939393;
            margin: 0 12rpx;
          }
        }
      }
      li:nth-last-child(1) {
        &:after {
          display: none !important;
        }
      }
    }
    .cart_top {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: 5;
      height: 108rpx;
      margin: 0 36rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      .checked_sum_item {
        display: flex;
        padding: 20rpx 0;
        align-items: center;
        justify-content: flex-start;
        span {
          margin-left: 6rpx;
          font-size: 28rpx;
          color: #999;
        }
      }
      .edit_cart {
        font-size: 28rpx;
        color: #999;
        padding: 20rpx 0;
      }
    }
    .cart_bot {
      height: 100rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 5;
      padding-left: 35rpx;
      box-sizing: border-box;
      z-index: 5;
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
      .sum_money {
        font-size: 46rpx;
        color: #1a1a1a;
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        line-height: 100rpx;
        span {
          font-size: 28rpx;
          margin-right: 10rpx;
        }
        i {
          font-size: 38rpx;
          margin-right: 6rpx;
        }
      }
      .sum {
        width: 230rpx;
        height: 100rpx;
        background-color: #ff4d3a;
        font-size: 32rpx;
        color: #fff;
        line-height: 100rpx;
        text-align: center;
        border: 0;
      }
      .no_active {
        background-color: #999;
      }
      .del_cart {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 184rpx;
        height: 64rpx;
        border-radius: 6rpx;
        border: 1px solid #ff4d3a;
        box-sizing: border-box;
        margin-right: 36rpx;
        p {
          margin-left: 6rpx;
          font-size: 24rpx;
          color: #ff4d3a;
        }
      }
      .open_state {
        font-size: 36rpx;
        color: #1a1a1a;
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        line-height: 100rpx;
        padding-right: 36rpx;
      }
    }
  }
  .no_cart_product {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .no_cart_product_con {
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateY(-30%);
    }
    p {
      padding-top: 14rpx;
      text-align: center;
      font-size: 22rpx;
      color: #999;
    }
  }
</style>
