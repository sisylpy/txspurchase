// pages/depBills/depBills.js


const globalData = getApp().globalData;
var load = require('../../lib/load.js');

import apiUrl from '../../config.js'
import {
  getDepUsers,
  deleteDepUser,
 
} from '../../lib/apiRestraunt'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOperation: false

  },

  onShow: function () {

   this._initData();
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,  
      url: apiUrl.server, 
     
    })
   
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo: userInfo,
      })
    }
    var depValue = wx.getStorageSync('depInfo');
    if (depValue) {
      this.setData({
        depInfo: depValue,
      })
      this._initData();
    }
    
  },

/**
 * 打开邀请订货员小程序
 */
  toOpenOrder(){
    wx.navigateToMiniProgram({
      appId: 'wx1ea78d3f33234284',
      path: 'pages/inviteAndOrder/inviteAndOrder?disId='+ this.data.depInfo.nxDepartmentDisId 
              +'&depId=' + this.data.depInfo.nxDepartmentId + '&subAmount=' + this.data.depInfo.nxDepartmentSubAmount +'&depName=' + this.data.depInfo.nxDepartmentName,
     
      envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  },

  /**
   * 邀请采购员
   * @param {*} options 
   */
  onShareAppMessage: function (options) {
    return {
      title: "注册采购员", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/invitePurchaser/invitePurchaser?depId=' + this.data.depInfo.nxDepartmentId + '&disId=' + this.data.depInfo.nxDepartmentDisId, 
      imageUrl: '', 
      }
    },

 // 初始化数据
  _initData(){

    getDepUsers(this.data.depInfo.nxDepartmentId).then(res =>{
      if(res.result.data){
        this.setData({
          userArr: res.result.data,
        })

        var that = this;
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#mjltest').boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          console.log(res);
          //取高度
          console.log(res[0].height);
          that.setData({
            maskHeight: res[0].height * globalData.rpxR
          })
        })
      }else{
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      }
    })
  },


  /**
   * 显示蒙版
   * @param {*} e 
   */
  openOperation(e) {
    this.setData({
      showOperation: true,
      selectUserId: e.currentTarget.dataset.id,
     
    })
  },


  /**
   * 关闭蒙版
   */
  hideMask() {
    this.setData({
      showOperation: false,
    })
  },

  /**
   * 删除用户
   * @param {*} e 
   */
  delUser(e){
    deleteDepUser(this.data.selectUserId).then(res =>{
      if(res.result.code !==  -1){
        this._initData();
      }else{
        wx.showToast({
          title: res.result.msg,
        })
      }
    })


  },



  editGroup(e){

    wx.navigateTo({
      url: '../depGroupEdit/depGroupEdit',
    })

  },

  
})