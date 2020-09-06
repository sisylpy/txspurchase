// pagesRes/disGoodsCata/disGoodsCata.js



const globalData = getApp().globalData;
var load = require('../../lib/load.js');
import {
  depGetDisGoods,
  saveDepDisGoods
} from '../../lib/apiRestraunt'

Page({
  
  /**
   * 页面的初始数据
   */
   data: {
    totalPage: 0, //分页
    totalCount: 0,
    limit: 10,
    currentPage: 1,
    isLoading: false,
    depStandardArr: [] //部门规格数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,  
      goodsFatherId: options.fatherId, 
      goodsFatherName: options.fatherName,
      
    })
   
    var depValue = wx.getStorageSync('depInfo');
    if (depValue) {
      this.setData({
        depInfo: depValue,
      })

      this._getInitData(); //获取初始化数据

      wx.setNavigationBarTitle({
        "title": this.data.depInfo.nxDistributerEntity.nxDistributerName,
      })
    }
  },




  _getInitData(){
    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      fatherId: this.data.goodsFatherId,
      disId: this.data.depInfo.nxDepartmentDisId,
      depFatherId: this.data.depInfo.nxDepartmentId,
    }

    depGetDisGoods(data).then(res =>{
      if(res.result.page){
        this.setData({
          goodsList: res.result.page.list,
          totalPage: res.result.page.totalPage,
          totalCount: res.result.page.totalCount,
        })
      }else{
        wx.showToast({
          title: '获取商品失败',
          icon: 'none'
        })
      }
    })
  },

  // 页面底部刷新数据
  onReachBottom: function () {
    console.log("000000")
    let { currentPage, totalPage } = this.data
    if (currentPage >= totalPage ) {
      return
    }
   
    var data = {
      limit: this.data.limit,
      page: this.data.currentPage + 1,
      fatherId: this.data.goodsFatherId,
      disId: this.data.depInfo.nxDepartmentDisId,
      depFatherId: this.data.depInfo.nxDepartmentId,
    }
    depGetDisGoods(data)
      .then(res => {
        wx.hideLoading()
        if (res.result.page) {
          var arr = res.result.page.list;
          if(arr.length > 0){
            var list = this.data.goodsList;
            var newdata = list.concat(arr);
            var currentPage = this.data.currentPage; // 获取当前页码
            currentPage = currentPage +1;
            this.setData({
              goodsList: newdata,
              currentPage,
              totalPage: res.result.page.totalPage,
              totalCount: res.result.page.totalCount,
            })
          }
        }else{
          wx.showToast({
            title: '获取商品失败',
            icon: 'none'
          })
        }
      })
  },

 
  //下载批发商的订货商品
  toAddDepNxGoods(e){
    var goods = this.data.goodsList[e.currentTarget.dataset.index];
    var standards = this.data.goodsList[e.currentTarget.dataset.index].distributerStandardEntities;
   // 订货规格查出来，给群商品的规格赋值
    if(standards.length > 0){
      var temp = [];
      for(var i = 0; i < standards.length; i++){
        var standard = standards[i];
        var depStandard = {
          nxDdsDdsGoodsId: goods.nxDistributerGoodsId,
          nxDdsStandardName: standard.nxDsStandardName
        }
        temp.push(depStandard);
      }
       this.setData({
        depStandardArr: temp
       })
    }

    //群商品
    var dng = {
      nxDdgDepartmentFatherId: this.data.depInfo.nxDepartmentId ,
      nxDdgDisGoodsId: goods.nxDistributerGoodsId,
      nxDdgDisGoodsFatherId: goods.nxDgDfgGoodsFatherId,
      nxDdgDepGoodsName: goods.nxDgGoodsName,
      nxDdgDepGoodsPinyin: goods.nxDgGoodsPinyin,
      nxDdgDepGoodsPy: goods.nxDgGoodsPy,
      nxDdgDepGoodsStandardname: goods.nxDgGoodsStandardname,
      nxDdgDepGoodsDetail: goods.nxDgGoodsDetail,
      nxDdgDepGoodsBrand: goods.nxDgGoodsBrand,
      nxDdgDepGoodsPlace: goods.nxDgGoodsPlace,
      nxDepStandardEntities: this.data.depStandardArr, //规格数组
    };
    
    load.showLoading("保存商品中")
    saveDepDisGoods(dng)
    .then(res => {
      load.hideLoading();
      console.log(res.result)
      if (res.result.data > 0) { //返回的是新加商品的id       
        var up = "goodsList[" + e.currentTarget.dataset.index + "].isDownload"
        this.setData({
          [up]: 1,
          depStandardArr: []
        })
      }else{
        wx.showToast({
          title: '保存商品失败',
          icon: 'none'
        })
      }
    })

  },




})