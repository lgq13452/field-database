// pages/vant/vant.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    show: false,
    cateList: [],
    indexData: null,
    calendar: null,
    historyData: [],
    showLoad: false,
    popupShow: false
  },
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none',
    // });
  },
  //进入分类频道
  routePostList(e) {
    // console.log('xxx', e.currentTarget.dataset.careid)
    // console.log('yyy', e.currentTarget.dataset.tab)

    wx.navigateTo({
      url: '/pages/posts/posts?id=' + e.currentTarget.dataset.careid + "&tab=" + e.currentTarget.dataset.tab,
    })
  },
  navitorToPlay(e) {
    // console.log(e.currentTarget.dataset.post.postid)
    var vid;
    if (e.currentTarget.dataset.post.extra_data) {
      vid = e.currentTarget.dataset.post.extra_data.app_banner_param
    } else {
      vid = e.currentTarget.dataset.post.postid
    }
    wx.navigateTo({
      url: '/pages/play/play?postid=' + vid,
    })
  },
  navigateToSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  overlayShow() {
    this.setData({
      show: true
    });
  },
  overlayHide() {
    this.setData({
      show: false
    });
  },
  popupShow() {
    this.setData({
      popupShow: true
    })
  },
  popupHide() {
    this.setData({
      popupShow: false
    })
  },
  // 获取频道列表
  getCateList() {

    var localList = wx.getStorageSync('cateList')

    if (localList) {
      localList = JSON.parse(localList)
    }
    console.log(localList)
    if (localList.expires > Date.now()) {
      this.setData({
        cateList: localList.data
      })
    } else {
      this.overlayShow();
      wx.request({
        url: "https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/cate/getList",
        success: (response) => {
          // console.log(response.data.data);

          if (response.data.data) {
            wx.setStorage({
              key: "cateList",
              data: JSON.stringify({
                expires: Date.now() + 60 * 60 * 1000 * 3,
                data: response.data.data
              })
            })
            this.setData({
              cateList: response.data.data
            })
          } else {

          }

        },
        fail: () => {

        },
        complete: () => {
          this.overlayHide();
        }
      })
    }

  },
  //获取日历
  getCalendar() {
    var localCalendar = wx.getStorageSync('calendar')
    if (localCalendar) {
      localCalendar = JSON.parse(localCalendar)
    }
    if (localCalendar.expires > Date.now()) {
      this.setData({
        calendar: localCalendar.data
      })
    } else {
      wx.request({
        url: "https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/DayCover/getDayCover",
        success: (response) => {
          // console.log(response.data.data);
          if (response.data.data) {
            wx.setStorage({
              key: "calendar",
              data: JSON.stringify({
                expires: Date.now() + 60 * 60 * 1000 * 3,
                data: response.data.data
              })
            })
            this.setData({
              calendar: response.data.data
            })
          } else {

          }
        },
        fail: () => {},
        complete: () => {
          this.overlayHide();
        }
      })
    }
  },
  //获取首页初始数据
  getIndexData() {
    var localIndexData = wx.getStorageSync('indexData')

    if (localIndexData) {
      localIndexData = JSON.parse(localIndexData)
    }
    // console.log(localIndexData)
    if (localIndexData.expires > Date.now()) {
      this.setData({
        indexData: localIndexData.data
      })
    } else {
      this.overlayShow();
      wx.request({
        url: "https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/index/index",
        success: (response) => {
          // console.log(response.data.data);
          if (response.data.data) {
            wx.setStorage({
              key: "indexData",
              data: JSON.stringify({
                expires: Date.now() + 60 * 60 * 1000 * 3,
                data: response.data.data
              })
            })
            this.setData({
              indexData: response.data.data
            })
          } else {

          }

        },
        fail: () => {

        },
        complete: () => {
          this.overlayHide();
        }
      })
    }
  },
  showLoadShow() {
    this.setData({
      showLoad: true
    })
  },
  showLoadHide() {
    this.setData({
      showLoad: false
    }, )
  },

  //获取历史数据
  getHistoryData() {
    var hUrl;
    if (this.data.historyData.length === 0) {
      hUrl = this.data.indexData.posts.next_page_url_full;
      console.log(hUrl)
    } else {
      hUrl = this.data.historyData[this.data.historyData.length - 1].next_page_url_full;
      console.log(this, hUrl)
    }

    // var localHistoryData = wx.getStorageSync('HistoryData')
    // if (localHistoryData) {
    //   localHistoryData = JSON.parse(localHistoryData)
    // }
    // if (localHistoryData.expires > Date.now()) {
    //   this.setData({
    //     historyData: localHistoryData.data
    //   })
    // } else {
    this.showLoadShow();

    wx.request({
      url: "https://api.kele8.cn/agent/" + hUrl,
      success: (response) => {
        console.log(response.data.data);
        if (response.data.data) {
          // wx.setStorage({
          //   key: "HistoryData",
          //   data: JSON.stringify({
          //     expires: Date.now() + 60 * 60 * 1000 * 3,
          //     data: [...this.data.historyData, response.data.data]
          //   })
          // })
          if (this.data.historyData.length === 0) {
            this.setData({
              historyData: [response.data.data]
            })
          } else {
            console.log([...this.data.historyData, response.data.data])
            this.setData({
              historyData: [...this.data.historyData, response.data.data]
            })
          }
        } else {

        }

      },
      fail: () => {

      },
      complete: () => {
        this.showLoadHide();
      }
    })
    // }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData();
    this.getCateList();
    this.getCalendar();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getHistoryData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})