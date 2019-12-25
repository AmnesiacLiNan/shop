// pages/Sweepcode/Sweepcode.js
import {
  qrcoder
} from '../../api/order.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '扫兑换码',
      // 'color': true,
      // 'class': '0'
    },
    code: '',
    num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  code(e) {
    console.log(e)
    let code = e.detail.value
    if(code!=''){
      this.setData({
        num: 1
      })
    }else{
      this.setData({
        num:0
      })
    }
    this.setData({
      code
    })
  },
  tj() {
    if(this.data.num==1){
      qrcoder({
        code: this.data.code
      }).then(res => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      });
    }else{
      wx.showToast({
        title: '请填写兑换码',
        icon: 'none',
        duration: 2000
      })
    }
   
  },
  sm() {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log('扫码', res)
        let code = res.result
        qrcoder({
          code
        }).then(res => {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        });
      },
      fail: (res) => {
        console.log('失败', res)
        wx.showToast({
          title: '扫码失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {}
    })
  }
})