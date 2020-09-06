const app = getApp()
const globalData = app.globalData;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected:false,
    items: [
      { name: '1', value: '餐馆'},
      { name: '2', value: '单位、学校、幼儿园食堂',},
      { name: '3', value: '生鲜超市' },
      { name: '4', value: '美食城' },
      { name: '5', value: '其它' },
    ]
  },

  radioChange: function (e) {
    this.setData({
      type:e.detail.value,
      selected:true
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log(options)
  //  var url = decodeURIComponent(options.q);

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: options.disId,
      disId:1 

    })

  },


  toNext(){
    wx.navigateTo({
      url: '../stepTwo/stepTwo?disId=' + this.data.disId + '&type=' + this.data.type,
    })
  },




  








  
})