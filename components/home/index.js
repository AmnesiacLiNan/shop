// components/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeActive:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setTouchMove: function (e) {
    var that = this;
    if (e.touches[0].clientY < 400 && e.touches[0].clientY > 66) {
      that.setData({
        top: e.touches[0].clientY
      })
    }
  },
  open:function(){
    //  this.setData({
    //    homeActive: !this.data.homeActive
    //  })
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})