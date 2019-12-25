// pages/Upload/Upload.js
const app = getApp();
import {
  bindingupdata
} from '../../api/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '成为推广员',
      'class': '3',
      "isshare":0,
      'color':'white',
    },
    realname: '',
    mobile: '',
    openbank: '',
    bankcard: '',
    box:false
  },
  onLoad(){
    let that = this
    wx.getStorage({
      key: 'ld',
      success: function (res) {
        console.log(res.data)
        that.setData({
          pd:res.data
        })
      }
    })
  },
  bindname(e) {
    let realname = e.detail.value
    this.setData({
      realname
    })
  },
  bindmobile(e) {
    let mobile = e.detail.value
    this.setData({
      mobile
    })
  },
  bindopnebank(e) {
    let openbank = e.detail.value
    this.setData({
      openbank
    })
  },
  bindbankcard(e) {
    let bankcard = e.detail.value
    this.setData({
      bankcard
    })
  },
  tj() {
    let openbank = this.data.openbank
    let bankcard = this.data.bankcard
    let mobile = this.data.mobile
    let realname = this.data.realname
    if (realname == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
    } else if (mobile.length < 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
    }
    //  else if (openbank == '') {
    //   wx.showToast({
    //     title: '请输入开户行',
    //     icon: 'none'
    //   })
    // } else if (bankcard < 16) {
    //   wx.showToast({
    //     title: '请输入正确的银行卡号',
    //     icon:'none'
    //   })
    // }
     else {
      bindingupdata({
        // openbank,
        // bankcard,
        mobile,
        realname
      }).then(res => {
        console.log(res)
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
          mask: true
        })
        setTimeout(function () {
         let url = '/pages/user/user'
          wx.switchTab({
            url: url
          })
        }, 2000)
       
      });
      wx.setStorage({
        key: "ld",
        data: "0"
      })
    }
  },
  qd(){
    console.log(123)
    wx.navigateBack({
      delta:1
    })
  }
})