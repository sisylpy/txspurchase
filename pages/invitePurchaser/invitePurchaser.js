// pages/restaurant/restaurant.js


const globalData = getApp().globalData;
var load = require('../../lib/load.js');

import {
  depPurchaseUserSave,
  groupInfo,
  purchaserUserLogin
} from '../../lib/apiRestraunt'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({

      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      depId: options.depId,
      disId: options.disId,

    })



  },

  //用户授权中链接socket
  getUserInfo: function (e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {

        wx.login({
          success: (res) => {

            // 注册接口
            if (e.currentTarget.dataset.type == 0) {
              var nxDepartmentUser = {
                nxDuWxNickName: e.detail.userInfo.nickName,
                nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
                nxDuCode: res.code,
                nxDuAdmin: 1,
                nxDuDepartmentId: this.data.depId,
                nxDuDistributerId: this.data.disId,
                nxDuDepartmentFatherId: this.data.depId,
              }
              load.showLoading("采购员注册中...")
              depPurchaseUserSave(nxDepartmentUser)
                .then((res => {
                  load.hideLoading();
                  if (res.result.code !== -1) {
                    wx.setStorageSync("userInfo", res.result.data.userInfo);
                    wx.setStorageSync('depInfo', res.result.data.depInfo)
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  } else {
                    load.hideLoading();
                    wx.showToast({
                      title: res.result.msg,
                    })
                    this.setData({
                      resCode: -1
                    })
                  }
                }))
            } else {
            //登陆接口
              purchaserUserLogin(res.code)
                .then((res) => {
                  wx.hideLoading()              
                  if (res.result.code !== -1) {
                    wx.setStorageSync("userInfo", res.result.data.userInfo);
                    wx.setStorageSync('depInfo', res.result.data.depInfo)

                    wx.redirectTo({
                      url: '../index/index',
                    })
                  } else {
                    load.hideLoading();
                    wx.showToast({
                      title: res.result.msg,
                    })
                  }
                })
            }
          },
          fail: (res => {
            wx.showToast({
              title: '请重新操作',
              icon: 'none'
            })
          })
        })
      },
      fail: res => {
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        })     
       }
    })
  },



  _getGroupInfo(userId) {

    groupInfo(userId).then(res => {
      if (res.result.code == 0) {
  
       
        wx.setStorageSync('userInfo', res.result.data.userInfo); //缓存用户信息
        wx.setStorageSync('groupInfo', res.result.data.groupInfo); //缓存部门信息

        //跳转到首页
        wx.redirectTo({
          url: '../../pages/index/index',
        })
      }else{
        //失败
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },








})