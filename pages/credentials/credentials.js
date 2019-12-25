// pages/updata/updata.js
const app = getApp();
import {
  voucher
} from '../../api/order.js';
import {
  getIndexData
} from '../../api/api.js';

Page({

  data: {
    images: [],
    images2: [],
    video: [],
    parameter: {
      'navbar': '1',
      'return': '1',
      'isshare': '0',
      'title': '对公上传凭证',
      'color': true,
      'class': '3'
    },
    remark: '', //备注
    num: "0", //类别
    order_id: '', //订单号
    bank: '', //银行
    address: '', //地址
    tax_code: '', //税号
    name: '', //单位名称
  },
  onLoad: function(options) {
    var that = this;
    let order_id = options.order_id
    this.setData({
      order_id,
    })
    getIndexData().then(res => {
      console.log(res)
      that.setData({
        gz: res.data.corporate_account,
        gz_yh: res.data.corporate_account_bank,
        gz_name: res.data.company_name
      });
    })
  },
  img1() {
    this.image()
  },
  fd(e) {
    console.log(e)
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  gb(e) {
    console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    let images = that.data.images
    images.splice(index, 1)
    that.setData({
      images
    })
  },
  image() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilesSize = res.tempFiles[0].size; //获取图片的大小，单位B
        if (tempFilesSize <= 1000000) { //图片小于或者等于1M时 可以执行获取图片
          console.log(res.tempFilePaths)
          let src = res.tempFilePaths.join(',')
          wx.uploadFile({
            url: getApp().globalData.url + '/api/upload/image', //服务器接口
            method: 'POST',
            filePath: src,
            name: 'file',
            header: {
              'content-type': 'multipart/form-data',
              "Authori-zation": 'Bearer ' + getApp().globalData.token
            },
            formData: {
              'filename': 'file',
              'pathName': 'ad'
            },
            success: function(res) {
              var data = JSON.parse(res.data)
              console.log(data.data.url)
              console.log('图片上传成功')
              const images = that.data.images.concat(data.data.url)
              that.setData({
                images: images.length <= 8 ? images : images.slice(0, 9)
              })
            },
            fail: function() {
              console.log('接口调用失败')
            }
          })
        } else { //图片大于1M，弹出一个提示框
          wx.showToast({
            title: '上传图片不能大于1M!', //标题
            icon: 'none' //图标 none不使用图标，详情看官方文档
          })
        }
      }
    })
    console.log(that.data.images)
  },
  //获取字幕 备注
  bindremark(e) {
    let remark = e.detail.value
    this.setData({
      remark
    })
  },
  bindbank(e) {
    let bank = e.detail.value
    this.setData({
      bank
    })
  },
  bindress(e) {
    console.log(e)
    let address = e.detail.value
    this.setData({
      address
    })
  },
  bindtax_code(e) {
    let tax_code = e.detail.value
    this.setData({
      tax_code
    })
  },
  bindname(e) {
    let name = e.detail.value
    this.setData({
      name
    })
  },
  tj() {
    let that = this
    let image = that.data.images
    let type = that.data.num
    let remark = that.data.remark
    let address = that.data.address
    let bank = that.data.bank
    let tax_code = that.data.tax_code
    let name = that.data.name
    let order_id = that.data.order_id
    wx.showModal({
      content: '确认上传凭证',
      confirmColor:'#FF5445',
      success(res) {
        if (res.confirm) {
          if (that.data.num == 0) {
            voucher({
              image,
              type,
              remark,
              address,
              bank,
              tax_code,
              name,
              order_id
            }).then(res => {
              wx.showToast({
                title: '提交成功',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              setTimeout(function () {
                let url = '/pages/order_list/index'
                wx.navigateTo({
                  url: url
                })
              }, 1000)
            });
          } else if (that.data.num == 1) {
            if (name == '') {
              wx.showToast({
                title: '请填写单位名称',
                icon: 'none',
                duration: 1000
              })
            } else if (tax_code == '') {
              wx.showToast({
                title: '请填写纳税人识别号',
                icon: 'none',
                duration: 1000
              })
            } else {
              voucher({
                image,
                type,
                remark,
                address,
                bank,
                tax_code,
                name,
                order_id
              }).then(res => {
                wx.showToast({
                  title: '提交成功',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
                setTimeout(function () {
                  let url = '/pages/order_list/index'
                  wx.navigateTo({
                    url: url
                  })
                }, 1000)
              });
            }
          } else if (that.data.num == 2) {
            if (name == '') {
              wx.showToast({
                title: '请填写单位名称',
                icon: 'none',
                duration: 1000
              })
            } else if (tax_code == '') {
              wx.showToast({
                title: '请填写纳税人识别号',
                icon: 'none',
                duration: 1000
              })
            } else if (address == '') {
              wx.showToast({
                title: '请填写详细地址',
                icon: 'none',
                duration: 1000
              })
            } else if (bank == '') {
              wx.showToast({
                title: '请填写开户银行名称',
                icon: 'none',
                duration: 1000
              })
            } else {
              voucher({
                image,
                type,
                remark,
                address,
                bank,
                tax_code,
                name,
                order_id
              }).then(res => {
                wx.showToast({
                  title: '提交成功',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
                setTimeout(function () {
                  let url = '/pages/order_list/index'
                  wx.navigateTo({
                    url: url
                  })
                }, 1000)
              });
            }
          }
        } else if (res.cancel) {
        }
      }
    })
   

  },
  xz_num(e) {
    console.log(e)
    let that = this
    let num = e.currentTarget.dataset.num
    that.setData({
      num
    })
    if (num == 0) {
      that.setData({
        remark: '', //备注
        bank: '', //银行
        address: '', //地址
        tax_code: '', //税号
        name: '', //单位名称
      })
    } else if (num == 1) {
      that.setData({
        remark: '', //备注
        bank: '', //银行
        address: '', //地址
        tax_code: '', //税号
        name: '', //单位名称
      })
    } else if (num == 2) {
      that.setData({
        remark: '', //备注
        bank: '', //银行
        address: '', //地址
        tax_code: '', //税号
        name: '', //单位名称
      })
    }
  }
})