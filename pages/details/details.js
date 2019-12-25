// pages/details/details.js
var wxbarcode = require('../../utils/index.js');
import {
  detail
} from '../../api/order.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'isshare': '0',
      'title': '兑换详情',
      'color': false,
      'class': '0'
    },
  },

  onLoad: function (options) {
    console.log(options)
    let that = this
    let order_id = options.order_id
 
    detail(order_id).then(res => {
      console.log('兑换券详情', res.data)
      that.setData({
        list: res.data,
        code:res.data.code
      })
      wxbarcode.barcode('barcode', res.data.code, 430, 120);
      wxbarcode.qrcode('qrcode', res.data.code, 300, 300);
    })

    let ctx = wx.createCanvasContext("barcode", this);//根据wxml定义的canvas-id来创建绘图context对象。
    let ctx2 = wx.createCanvasContext("qrcode", this);//根据wxml定义的canvas-id来创建绘图context对象。
    ctx.draw(false, () => {
      // 延迟保存图片，解决生成图片错位bug。
      setTimeout(() => {
        this.canvasToTempImage();
      }, 400);
    });
    ctx2.draw(false, () => {
      // 延迟保存图片，解决生成图片错位bug。
      setTimeout(() => {
        this.canvasToTempImage2();
      }, 400);
    });
  },
  canvasToTempImage: function () {
    wx.canvasToTempFilePath({
      canvasId: "barcode",
      success: (res) => {
        let tempFilePath = res.tempFilePath;
        this.setData({
          imagePath: tempFilePath,
        });
      }
    }, this);
  },
  canvasToTempImage2: function () {
    wx.canvasToTempFilePath({
      canvasId: "qrcode",
      success: (res) => {
        let tempFilePath = res.tempFilePath;
        this.setData({
          imagePath2: tempFilePath,
        });
      }
    }, this);
  },
})