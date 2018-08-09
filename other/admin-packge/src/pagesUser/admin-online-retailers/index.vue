<template>
  <div class="index">
    <div class="index-set" @click="goSet(1)">
      <p>头部图配置</p>
      <p>
        <input v-if="bannerList && bannerList.length == 0" type="text" disabled placeholder="请配置" placeholder-style="color:#ccc">
        <span v-if="bannerList && bannerList.length">已配置{{bannerList.length}}图</span>
        <!-- <span>已配置{{bannerList.length}}图</span> -->
        <i class="icon icon_arrowRight"></i>
      </p>
    </div>
    <div class="index-banner">
      <swiper class="swiperBox" v-if="bannerList.length" circular="true" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
        <block v-for="(item,index) in bannerList" :key="index" @click.stop="go(item)">
          <swiper-item>
            <img :src="item.PictureUrl" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="index-set" @click="goSet(2)">
      <p>小图区</p>
      <p>
        <input v-if="navLists && navLists.length == 0" type="text" disabled placeholder="请配置" placeholder-style="color:#ccc">
        <span v-if="navLists && navLists.length">{{navLists.length}}图样式</span>
        <!-- <span>{{navLists.length}}图样式</span> -->
        <i class="icon icon_arrowRight"></i>
      </p>
    </div>
    <div class="index-nav">
      <div class="index-nav-cont" :class="{navRow: navLists ? navLists.length < 3: false}">
        <div class="index-nav-item" @click.stop="go(v)" :class="{indexNavItems: navLists.length < 4}" v-for="(v,i) in navLists" :key="i">
          <img v-if="v.LinkType" :src="v.PictureUrl" />
          <!-- <p>苹果</p> -->
          <div v-else></div>
        </div>
      </div>
    </div>
    <div class="index-set" @click="goSet(3)">
      <p>广告图区</p>
      <p>
        <input v-if="adList && adList.length == 0" type="text" disabled placeholder="请配置" placeholder-style="color:#ccc">
        <span v-if="adList && adList.length">{{adList.length}}图样式</span>
        <!-- <span>{{adList.length}}图样式</span> -->
        <i class="icon icon_arrowRight"></i>
      </p>
    </div>
    <div class="index-ad">
      <div class="index-ad-item" @click.stop="go(item)" v-for="(item,index) in adList" :key="index">
        <img v-if="item.LinkType" :src="item.PictureUrl" />
        <div v-else></div>
      </div>
    </div>
    <div class="index-set recommend-set" @click="goSet(4)">
      <p>商品列表</p>
      <p>
        <input type="text" v-model="classType.Name" disabled placeholder="请配置" placeholder-style="color:#ccc">
        <i class="icon icon_arrowRight"></i>
      </p>
    </div>
    <div class="index-recommend">
      <div class="index-recommend-title">
        <i class="icon icon_recommend"></i>
        <p>
          <span>推荐商品</span>
          <i class="icon icon_curve"></i>
        </p>
      </div>
      <div class="index-recommend-list">
        <div class="index-recommend-item" :class="{goodDefault:goodsDefault}" v-for="(item,index) in goodList" :key="index">
          <img :src="item.MasterPic" />
          <div class="noStockBg" v-if="item.MinSpecGoodsStock==0"></div>
          
          <div class="index-recommend-item-title" v-if="goodsDefault">商品名称</div>
          <div class="index-recommend-item-title" :class="{stockNo:item.MinSpecGoodsStock==0}" v-if="!goodsDefault">{{item.GoodName}}</div>
          <div class="index-recommend-item-price" v-if="goodsDefault">商品价格</div>
          <div class="index-recommend-item-price" v-if="!goodsDefault">
            <div class="index-recommend-item-price-cont1" v-if="classType.ID == -1">
              <p v-if="item.MinSpecGoodsStock>0">
                <span>￥{{item.SalesPrice}}</span>
                <span>￥{{item.OriginalPrice}}</span>
              </p>
              <p class="sellOut" v-if="item.MinSpecGoodsStock==0">已售罄</p>
            </div>
            <div class="index-recommend-item-price-cont2" v-else>
              <p v-if="item.MinSpecGoodsStock>0">￥{{item.OriginalPrice}}</p>
              <p class="sellOut" v-if="item.MinSpecGoodsStock==0">已售罄</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnBox">
      <p @click="save">保存</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        goodsDefault: true,
        shopId: '',
        //配置数据
        shopConfig: {},
        bannerList: [{
              Id: 0,
              Type: 1,
              LinkType: '',
              PictureUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/defaultBanner.png',
              ActivityLink: '',
              GoodsTypeId: 0,
              GoodsId: 0,
              State: 0
            }],
        navLists: [],
        adList: [],
        //商品列表数据
        classType: {},
        goodList: [],
        //swiper配置
        indicatorDots: true,
        autoplay: true,
        interval: 4000,
        duration: 500,
        classifyName: '',
      }
    },
    onUnload() {
      //console.log('主页onunload')
      this.goodList = [];
      this.classType = {};
      wx.removeStorageSync('bannerList');
      wx.removeStorageSync('delBannerList');
      wx.removeStorageSync('oldBannerList');
      wx.removeStorageSync('adList');
      wx.removeStorageSync('oldAdList');
      wx.removeStorageSync('navList');
      wx.removeStorageSync('delNavList');
      wx.removeStorageSync('setClassify');
      wx.removeStorageSync('jumpType');
      wx.removeStorageSync('classType');
      wx.removeStorageSync('delAdList');

    },
    onLoad() {
      //console.log('onload')
      
    },
    onShow() {
      wx.showLoading({
        title: '加载中',
      })
      //console.log('onshow');
      //初始化
      this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
      this.getData();
      
      //console.log(this.bannerList.length)
      setTimeout(function(){
        wx.hideLoading()
      },1000)
    },
    onReady() {
      //console.log('onready');
      // 初次加载时渲染接口数据 
      // this.getData();
    },
    methods: {
      //加载缓存
      initStorge() {
        setTimeout(_ => {
          //没有数据 显示默认
          
          //banner轮播默认占位
          //判断oldBannerList有数据   bannerList没有数据 展示默认
          console.log('初始化')
          if (this.bannerList.length == 0 ) {
            
            //console.log('banner长度0000')
            this.bannerList=[{
              Id: 0,
              Type: 1,
              LinkType: '',
              PictureUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/defaultBanner.png',
              ActivityLink: '',
              GoodsTypeId: 0,
              GoodsId: 0,
              State: 0
            }]
          }
          // if(this.bannerList.length == 1) {
          //   //如果一张图不显示索引点
          //   this.indicatorDots = false;
          // }else {
          //   this.indicatorDots = true;
          // }
          //console.log(this.navLists)
          //小图区默认占位
          if (this.navLists.length == 0) {
            for (var i = 0; i < 8; i++) {
              this.navLists.push({
                Id: 0,
                Type: 2,
                LinkType: '',
                PictureUrl: '',
                ActivityLink: '',
                GoodsTypeId: 0,
                GoodsId: 0,
                State: 0
              });
            }
          }
          
          //广告区默认占位
          if (this.adList.length == 0) {
            for (var i = 0; i < 3; i++) {
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
            }
          }
          
          //商品区默认占位
          if (this.goodList.length == 0) {
            //console.log('商品占位')
            this.goodsDefault = true;
            for (var i = 0; i < 2; i++) {
              this.goodList.push({
                Id: 0,
                Type: 4,
                LinkType: '',
                PictureUrl: '',
                ActivityLink: '',
                GoodsTypeId: 0,
                GoodsId: 0,
                State: 0
              });
            }
          }else {
            this.goodsDefault = false;
          }
          // 页面折回，判断缓存 并渲染缓存
          this.shopConfig = wx.getStorageSync('shopConfig') ? wx.getStorageSync('shopConfig') : {};
          this.bannerList = wx.getStorageSync('bannerList') ? wx.getStorageSync('bannerList') : this.bannerList;
          this.navLists = wx.getStorageSync('navList') ? wx.getStorageSync('navList') : this.navLists;
          this.adList = wx.getStorageSync('adList') ? wx.getStorageSync('adList') : this.adList;
          this.classType = wx.getStorageSync('classType') ? wx.getStorageSync('classType') : this.classType;
          //console.log('分类信息')
          //console.log(this.classType)
          if (this.classType.Name) {
            //console.log(1234567489)
            this.getGoodsList(this.classType.ID);
          }
        }, 200)
      },
      //点击图片
      go(v) {
        //console.log(v);
      },
      //获取模板数据
      getData() {
        this.util.post({
          url: '/api/Merchant/ShopManage/GetECommerceTemplate',
          data: {
            ShopId: wx.getStorageSync('loginInfo').ShopID || '',
            TemplateId: 2
          }
        }).then(res => {
          //console.log(res)
          if (res.State == 1) {
            this.shopConfig = res.Body;
            this.bannerList = res.Body.SectionFirst ? res.Body.SectionFirst : [{
              Id: 0,
              Type: 1,
              LinkType: '',
              PictureUrl: 'https://otherfiles-ali.uupt.com/Stunner/FE/M/defaultBanner.png',
              ActivityLink: '',
              GoodsTypeId: 0,
              GoodsId: 0,
              State: 0
            }];
            this.navLists = res.Body.SectionSecond ? res.Body.SectionSecond : [];
            this.adList = res.Body.SectionThird ? res.Body.SectionThird : [];
            //分类数据回填
            if (res.Body.SectionFourth) {
              this.getClass(res.Body.SectionFourth[0] ? res.Body.SectionFourth[0].GoodsTypeId : 0)
            }
          } else {
            this.msg(res.Msg);
          }
          this.initStorge();
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      //获取分类信息
      getClass(classId) {
        this.util.post({
          url: '/api/Merchant/ShopManage/GetGoodsTypes',
          data: {
            ShopID: this.shopId
          }
        }).then(res => {
          //遍历回填数据
          res.Body.forEach(ele => {
            if (ele.ID == classId) {
              this.classType = ele;
              this.getGoodsList(ele.ID);
            }
          })
        }).catch(err => {
          wx.hideLoading();
          this.msg(err.Msg)
        })
      },
      //获取商品数据
      getGoodsList(classId) {
        //console.log('分类商品')
        //console.log(classId)
        this.util.post({
          url: '/api/Merchant/Goods/GoodList',
          data: {
            ShopId: this.shopId,
            GoodState: classId == -1?1:0,
            PageSize: 2,
            PageIndex: 1,
            GoodType: classId ? classId : 0,
          }
        }).then(res => {
          //console.log(res)
          this.goodList = res.Body;
          //console.log(this.goodList)
          if(this.goodList.length == 0) {
            this.goodsDefault = true;
          }else {
            this.goodsDefault = false;
          }
        }).catch(err => {
          wx.hideLoading();
          this.msg(err.Msg)
        })
      },
      //跳转设置
      goSet(state) {
        //console.log(state);
        let link;
        switch (state) {
          case 1:
            wx.setStorageSync('bannerList', this.bannerList);
            wx.setStorageSync('oldBannerList', this.bannerList);
            link = '/pagesUser/admin-set-banner'
            break;
          case 2:
            //console.log(this.navLists);
            wx.setStorageSync('navList', this.navLists);
            link = '/pagesUser/admin-set-nav'
            break;
          case 3:
            wx.setStorageSync('oldAdList', this.adList);
            wx.setStorageSync('adList', this.adList);
            link = '/pagesUser/admin-set-ad'
            break;
          case 4:
            wx.setStorageSync('jumpType', {
              name: '分类页',
              type: 3
            });
            link = '/pagesUser/admin-jump-type?type=3'
            break;
        }
        this.goodList = [];
        wx.navigateTo({
          url: link
        })
      },
      //保存
      save() {
        //console.log(this.navLists)
        //可以和原有数据对比
        // let banners = wx.getStorageSync('bannerList') ? wx.getStorageSync('bannerList') : JSON.parse(JSON.stringify(this.bannerList));
        let navs = wx.getStorageSync('navList') ? wx.getStorageSync('navList') : JSON.parse(JSON.stringify(this.navLists));
        let ads = wx.getStorageSync('adList') ? wx.getStorageSync('adList') : JSON.parse(JSON.stringify(this.adList));
        // let delBanners = wx.getStorageSync('delBannerList') ? wx.getStorageSync('delBannerList') : [];
        //如果没有数据  添加默认值   用于合并数组
        //console.log('savestart')
        // if (banners.length == 0) {
        //   //console.log('banner判断')
        //   banners.push({
        //     Id: 0,
        //     Type: 1,
        //     LinkType: '',
        //     PictureUrl: '',
        //     ActivityLink: '',
        //     GoodsTypeId: 0,
        //     GoodsId: 0,
        //     State: 0
        //   })
        // }
        if (navs.length == 0) {
          navs.push({
            Id: 0,
            Type: 2,
            LinkType: '',
            PictureUrl: '',
            ActivityLink: '',
            GoodsTypeId: 0,
            GoodsId: 0,
            State: 0
          })
        }
        if (ads.length == 0) {
          ads.push({
            Id: 0,
            Type: 3,
            LinkType: '',
            PictureUrl: '',
            ActivityLink: '',
            GoodsTypeId: 0,
            GoodsId: 0,
            State: 0
          })
        }
        // if (delBanners.length == 0) {
        //   delBanners.push({
        //     Id: 0,
        //     Type: 1,
        //     LinkType: '',
        //     PictureUrl: '',
        //     ActivityLink: '',
        //     GoodsTypeId: 0,
        //     GoodsId: 0,
        //     State: -1
        //   })
        // }
        //console.log('saveend')
        //商品分类
        let classType = [{
          Id: 0,
          Type: 4,
          LinkType: 3,
          PictureUrl: '',
          ActivityLink: '',
          GoodsTypeId: wx.getStorageSync('classType') ? wx.getStorageSync('classType').ID : this.classType.ID,
          GoodsId: 0,
          State: 0
        }];
        //合并数组
        // let lists = banners.concat([...navs], [...ads], [...delBanners], [...classType]);
        let lists = navs.concat([...ads], [...classType], [...this.bannerList]);
        //console.log(lists)
        //过滤掉没有LinkType 的数据
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
        //console.log(arrs)
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
            this.msg('修改成功');
            wx.removeStorageSync('bannerList');
            wx.removeStorageSync('delBannerList');
            wx.removeStorageSync('oldBannerList');
            wx.removeStorageSync('adList');
            wx.removeStorageSync('oldAdList');
            wx.removeStorageSync('navList');
            wx.removeStorageSync('delNavList');
            wx.removeStorageSync('setClassify');
            wx.removeStorageSync('jumpType');
            wx.removeStorageSync('classType');
            wx.removeStorageSync('delAdList');

            //修改本地缓存店铺模板信息ID
            let shopInfo=wx.getStorageSync('shopInfo');
            shopInfo.ShopViewTemplate=2;
            wx.setStorageSync('shopInfo',shopInfo);
            setTimeout(_ => {
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.redirectTo({
                url: '/pages/admin-store-templet'
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
  .index {
    .index-set {
      padding: 31rpx 36rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      p {
        flex: 1;
        font-size: 28rpx;
        color: #1a1a1a;
        line-height: 1;
        display: flex;
        align-items: center;
      }
      p:last-child {
        text-align: right;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        input {
          margin-right: 21rpx;
          text-align: right;
        }
        span {
          margin-right: 21rpx;
        }
        i {
          width: 25rpx;
          height: 25rpx;
        }
      }
    }
    .recommend-set {
      padding:31rpx 36rpx 80rpx;
    }
    .index-banner {
      padding: 0 36rpx 49rpx;
      height: 320;
      position: relative;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        border-bottom: 1PX solid #eeeef4;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      .swiperBox {
        height: 320rpx;
      }
      .slide-image {
        width: 100%;
        height: 100%;
        border-radius: 10rpx;
      }
    }
    .index-nav {
      padding: 0 36rpx 35rpx;
      position: relative;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        border-bottom: 1PX solid #eeeef4;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      .index-nav-cont {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        .index-nav-item {
          width: 159rpx;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin-bottom: 14rpx;
          img {
            width: 100%;
            height: 159rpx;
            border-radius: 10rpx;
          }
          p {
            font-size: 24rpx;
            color: #000000;
            text-align: center;
            line-height: 24rpx;
            margin-top: 17rpx;
          }
          div {
            width: 100%;
            height: 159rpx;
            border-radius: 10rpx;
            background: #f5f5fa;
          }
        }
        .indexNavItems {
          width: 212rpx;
          height: 212rpx;
          img {
            height: 100%;
          }
        }
      }
      .navRow {
        flex-direction: row;
        justify-content: flex-start;
        .index-nav-item:last-child {
          margin-left: 21rpx;
        }
      }
    }
    .index-ad {
      padding: 0 36rpx 33rpx;
      position: relative;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        border-bottom: 1PX solid #eeeef4;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      .index-ad-item {
        height: 200rpx;
        margin-bottom: 16rpx;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
        div {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
          background: #f5f5fa;
        }
      }
      &.index-ad-item:last-child {
        margin-bottom: 0;
      }
    }
    .index-recommend {
      padding: 0 36rpx 110rpx;
      position: relative;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        border-bottom: 1PX solid #eeeef4;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      .index-recommend-title {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        i {
          margin-right: 18rpx;
        }
        p {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          span {
            font-size: 40rpx;
            font-weight: 700;
            color: #000000;
            line-height: 1;
          }
          i {
            width: 160rpx;
            height: 10rpx;
            margin-top: 7rpx;
          }
        }
      }
      .index-recommend-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 40rpx;
        .index-recommend-item {
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
          }
          .noStockBg {
            position: absolute;
            width: 100%;
            height: 332rpx;
            top: 0;
            left: 0;
            border-radius: 10rpx;
            background-color: rgba(255, 255, 255, 0.55);
          }
          .index-recommend-item-title {
            margin-top: 20rpx;
            font-size: 28rpx;
            font-weight: 700;
            color: #000;
            line-height: 40rpx;
            height: 80rpx;
            // overflow: hidden;
            // text-overflow:ellipsis;
            // white-space: nowrap;
          }
          .stockNo {
            color: #999999;
          }
          .index-recommend-item-price {
            margin-top: 10rpx;
            font-size: 30rpx;
            font-weight: 600;
            color: #ed523d;
            .index-recommend-item-price-cont1 {
              p {
                span {

                }
                span:last-child { 
                  font-size: 24rpx;
                  color: #999999;
                  margin-left: 6rpx;
                  text-decoration:line-through;
                }
              }
            }
            .index-recommend-item-price-cont2 {

            }
            .sellOut {
                font-size: 24rpx;
                color: #999999;
            }
          }
        }
        .goodDefault {
          img {
            background: #f5f5fa;
          }
        }
      }
    }
    .btnBox {
      padding: 19rpx 36rpx;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 9999;
      background: #fff;
      border-top: 1rpx solid #eeeef4;
      // &:after {
      //   content: '';
      //   display: block;
      //   width: 100%;
      //   height: 0;
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   border-top: 1PX solid #eeeef4;
      //   transform: scaleY(0.5);
      //   transform-origin: 0 0;
      // }
      p {
        width: 678rpx;
        height: 80rpx;
        background-color: #0863ee;
        color: #ffffff;
        font-size: 26rpx;
        text-align: center;
        line-height: 80rpx;
      }
    }
  }
</style>
