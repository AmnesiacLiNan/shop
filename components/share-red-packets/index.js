var app = getApp();
Component({
  properties: {
    sharePacket:{
      type:Object,
      value:{
        promoter:0
      }
    }
  },
  data: {
    isState: true,
  },
  attached: function () {
  },
  methods: {
    closeShare:function(){
      this.setData({
        isState: false
      })
    },
    goShare:function(){
      if(this.data.sharePacket.promoter==0){
        wx.showToast({
          title: '你还不是推广员',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        setTimeout(function () {
          wx.navigateTo({
            url:'/pages/Upload/Upload'
          })
        }, 2000)
      }else{
      this.triggerEvent('listenerActionSheet');
      }
    },
  }
})