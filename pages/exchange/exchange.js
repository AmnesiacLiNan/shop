// pages/coupon-list/index.js

import {
  getcode
} from '../../api/api.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'isshare': '0',
      'title': '我的兑换券',
      'color': false
    },
    couponsList: [],
    loading: false,
    code_num: 0
  },

  /**
   * 授权回调
   */
  onLoadFun: function() {
    this.getcode();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 跳转到兑换券信息
   */
  tz(e) {
    // console.log(e)
    let order_id = e.currentTarget.dataset.order_id
    wx.navigateTo({
      url: '../details/details?order_id='+order_id,
    })
  },
  /**
   * 获取领取优惠券列表
   */
  getcode: function() {
    var that = this;
    getcode().then(res => {
      console.log('兑换券', res.data)
      that.setData({
        list: res.data
      })
    })
  },
  /**
   * 兑换券选择
   */
  xz(e) {
    console.log(e)
    if (e.currentTarget.dataset.code_num == 0) {
      this.setData({
        code_num: 0
      })
    }else{
      this.setData({
        code_num: 2
      })
    }
  }

})