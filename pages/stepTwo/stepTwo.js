const app = getApp()
const globalData = app.globalData;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNumber: false,
    selNumber: "",
    addFinished: false,
    value: 0,
    hasSubs: 0,
    focusIndex:0,
  
  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: options.disId,
      type: options.type,
    })

  },

   /**
    * 显示几个部门
    * @param {}} e 
    */
  showNumber(e){
    this.setData({
      showNumber: true
    })
  },

  /**
   * 选择几个部门
   * @param {*} e 
   */
  selIndex(e){
    var num = Number(e.currentTarget.dataset.index) + 1;
    var deps = [];
    for(var i = 0; i < num; i++) {
         var dep = {
          nxDepartmentFatherId: this.data.depId,
           nxDepartmentName: null,
           nxDepartmentType: this.data.type,
           nxDepartmentHasSubs: 0,
           nxDepartmentShowWeeks: 1,
           nxDepartmentSubAmount: 0,
           nxDepartmentIsGroupDep: 0,
          };
          deps.push(dep);
    }
    
    this.setData({
      selNumber: num,
      showNumber: false,
      departments: deps
    })

  },
  /**
   * 给部门名称赋值
   * @param {*} e 
   */
  getDepartmentName(e){
    var name = e.detail.value;
    var index = e.currentTarget.dataset.index;
    var depNameData = "departments["+index+"].nxDepartmentName"
    this.setData({
      [depNameData]: name,
    })  
    this._ifCanSave();
  },

  /**
   * 检查可下一步状态
   */
   _ifCanSave(){
     var num  = this.data.departments.length;
     for (var i = 0; i < num; i++) {
       var name =  this.data.departments[i].nxDepartmentName;
       if(name == null || name.length == 0){
         this.setData({
          addFinished: false
         })
          return;
       }else{
         this.setData({
           addFinished: true,
         })
       }
     }
   },

/**
 * 下一页
 */
   toGroupName() {
     wx.setStorageSync('deps', this.data.departments);   
    wx.navigateTo({
      url: '../stepThree/stepThree?disId=' + this.data.disId + '&type=' + this.data.type,
    })
   },

   /**
    * 选择是否有部门
    * @param {*} e 
    */
   radioChange: function (e) {
    console.log(e);
    this.setData({
      hasSubs: e.detail.value,
      selNumber: "",
      focusIndex: 0,

    })  

  },

  /**
   * 关闭部门数量
   */
  hideNumber(){
    if(this.data.showNumber){
      this.setData({
        showNumber: false
      })
    }
  },

  /**
   * 焦点到下一个部门名称输入框
   * @param {*} e 
   */
  clickConfirm(e){
    console.log(e);
      this.setData({
        focusIndex: e.currentTarget.dataset.index + 1,
      })
  }


  








  
})