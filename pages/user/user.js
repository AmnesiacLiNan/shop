const app = getApp();

import {
  getMenuList,
  getUserInfo
} from '../../api/user.js';
import {
  switchH5Login
} from '../../api/api.js';
import authLogin from '../../utils/autuLogin.js';
import util from '../../utils/util.js';
import { qrcoder }from'../../api/order.js'

import {phone} from '../../api/user.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '0',
      'isshare': '0',
      'title': '个人中心',
      // 'color': true,
      // 'class': '0'
    },
    userInfo: {},
    MyMenus: [],
    isGoIndex: false,
    iShidden: true,
    switchActive: false,
    loginType: app.globalData.loginType,
    orderStatusNum: {},
    showbox: false
  },

  close: function() {
    this.setData({
      switchActive: false
    });
  },
  /**
   * 授权回调
   */
  onLoadFun: function(e) {
    this.getUserInfo();
    this.getMyMenus();
  },
  /**
   * 
   * 获取个人中心图标
   */
  getMyMenus: function() {
    var that = this;
    if (this.data.MyMenus.length) return;
    getMenuList().then(res => {
      that.setData({
        MyMenus: res.data.routine_my_menus
      });
    });
  },
  /**
   * 获取个人用户信息
   */
  getUserInfo: function() {
    var that = this;
    getUserInfo().then(res => {
      that.setData({
        is_serve: res.data.is_serve,
        userInfo: res.data,
        loginType: res.data.login_type,
        orderStatusNum: res.data.orderStatusNum
      });
    });
  },
  /**
   * 页面跳转
   */
  goPages: function(e) {
    let url = e.currentTarget.dataset.url
    if (app.globalData.isLog) {
      console.log(this.data.userInfo)
      if (url == '/pages/user_spread_user/index' && this.data.userInfo.statu == 1) {
        if (this.data.userInfo.is_promoter == 0) {
          wx.showToast({
            title: '你还不是推广员',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          setTimeout(function() {
            url = '/pages/Upload/Upload'
            wx.navigateTo({
              url: url
            })
          }, 2000)
          return
        }
      }
      if (url == '/pages/logon/index') return this.setData({
        switchActive: true
      });
      wx.navigateTo({
        url: url
      })
    } else {
      this.setData({
        iShidden: false
      });
    }
  },
  // 联系客服
  customer(){
    let that = this
    phone().then(res => {
     that.setData({
       phone: res.data
     })
    });
    if(that.data.showbox==false){
      that.setData({
        showbox: true
      })
    }else{
      that.setData({
        showbox: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      MyMenus: app.globalData.MyMenus
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      switchActive: false
    });
  },

  onShow: function() {
    let that = this;
    if (app.globalData.isLog) this.getUserInfo();
  },
  sm(){
    var that = this;
    wx.navigateTo({
      url: '../Sweepcode/Sweepcode',
    })
  },
  tel: function (e) {
    let phone_num = e.currentTarget.dataset.phone_num
    wx.makePhoneCall({
      phoneNumber: phone_num,
    })
  }
})