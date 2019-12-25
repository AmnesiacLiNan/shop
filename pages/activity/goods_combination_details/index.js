import { getCombinationDetail } from '../../../api/activity.js';
import wxh from '../../../utils/wxh.js';
import wxParse from '../../../wxParse/wxParse.js';
import { getProductCode, collectAdd, collectDel, postCartAdd } from '../../../api/store.js';
import WxParse from '../../../wxParse/wxParse.js';
import { getSeckillDetail } from '../../../api/activity.js';
import { getUserInfo, userShare } from '../../../api/user.js';
import util from '../../../utils/util.js';
import { getCoupons, setFormId } from '../../../api/api.js';
import { getCartCounts } from '../../../api/order.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    parameter: {
      'navbar': '1',
      'return': '1',
      'isshare':'0',
      'title': '商品详情'
    },
    userInfo:{},
    itemNew: [],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    attribute: {
      'cartAttr': false
    },
    productSelect: [],
    productAttr: [],
    productValue: [],
    isOpen: false,
    attr: '请选择',
    attrValue: '',
    AllIndex:2,
    replyChance:'',
    showbox:false,
    actionSheetHidden: true,
    posterImageStatus: false,
    storeImage: '',//海报产品图
    PromotionCode: '',//二维码图片
    canvasStatus: false,//海报绘图标签
    posterImage: '',//海报路径
    posterbackgd: '/images/posterbackgd.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty('id')) {
      this.setData({ id: options.id });
      app.globalData.openPages = '/pages/activity/goods_combination_details/index?id=' + this.data.id + '&spid=' + this.data.userInfo.uid;
    } else {
      app.Tips({
        title: '参数错误',
        icon: 'none',
        duration: 1000,
        mask: true,
      },{tab:3,url:1});
    };
    if (options.isshare == 1) {
      console.log('是分享进入');
      this.setData({
        'parameter.isshare': options.isshare
      })
    }
  },
  goProduct:function(){
    return app.Tips('/pages/goods_details/index?id=' + this.data.storeInfo.product_id);
  },
  combinationDetail:function(){
    var that = this;
    var data = that.data.id; 
    getCombinationDetail(data).then(function(res){
      console.log('商品详情',res)
      that.setData({
        mer_mobile_list:res.data.mer_mobile_list,
        ["parameter.title"]: res.data.storeInfo.title.substring(0,16),
        imgUrls: res.data.storeInfo.images,
        imgs: res.data.storeInfo.image,
        storeInfo_name: res.data.storeInfo.title,
        storeInfo: res.data.storeInfo,
        product_id: res.data.storeInfo.product_id,
        pink: res.data.pink,
        pindAll: res.data.pindAll,
        reply: [res.data.reply],
        replyCount: res.data.replyCount,
        itemNew: res.data.pink_ok_list,
        pink_ok_sum: res.data.pink_ok_sum,
        replyChance: res.data.replyChance
      });
      console.log(that.data.product_id)
      that.downloadFilestoreImage();
      that.downloadFilePromotionCode();
      that.setTime();
      wxParse.wxParse('description', 'html', that.data.storeInfo.description, that, 0);
      app.globalData.openPages = '/pages/activity/goods_combination_details/index?id=' + that.data.id + '&scene=' + that.data.userInfo.uid;
      that.setProductSelect();
    });
  },
  onMyEvent: function (e) {
    this.setData({ 'attribute.cartAttr': e.detail.window, isOpen: false })
  },
  setTime: function () {//到期时间戳
    var that = this;
    var endTimeList = that.data.pink;
    var countDownArr = [];
    var timeer=setInterval(function(){
      var newTime = new Date().getTime() / 1000;
      for (var i in endTimeList) {
        var endTime = endTimeList[i].stop_time;
        var obj = [];
        if (endTime - newTime > 0) {
          var time = endTime - newTime;
          var day = parseInt(time / (60 * 60 * 24));
          var hou = parseInt(time % (60 * 60 * 24) / 3600);
          var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          hou = parseInt(hou) + parseInt(day * 24);
          obj = {
            day: that.timeFormat(day),
            hou: that.timeFormat(hou),
            min: that.timeFormat(min),
            sec: that.timeFormat(sec)
          }
        } else {
          obj = {
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
          }
        }
        endTimeList[i].time = obj;
      }
      that.setData({
        pink: endTimeList
      })
    },1000);
    that.setData({
      timeer: timeer
    })
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  /**
   * 购物车数量加和数量减
   * 
  */
  ChangeCartNum: function (e) {
    //是否 加|减
    var changeValue = e.detail;
    //获取当前变动属性
    var productSelect = this.data.productValue[this.data.attrValue];
    //如果没有属性,赋值给商品默认库存
    if (productSelect === undefined && !this.data.productAttr.length) productSelect = this.data.productSelect;
    //不存在不加数量
    if (productSelect === undefined) return;
    //提取库存
    var stock = productSelect.stock || 0;
    //设置默认数据
    if (productSelect.cart_num == undefined) productSelect.cart_num = 1;
    //数量+
    if (changeValue) {
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    } else {
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    }
  },
  /**
   * 属性变动赋值
   * 
  */
  ChangeAttr: function (e) {
    var values = e.detail;
    var productSelect = this.data.productValue[values];
    var storeInfo = this.data.storeInfo;
    if (productSelect) {
      this.setData({
        ["productSelect.image"]: productSelect.image,
        ["productSelect.price"]: productSelect.price,
        ["productSelect.stock"]: productSelect.stock,
        ['productSelect.unique']: productSelect.unique,
        ['productSelect.cart_num']: 1,
        ['productSelect.is_on']: true,
        attrValue: values,
        attr: '已选择'
      });
    } else {
      this.setData({
        ["productSelect.image"]: storeInfo.image,
        ["productSelect.price"]: storeInfo.price,
        ["productSelect.stock"]: 0,
        ['productSelect.unique']: '',
        ['productSelect.cart_num']: 0,
        ['productSelect.is_on']: true,
        attrValue: '',
        attr: '请选择'
      });
    }
  },
  setProductSelect: function () {
    var that = this;
    if (that.data.productSelect.length == 0) {
      that.setData({
        ['productSelect.image']: that.data.storeInfo.image,
        ['productSelect.store_name']: that.data.storeInfo.title,
        ['productSelect.price']: that.data.storeInfo.price,
        ['productSelect.stock']: that.data.storeInfo.stock,
        ['productSelect.unique']: '',
        ['productSelect.cart_num']: 1,
        ['productSelect.is_on']:true
      })
    }
  },
  /*
  * 下订单
  */
  goCat: function () {
    var that = this;
    console.log(that.data.productValue);
    var productSelect = this.data.productValue[this.data.attrValue];
    //打开属性
    if (this.data.isOpen)
      this.setData({ 'attribute.cartAttr': true })
    else
      this.setData({ 'attribute.cartAttr': !this.data.attribute.cartAttr });
    //只有关闭属性弹窗时进行加入购物车
    if (this.data.attribute.cartAttr === true && this.data.isOpen == false) return this.setData({ isOpen: true });
    //如果有属性,没有选择,提示用户选择
    console.log(this.data.productAttr.length);
    if (this.data.productAttr.length && productSelect === undefined && this.data.isOpen == true) return app.Tips({ title: '请选择属性' });
    var data = {
      productId: that.data.storeInfo.product_id,
      secKillId: 0,
      bargainId: 0,
      combinationId: that.data.id,
      cartNum: that.data.cart_num,
      uniqueId: productSelect !== undefined ? productSelect.unique : '',
      is_new: 1,
    };
    postCartAdd(data).then(function (res) {
      that.setData({ isOpen: false });
      wx.navigateTo({ url: '/pages/order_confirm/index?cartId=' + res.data.cartId });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoadFun:function(e){
    this.setData({ userInfo:e.detail });
    this.combinationDetail();
    this.getUserInfo();

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isClose) this.combinationDetail();
  },
  getUserInfo: function () {
    var that = this;
    getUserInfo().then(res => {
      console.log(' 获取用户信息', res)
      that.setData({ 'sharePacket.promoter': res.data.is_promoter, uid: res.data.uid });
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isClose: 1 });
    this.data.timeer && clearInterval(this.data.timeer);
  },

  showAll:function(){
    if (this.data.AllIndex > this.data.pink.length) 
      this.data.AllIndex = this.data.pink.length;
    else 
      this.data.AllIndex+=2;
    this.setData({ AllIndex: this.data.AllIndex });
  },
  hideAll:function(){
    this.setData({ AllIndex: 2 });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.storeInfo.title,
      path: app.globalData.openPages,
      imageUrl: that.data.storeInfo.image,
      success: function () {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },
  // 联系客服
  customer() {
    let that = this
    if (that.data.showbox == false) {
      that.setData({
        showbox: true
      })
    } else {
      that.setData({
        showbox: false
      })
    }
  },
  tel: function (e) {
    let phone_num = e.currentTarget.dataset.phone_num
    wx.makePhoneCall({
      phoneNumber: phone_num,
    })
  },
  /**
* 分享打开和关闭
* 
*/
  listenerActionSheet: function () {
    if (app.globalData.isLog === false)
      this.setData({ isAuto: true, iShidden: false });
    else
      this.setData({ actionSheetHidden: !this.data.actionSheetHidden })
  },
  //隐藏海报
  posterImageClose: function () {
    this.setData({ posterImageStatus: false, })
  },
  //替换安全域名
  setDomain: function (url) {
    url = url ? url.toString() : '';
    //本地调试打开,生产请注销
    // return url;
    if (url.indexOf("https://") > -1) return url;
    else return url.replace('http://', 'https://');
  },
  //获取海报产品图
  downloadFilestoreImage: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.imgs,
      success: function (res) {
        that.setData({
          imgs: res.tempFilePath
        })
      },
      fail: function (e) {
        console.log(e)
        return app.Tips({ title: '' });
        that.setData({
          imgs: '',
        })
      },
    });
  },
  /**
   * 获取产品分销二维码
   * @param function successFn 下载完成回调
   * 
  */
  downloadFilePromotionCode: function (successFn) {
    var that = this;
    console.log(that.data.product_id)
    getProductCode(that.data.product_id).then(res => {
      console.log('获取产品分销二维码1',res)
      wx.downloadFile({
        url: that.setDomain(res.data.code),
        success: function (res) {
          console.log('获取产品分销二维码', res)
          if (typeof successFn == 'function')
            successFn && successFn(res.tempFilePath);
          else
            that.setData({ PromotionCode: res.tempFilePath });
        },
        fail: function () {
          that.setData({ PromotionCode: '' });
        },
      });
    }).catch(err => {
      that.setData({ PromotionCode: '' });
    });
  },
  /**
   * 生成海报
  */
  goPoster: function () {
    console.log(11)
    var that = this;
    that.setData({ canvasStatus: true });
    var arr2 = [that.data.posterbackgd, that.data.imgs, that.data.PromotionCode];
      console.log(999,arr2)
    wx.getImageInfo({
      src: that.data.PromotionCode,
      fail: function (res) {
        return app.Tips({ 'title': '小程序二维码需要发布正式版后才能获取到' });
      },
      success() {
        console.log(789,arr2)
        if (arr2[2] == '') {
          console.log(arr2[2])
          //海报二维码不存在则从新下载
          that.downloadFilePromotionCode(function (msgPromotionCode) {
            arr2[2] = msgPromotionCode;
            if (arr2[2] == '') return app.Tips({ title: '海报二维码生成失败！' });
            util.PosterCanvas(arr2, that.data.storeInfo_name, that.data.storeInfo.price, function (tempFilePath) {
              that.setData({
                posterImage: tempFilePath,
                posterImageStatus: true,
                canvasStatus: false,
                actionSheetHidden: !that.data.actionSheetHidden
              })
            });
          });
        } else {
          //生成推广海报
          util.PosterCanvas(arr2, that.data.storeInfo_name, that.data.storeInfo.price, function (tempFilePath) {
            console.log(66,tempFilePath)
            that.setData({
              posterImage: tempFilePath,
              posterImageStatus: true,
              canvasStatus: false,
              actionSheetHidden: !that.data.actionSheetHidden
            })
          });
        }
      },
    });
  },
  /*
  * 保存到手机相册
  */
  savePosterPath: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.posterImage,
                success: function (res) {
                  that.posterImageClose();
                  app.Tips({ title: '保存成功', icon: 'success' });
                },
                fail: function (res) {
                  app.Tips({ title: '保存失败' });
                }
              })
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.posterImage,
            success: function (res) {
              that.posterImageClose();
              app.Tips({ title: '保存成功', icon: 'success' });
            },
            fail: function (res) {
              app.Tips({ title: '保存失败' });
            },
          })
        }
      }
    })
  },
})