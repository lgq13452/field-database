// pages/posts/posts.js
import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateid: null,
    tab: null,
    page: 1,
    posts: [],
    showLoading: false,
    hasMore: true
  },

  getPostsByCateId(id, tab) {
    // 显示加载图标
    this.setData({
      showLoading: true
    })
    var selectUrl
    if (id !== 'undefined') {
      selectUrl = `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostInCate?p=${this.data.page}&size=10&cateid=${id}`
    } else {
      selectUrl = `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostByTab?p=${this.data.page}&size=10&tab=${tab}`
    }
    console.log(selectUrl)
    wx.request({
      url: selectUrl,
      success: (response) => {
        console.log(response)
        this.setData({
          posts: [...this.data.posts, ...response.data.data]
        })
        if (response.data.msg !== 'OK') {
          Notify('没有更多内容了');
          this.setData({
            hasMore: false
          })
        }
      },
      complete: () => {
        this.setData({
          showLoading: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cateid: options.id,
      tab: options.tab
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPostsByCateId(this.data.cateid, this.data.tab)
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

    if (this.data.hasMore) {
      this.setData({
        page: this.data.page + 1
      })
    } else {
      Notify('没有更多内容了');
    }
    this.getPostsByCateId(this.data.cateid)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})