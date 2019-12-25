// pages/bargain-list/index.js
import { getBargainList } from '../../../api/activity.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bargainList:[],
    offset:0,
    limit:20,
    status:false,
    userInfo:'',
    navH:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    console.log(app.globalData.navHeight+'aa');
  },
  goBack:function(){
    wx.navigateBack({ delta: 1 })
  },
  onLoadFun: function (e) {
    console.log(e)
    this.getBargainList();
    this.setData({
      userInfo: e.detail.uid
    })
  },
  getBargainList:function(){
    var that = this;
    if (that.data.status) return;
    var offset = that.data.offset;
    var limit = that.data.limit;
    var data = { offset: offset, limit:limit};
    getBargainList(data).then(function (res) {
      console.log('商品列表',res)
      that.setData({ 
        bargainList: res.data,
        offset: Number(offset) + Number(limit),
        status: limit > res.data.length,
      });
     });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBargainList();
  },
})