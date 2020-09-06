const globalData = getApp().globalData;
var load = require('../../lib/load.js');
import apiUrl from '../../config.js'


import {
  updateGroupPurchaseWithFile,
  updateGroupPurchase,
  getDepAndUserInfo
} from '../../lib/apiRestraunt'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canSave: false,
    imgChanged: false,
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

    var depInfo = wx.getStorageSync('depInfo');
    if (depInfo) {
      this.setData({
        depInfo: depInfo,
        groupName: depInfo.nxDepartmentName
      })
    }


    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        userName: userInfo.nxDuWxNickName
      })
      if (userInfo.nxDuUrlChange == 1) { //修改用户头像的地址
        this.setData({
          src: apiUrl.server + userInfo.nxDuWxAvartraUrl
        })
      } else { //没有修改过的用户头像地址
        this.setData({
          src: userInfo.nxDuWxAvartraUrl,

        })
      }
    }

  },


  //选择图片
  choiceImg: function (e) {
    var _this = this;

    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        _this.setData({
          src: res.tempFilePaths,
          isSelectImg: true,
          imgChanged: true,
          canSave: true

        })
        // _this._checkSave();
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },


  /**
   * 获取用户名
   * @param {*} e 
   */
  getUserName(e) {
    if (e.detail.value !== this.data.userInfo.nxDuWxNickName) {
      this.setData({
        userName: e.detail.value,
        canSave: true,
      })
    }
  },



  /**
   * 保存修改内容
   */
  save() {

    //修改了图片的接口
    if (this.data.imgChanged) {
      var filePathList = this.data.src;
      var userName = this.data.userName;
      var groupName = this.data.groupName;
      var userId = this.data.userInfo.nxDepartmentUserId;
      var depId = this.data.depInfo.nxDepartmentId;
      load.showLoading("保存修改")
      updateGroupPurchaseWithFile(filePathList, userName, groupName, userId, depId).then(res => {
        console.log(res)
        if (res.result == '{"code":0}') {
          load.hideLoading();
          this._getGroupInfo(userId);
        }else{
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      })
    } else {
      //没有修改图片的接口
      var userName = this.data.userName;
      var groupName = this.data.groupName;
      var userId = this.data.userInfo.nxDepartmentUserId;
      var depId = this.data.depInfo.nxDepartmentId;

      var data = {
        userName: userName,
        groupName: groupName,
        userId: userId,
        depId: depId
      }
      load.showLoading("保存修改")
      updateGroupPurchase(data).then(res => {
        if (res.result.code == 0) {
          load.hideLoading();
          this._getGroupInfo(userId);
        }else{
          wx.showToast({
            title: '保存失败',
          })
        }
      })
    }
  },



  _getGroupInfo(userId) {
    load.showLoading("更新修改内容")
    getDepAndUserInfo(userId).then(res => {
      if (res.result.code == 0) {
        load.hideLoading();
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
        })
      }
    })
  },






})