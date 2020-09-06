const app = getApp()
const globalData = app.globalData;
import {
  restrauntRegist,
} from '../../lib/apiRestraunt'
var load = require('../../lib/load.js');


Page({
  data: {
    inputed: false,
    nxDepartmentEntities: [],
    nxDepartmentHasSubs: 0,

  },

  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: options.disId,
      type: options.type,

    })


  },



  //群名称输入
  bindKeyInput: function (e) {
    if (e.detail.value)
      this.setData({
        inputValue: e.detail.value,
        inputed: true,
      })
  },


  getUserInfo(e) {
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            var value = wx.getStorageSync('deps');
            if(value){
              this.setData({
                nxDepartmentEntities: value,
                nxDepartmentHasSubs: 1,
              })
            }
           var  dep = {
              nxDepartmentFatherId: 0,
              nxDepartmentName: this.data.inputValue,
              nxDepartmentType: this.data.type,
              nxDepartmentSubAmount: this.data.nxDepartmentEntities.length,
              nxDepartmentDisId: this.data.disId,
              nxDepartmentShowWeeks: 1,
              nxDepartmentIsGroupDep: 1,
              nxDepartmentEntities: this.data.nxDepartmentEntities,
              nxDepartmentUserEntity: {
                nxDuWxNickName: e.detail.userInfo.nickName,
                nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
                nxDuCode: res.code,
                nxDuAdmin: 1,
                nxDuDistributerId: this.data.disId,
              },
              nxDepartmentFilePath: e.detail.userInfo.avatarUrl,
            }

            load.showLoading("注册订货群和用户")
            restrauntRegist(dep).then(res => {
              if (res.result.code == 0) {
                console.log(res)
                load.hideLoading();
                wx.removeStorageSync('deps');
                wx.setStorageSync('userInfo', res.result.data.userInfo);
                wx.setStorageSync('depInfo', res.result.data.depInfo);
                wx.reLaunch({
                  url: '../index/index?userId=' + res.result.data,
                })
              }else{

                wx.showToast({
                  title: '注册失败',
                  icon: 'none',
                })
              }
             
            })
          },
          fail: (res => {
            wx.showToast({
              title: '请重新操作',
            })
           
          })
        })

      },
      fail: res => {
        wx.showToast({
          title: '请检查网络',
          icon: 'none',
          duration: 2000
        })
        // 获取失败的去引导用户授权 
      }
    })
  },



})