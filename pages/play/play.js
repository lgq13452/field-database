// pages/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId: null,
    postViewDetail: null,
    comment: null,
    showPlayLoading: false,
  },
  //more
  routePostList(e) {
    wx.navigateTo({
      url: '/pages/posts/posts?id=' + e.currentTarget.dataset.careid + "&tab=" + e.currentTarget.dataset.tab,
    })
  },
  //相关视频
  navitorToPlay: function (e) {
    // console.log(e.currentTarget.dataset.post.postid)
    wx.navigateTo({
      url: '/pages/play/play?postid=' + e.currentTarget.dataset.post.postid,
    })
  },

  getPostById(id) {
    this.setData({
      showPlayLoading: true
    })
    wx.request({
      url: `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/view?postid=${id} `,
      success: (response) => {
        console.log(response.data.data)
        this.setData({
          postViewDetail: response.data.data,
          comment: response.data.data.comment
        })
      },
      complete: () => {
        this.setData({
          showPlayLoading: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.postid)
    this.setData({
      postId: options.postid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPostById(this.data.postId)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})