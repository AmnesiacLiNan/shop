// pages/coupon-list/index.js
import { getCouponReceive, getCoupon } from '../../api/user.js';

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'isshare': '0',
      'title': '领取优惠券',
      'color': false
    },
    couponsList:[],
    loading:false,
    loadend:false,
    page:1,
    limit:20,
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUseCoupons();
  },
  getCoupon:function(e){
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = that.data.couponsList;
    //领取优惠券
    getCouponReceive({ couponId: id }).then(function (res) {
      list[index].is_use = true;
      that.setData({
        couponsList: list
      });
      app.Tips({ title: '领取成功' });
    },function(res){
      return app.Tips({title:res.msg});
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 获取领取优惠券列表
  */
  getUseCoupons:function(){
    var that=this
    if(this.data.loadend) return false;
    if(this.data.loading) return false;
    getCoupon({ page: this.data.page, limit: this.data.limit }).then(res=>{
      console.log(res)
      var list=res.data,loadend=list.length < that.data.limit;
      var couponsList = app.SplitArray(list, that.data.couponsList);
      that.setData({ 
        loading: true, 
        couponsList: couponsList,
        page:that.data.page+1,
        loadend: loadend
      });
    }).catch(err=>{
      that.setData({ loading: false });
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getUseCoupons();
  },


})