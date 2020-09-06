
var load = require('../../lib/load.js');
import apiUrl from '../../config.js'


import {
  updateGroupName,
  getDepAndUserInfo
} from '../../lib/apiRestraunt'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    canSave: false,
    imgChanged: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var depValue = wx.getStorageSync('depInfo');
    if (depValue) {
      this.setData({
        depInfo: depValue,
        groupName: depValue.nxDepartmentName
      })
    }

    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
      })
    }

  },

//修改群名称
  getGroupName(e) {
    if(e.detail.value.length > 0){
      this.setData({
        groupName: e.detail.value,
        canSave: true,
      })
    }
   
  },
  

  save() {

      var groupName = this.data.groupName;
      var depId = this.data.depInfo.nxDepartmentId;
      var userId = this.data.userInfo.nxDepartmentUserId;
      var data = {
        nxDepartmentName: groupName,
        nxDepartmentId: depId
      }
      updateGroupName(data).then(res => {
        if (res.result.code == 0) {
          this._getGroupInfo(userId);
        }else{
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      })
  },

  //获取新信息
  _getGroupInfo(userId) {

    getDepAndUserInfo(userId).then(res => {
      if (res.result.code == 0) {    

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          userInfo: res.result.data.userInfo,
          depInfo: res.result.data.depInfo
        })
        wx.navigateBack({
          delta: 1
        })
        wx.setStorageSync('userInfo', res.result.data.userInfo);
        wx.setStorageSync('depInfo', res.result.data.depInfo);
      }else{
        wx.showToast({
          title: '获取信息失败',
          icon: 'none'
        })
      }
    })
  },





})