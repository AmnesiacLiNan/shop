// pages/group-list/index.js
// import { getCombinationList } from '../../../api/activity.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'isshare': '0',
      'title': '拼团列表',
      'color': true,
      'class': '0'
    },
    combinationList: [],
    limit: 20,
    offset: 0,
    status:false,
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCombinationList();
  },
  getCombinationList:function(){
    let that = this
    let data = { offset: that.data.offset, limit: that.data.limit }
    wx.request({
      url: getApp().globalData.url+'/api/combination/list',
      data:data ,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(454545, res)
        var combinationList = that.data.combinationList;
        var limit = that.data.limit;
        var offset = that.data.offset;
        that.setData({
          status: limit > res.data.data.length,
          combinationList: res.data.data,
          offset: Number(offset) + Number(limit)
        });
      }
    })
    // var that = this;
    // if (that.data.status) return;
    // var data = { offset: that.data.offset, limit: that.data.limit};
    // getCombinationList(data).then(function (res) {
    //   console.log(res,that.data.combinationList)
    //     var combinationList = that.data.combinationList;
    //     var limit = that.data.limit;
    //     var offset = that.data.offset;
    //     that.setData({
    //       status: limit > res.data.length,
    //       combinationList: combinationList.concat(res.data),
    //       offset: Number(offset) + Number(limit)
    //     });
    //   })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCombinationList();
  }
})
