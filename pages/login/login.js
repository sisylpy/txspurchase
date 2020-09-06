
const globalData = getApp().globalData;
var load = require('../../lib/load.js');

import {
  purchaserUserLogin, 
} from '../../lib/apiRestraunt'

Page({

  data: {
    canLogin: false,
    accept: false


  },

  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })

  },






  //微信授权点击“允许”
  getUserInfo: function (e) {

    wx.getUserInfo({
      success: res => {
        load.showLoading("用户登录中")
        wx.login({
          success: (res) => {
          purchaserUserLogin(res.code)
              .then((res) => {
                wx.hideLoading()
                if (res.result.code !== -1) {
                  //缓存用户信息
                  wx.setStorageSync("userInfo", res.result.data.userInfo);
                  //缓存部门信息
                  wx.setStorageSync('depInfo', res.result.data.depInfo)
                  //跳转到首页
                  wx.redirectTo({
                    url: '../index/index',
                  })

                } else {
                  load.hideLoading();
                  // 登陆失败
                  wx.showToast({
                    title: res.result.msg,
                    icon: 'none'
                  })
                }
              })
          },
          fail: (res => {
            load.hideLoading();
            //微信用户登陆失败
            wx.showToast({
              title: res,
              icon: 'none'
            })
          })
        })
      },
      fail: res => {
        // 微信获取信息失败 
        wx.showToast({
          title: '请检查网络',
          icon: 'none',
          duration: 2000
        })

      }
    })

  
  },








})