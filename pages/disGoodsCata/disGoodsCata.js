//批发商商品类别页面

const globalData = getApp().globalData;
import apiUrl from '../../config.js'
var load = require('../../lib/load.js');

import {
  getDisGoodsCata
} from '../../lib/apiRestraunt'

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,  
    })

     var value = wx.getStorageSync('depInfo');
     if(value){
       //根据value获取初始化页面参数
      this.setData({
        depInfo: value,
        face : value.nxDistributerEntity.nxDistributerUserEntities[0].nxDiuWxAvartraUrl,
        name: value.nxDistributerEntity.nxDistributerName,
        phone: value.nxDistributerEntity.nxDistributerPhone,
        manager: value.nxDistributerEntity.nxDistributerManager,
        address: value.nxDistributerEntity.nxDistributerAddress,
        disId: value.nxDistributerEntity.nxDistributerId,
        disImg: value.nxDistributerEntity.nxDistributerImg
      }) 

      this._getInitData(); //获取初始化数据

     }

  },

//获取初始化数据接口
  _getInitData(){
    load.showLoading("获取配送商品大类")
    getDisGoodsCata(this.data.disId).then(res =>{
      if(res.result.data){
        load.hideLoading();
        this.setData({
          goodsList: res.result.data,
        })
      }else{
        wx.showToast({
          title: '获取商品失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 打开商品页面
   * @param {*} e 
   */
  toGoodsList(e){
    wx.navigateTo({
      url: '../disGoodsList/disGoodsList?fatherId=' + e.currentTarget.dataset.id 
      +'&fatherName=' + e.currentTarget.dataset.name ,
    })
  },

// 打开折叠大类
  showOrHide(e){
    var greatIndex = e.currentTarget.dataset.greatindex;
    var grandIndex = e.currentTarget.dataset.grandindex;
    //一级大类
    for( var i = 0; i < this.data.goodsList.length; i ++){
     //二级大类
      for(var j = 0; j < this.data.goodsList[i].fatherGoodsEntities.length; j++){
        var itemShow = "goodsList["+ i+"].fatherGoodsEntities["+ j+"].isShow";
         if (i != greatIndex || j != grandIndex) {
          this.setData({
            [itemShow]: false
          })         
         }    
      }  
    }
 
    var show = this.data.goodsList[greatIndex].fatherGoodsEntities[grandIndex].isShow;
    var itemShow = "goodsList["+ greatIndex+"].fatherGoodsEntities["+ grandIndex+"].isShow";
    this.setData({
      [itemShow]: !show
    })
  },

})