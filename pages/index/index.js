//首页

const globalData = getApp().globalData;
var load = require('../../lib/load.js');

import apiUrl from '../../config.js'
import {
  purchaserCopyOrderContent,
  purchaserFinishOrderContent,
  purchaserGetDisOrders,
  purchaserGetIndependentOrders
} from '../../lib/apiRestraunt'

let windowWidth = 0;
let itemWidth = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab1Index: 0,
    itemIndex: 0,
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs: ["配送订单", "自采购订单"],
    selAmount: 0,
    showOperation: false,
    selAmount: 0,
    depId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {

    //实时更新-用户数据
    var value = wx.getStorageSync('userInfo');
    if (value) {
      this.setData({
        userInfo: value,
      })
    } else {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    //实时更新-部门数据
    var depValue = wx.getStorageSync('depInfo');
    if (depValue) {
      this.setData({
        depInfo: depValue,
      })
      wx.setNavigationBarTitle({
        "title": depValue.nxDepartmentName + ".订货群",
      })
    }


    if (this.data.depId !== null) {
      if (this.data.itemIndex == 0) {
        this._getDisOrders(); //获取配送订单
      }
      if (this.data.itemIndex == 1) {
        this._getIndependentOrders(); //获取自采购订单
      }
    }

  },


  onLoad: function (options) {

    //初始化数据
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
    })

    //获取当天时间
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    var date = now.getDate();
    this.setData({
      week: week,
      date: date,
    })


    //注册成功后保存的信息-部门信息
    var value = wx.getStorageSync('userInfo');

    if (value) {
      this.setData({
        userInfo: value,
      })
    } else {
      wx.reLaunch({
        url: '../../pages/login/login'
      })
    }
    //注册成功后保存的信息-用户信息
    var depValue = wx.getStorageSync('depInfo');
    if (depValue) {
      this.setData({
        depInfo: depValue,
        depId: depValue.nxDepartmentId
      })
    }



    this.clueOffset(); // 页面swiper滑动效果

    this._getDisOrders(); //获取初始化订单

  },


  _getDisOrders() {
    var data = {
      depId: this.data.depInfo.nxDepartmentId, // 群部门id
      disId: this.data.depInfo.nxDepartmentDisId, //批发商id
    }

    load.showLoading("获取配送申请")
    purchaserGetDisOrders(data).then(res => {
      if (res.result.code == 0) {
        load.hideLoading();
        if (res.result.data.arr.length > 0) {
          this.setData({
            disArr: res.result.data.arr, //批发商数组
            swiperHeight: (res.result.data.totalRemark * 100) + (res.result.data.totalCount * 180) + (res.result.data.arr.length * 200)
            // 计算swiper-item的高度，totalRemark 是含有备注条数；totalCount 是申请的条数；
            //arr 是头部日期和完成数量的高度； 总和是这3部分相加。 
          })
        } else {
          this.setData({
            disArr: [],
          })
        }
      } else {
        load.hideLoading();
        wx.showToast({
          title: '获取订单失败',
          icon: 'none',
        })
        this.setData({
          disArr: [],
          swiperHeight: 200,
        })

      }
    })

  },


  _getIndependentOrders() {
    load.showLoading("获取自采购订单")
    purchaserGetIndependentOrders(this.data.depInfo.nxDepartmentId).then(res => {
      if (res.result.code == 0) {
        load.hideLoading();
        if (res.result.data.arr.length > 0) {
          this.setData({
            independentArr: res.result.data.arr,
            swiperHeight: res.result.data.totalCount * 150 + (res.result.data.arr.length * 200),
            // totalCount是自采购申请的条数；arr是日期和条数的高度。
            selAmount: 0, //选择的自采购申请的条数
          })
        } else {
          this.setData({
            independentArr: [],
            selAmount: 0,
          })
        }
      } else {
        wx.showToast({
          title: '获取订单失败',
          icon: 'none',
        })
        this.setData({
          independentArr: [],
          selAmount: 0,
        })
      }
    })

  },



  /**
   * 打开商品页面
   */
  toDistributerGoods() {
    wx.navigateTo({
      url: '../disGoodsCata/disGoodsCata?disId=' + this.data.depInfo.nxDepartmentDisId,
    })
    this.setData({
      showOperation: false,
    })
  },

  /**
   * 打开订货小程序
   */
  toOpenOrder() {
    this.setData({
      showOperation: false,
    })

    wx.navigateToMiniProgram({
      appId: 'wx1ea78d3f33234284',
      path: 'pages/index/index?userId=' + this.data.userInfo.nxDepartmentUserId,
      envVersion: 'develop',
      success(res) {
        // 打开成功
        // console.log(res)
      }
    })
  },

  /**
   * 打开订货群页面
   */
  toDepGroup(e) {
    wx.navigateTo({
      url: '../depGroup/depGroup',
    })
  },


  /**
   * 选择自采购申请
   * @param {}} e 
   */
  selectIndepend(e) {
    var index = e.currentTarget.dataset.index;
    var dateIndex = e.currentTarget.dataset.dateindex;
    var indepen = this.data.independentArr[dateIndex].arr[index];
    var ind = "independentArr[" + dateIndex + "].arr[" + index + "].isSelected";
    var sel = indepen.isSelected;
    var amount = this.data.selAmount;
    this.setData({
      [ind]: !sel,
    })
    if (sel) {
      this.setData({
        selAmount: amount - 1
      })
    } else {
      this.setData({
        selAmount: amount + 1
      })
    }

    if (this.data.selAmount > 0) {
      this.setData({
        showOperation: true,
      })
    } else {
      this.setData({
        showOperation: false,
      })
    }



  },


  /**
   * 复制申请
   */
  copyText() {


    var copyArr = this._getSelectedArr(); // 获取选中申请数组

    if (copyArr.length > 0) {

      // 提取申请内容为拼接字符串
      var temp = "";
      for (var i = 0; i < copyArr.length; i++) {
        if (copyArr[i].isSelected) {
          var name = copyArr[i].nxDepIndependentGoodsEntity.nxDigGoodsName;
          var quantity = copyArr[i].nxDoQuantity;
          var str = name + "  " + quantity + '\n';
          temp = temp + str;
        }
      }
      // 复制订单内容
      var that = this;
      wx.setClipboardData({
        data: temp,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              //提交复制成功的申请
              purchaserCopyOrderContent(copyArr).then(res => {
                console.log(res)
                if (res.result.code == 0) {
                  that._getIndependentOrders(); //更新数据
                }
              })
            }
          })
        },
      })
    }

  },

  /**
   * 采购完成自采购订单
   */
  finishIndependent() {

    // 获取选中自采购申请
    var finishArr = this._getSelectedArr();

    //提交选中申请
    if (finishArr.length > 0) {
      purchaserFinishOrderContent(finishArr).then(res => {
        if (res.result.code == 0) {
          this._getIndependentOrders(); //更新数据
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })

        }
      })
    }

  },

  // 获取选中申请
  _getSelectedArr() {
    var dateArr = this.data.independentArr;
    var orderTemp = [];
    for (var i = 0; i < dateArr.length; i++) {
      for (var j = 0; j < dateArr[i].arr.length; j++) {
        if (dateArr[i].arr[j].isSelected) {
          orderTemp.push(dateArr[i].arr[j]);
        }
      }
    }
    return orderTemp;
  },




  /**
   * 计算偏移量
   */
  clueOffset() {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        itemWidth = Math.ceil(res.windowWidth / that.data.tabs.length);
        let tempArr = [];
        for (let i in that.data.tabs) {
          console.log(i)
          tempArr.push(itemWidth * i);
        }
        // tab 样式初始化
        windowWidth = res.windowWidth;
        that.setData({
          sliderOffsets: tempArr,
          sliderOffset: 0,
          sliderLeft: 0,
          windowWidth: globalData.windowWidth * globalData.rpxR,
          windowHeight: globalData.windowHeight * globalData.rpxR,
        });
      }
    });
  },

  /**
   * tabItme点击
   */
  onTab1Click(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      sliderOffset: this.data.sliderOffsets[index],
      tab1Index: index,
      itemIndex: index,

    })
  },

  /**
   * swiper-item 的位置发生改变
   */
  swiperTran(event) {
    let dx = event.detail.dx;
    let index = event.currentTarget.dataset.index;
    if (dx > 0) { //----->
      if (index < this.data.tabs.length - 1) { //最后一页不能---->
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        // console.log(newOffset,",index:",index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    } else { //<-----------
      if (index > 0) { //最后一页不能<----
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        console.log(newOffset, ",index:", index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    }

  },

  /**
   * current 改变时会触发 change 事件
   */
  swiperChange(event) {
    // this.setData({
    //   sliderOffset: this.data.sliderOffsets[event.detail.current],
    //   tab1Index: event.detail.current,
    //   itemIndex: event.detail.current,
    // })
  },

  /**
   * 动画结束时会触发 animationfinish 事件
   */
  animationfinish(event) {
    this.setData({
      sliderOffset: this.data.sliderOffsets[event.detail.current],
      tab1Index: event.detail.current,
      itemIndex: event.detail.current,
    })
    if (this.data.tab1Index == 0) {
      this._getDisOrders();
      this.setData({
        selAmount: 0,
        selArr: []
      })
    }
    if (this.data.tab1Index == 1) {
      this._getIndependentOrders();
      this.setData({
        selAmount: 0,
        selArr: []
      })
    }
  },

  /**
   * 打开修改用户页面
   */
  openUserEdit() {
    wx.navigateTo({
      url: '../depUserEdit/depUserEdit',
    })
  },




})