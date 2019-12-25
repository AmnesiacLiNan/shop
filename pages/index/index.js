import {
  getCouponReceive
} from '../../api/user.js';
import {
  getCoupon,
  getCombinationList
} from '../../api/store.js';
import {
  getSeckillList
} from '../../api/activity.js';

import {
  getIndexData,
  getCoupons
} from '../../api/api.js';
import {
  getBargainList
} from '../../api/activity.js';

import wxh from '../../utils/wxh.js';
var app = getApp();
import Util from '../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    itemNew: [],
    activityList: [],
    menus: [],
    bastBanner: [],
    bastInfo: '',
    bastList: [],
    fastInfo: '',
    fastList: [],
    firstInfo: '',
    firstList: [],
    salesInfo: '',
    likeInfo: [],
    lovelyBanner: [],
    benefit: [],
    bargainList: [],
    userInfo: '',
    navH: '',
    indicatorDots: false,
    circular: true,
    autoplay: true,
    parameter: {
      'navbar': '0',
      'return': '0'
    },
    window: false,
    couponsList: [],
    loading: false,
    loadend: false,
    page: 1,
    limit: 20,
    combinationList: [],
    offset: 0,
    status: false,
    seckillList: [],
    timeList: [],
    active: 5,
    scrollLeft: 0,
    interval2: 0,
    status2: 1,
    loading2: false,
    loadend2: false,
  },
  /*
   *砍价
   */
  kj() {
   
    wx.navigateTo({
      url: '../activity/goods_bargain/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (options.spid) app.globalData.spid = options.spid;
    if (options.scene) app.globalData.code = decodeURIComponent(options.scene);
    this.setData({
      navH: app.globalData.navHeight
    });
  },
  goBack: function () {
    wx.navigateBack({ delta: 1 })
  },
  catchTouchMove: function(res) {
    return false
  },
  onColse: function() {
    this.setData({
      window: false
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
    this.getSeckillConfig();
    this.onLoadFun();
    let that = this
    wx.request({
      url: getApp().globalData.url + '/api/seckill/index',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          topImage: res.data.data.lovely,
          timeList: res.data.data.seckillTime,
          active: res.data.data.seckillTimeIndex
        });
        wxh.time(that.data.timeList[that.data.active].stop, that);
        that.getSeckillList();
      }
    })
    /**
     * 滚动
     */
  },
  get_issue_coupon_list: function() {
    var that = this;
    getCoupons({
      page: 1,
      limit: 3
    }).then(res => {
      that.setData({
        couponList: res.data
      });
      if (!res.data.length) that.setData({
        window: false
      });
    });
  },
  getIndexConfig: function() {
    var that = this;
    getIndexData().then(res => {

      that.setData({
        imgUrls: res.data.banner,
        menus: res.data.menus,
        itemNew: res.data.roll,
        activityList: res.data.activity,
        bastBanner: res.data.info.bastBanner,
        bastInfo: res.data.info.bastInfo,
        bastList: res.data.info.bastList,
        fastInfo: res.data.info.fastInfo,
        fastList: res.data.info.fastList,
        firstInfo: res.data.info.firstInfo,
        firstList: res.data.info.firstList,
        salesInfo: res.data.info.salesInfo,
        likeInfo: res.data.likeInfo,
        lovelyBanner: res.data.info,
        benefit: res.data.benefit,
        logoUrl: res.data.logoUrl,
        couponList: res.data.couponList,
      });
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            that.setData({
              window: that.data.couponList.length ? true : false
            });
          } else {
            that.setData({
              window: false
            });
          }
        }
      });
    })
  },
  ////////////////////////////////优惠券
  getCoupon: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = that.data.couponsList;
    //领取优惠券
    getCouponReceive({
      couponId: id
    }).then(function(res) {
      list[index].is_use = true;
      that.setData({
        couponsList: list
      });
      app.Tips({
        title: '领取成功'
      });
    }, function(res) {
      return app.Tips({
        title: res.msg
      });
    });
  },

  /**
   * 获取领取优惠券列表
   */
  getUseCoupons: function() {
    var that = this
    if (this.data.loadend) return false;
    if (this.data.loading) return false;
    getCoupon({
      page: this.data.page,
      limit: this.data.limit
    }).then(res => {
      var list = res.data,
        loadend = list.length < that.data.limit;
      var couponsList = app.SplitArray(list, that.data.couponsList);
      that.setData({
        loading: true,
        couponsList: couponsList,
        page: that.data.page + 1,
        loadend: loadend
      });
    }).catch(err => {
      that.setData({
        loading: false
      });
    });
  },
  onReachBottom: function() {
    this.getUseCoupons();
    this.getCombinationList();

  },
  ///////////////////////////////拼团
  getCombinationList: function() {
    var that = this;
    if (that.data.status) return;
    var data = {
      offset: that.data.offset,
      limit: that.data.limit
    };
    getCombinationList(data).then(function(res) {
      var combinationList = that.data.combinationList;
      var limit = that.data.limit;
      var offset = that.data.offset;
      that.setData({
        combinationList: res.data,
        offset: Number(offset) + Number(limit)
      });
    })
  },
  ////////////////////////秒杀
  goDetails: function(e) {
    wx.navigateTo({
      url: '/pages/activity/goods_seckill_details/index?id=' + e.currentTarget.dataset.id + '&time=' + this.data.timeList[this.data.active].stop,
    })
  },
  getSeckillConfig: function() {
    let that = this
  },
  getSeckillList: function() {
    let that = this;
    let data = {
      page: 0,
      limit: 20
    };
    if (that.data.loadend2) return;
    if (that.data.loading2) return;
    that.setData({
      loading2: true
    });
    getSeckillList(that.data.timeList[that.data.active].id, data).then(res => {
      let seckillList = that.data.seckillList;
      let loadend2 = seckillList.length < that.data.limit;
      that.data.page++;
      that.setData({
        seckillList: seckillList.concat(res.data),
        offset: that.data.page,
        loading2: false,
        loadend2: loadend2
      });
    }).catch(err => {
      that.setData({
        loading2: false
      });
    });
  },
  /////////////////////////////////////
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      window: false
    });
    if (this.data.interval) {
      clearInterval(this.data.interval);
      this.setData({
        interval: null
      });
    }
  },
  onLoadFun: function(e) {
    this.getIndexConfig();
    this.getUseCoupons();
    this.getCombinationList();
    this.getBargainList();
  },
  /**
   * 砍价
   */
  getBargainList: function () {
    var that = this;
    if (that.data.status) return;
    var offset = that.data.offset;
    var limit = that.data.limit;
    var data = { offset: offset, limit: limit };
    getBargainList(data).then(function (res) {
      that.setData({
        bargainList: res.data,
        offset: Number(offset) + Number(limit),
        status: limit > res.data.length,
      });
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getIndexConfig();
    if (app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
    wx.stopPullDownRefresh();
  },
})