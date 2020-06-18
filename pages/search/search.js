// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData: null,
    value: '',
    recommend_keywords: [],
    searchHistroy: [],
    isShowPosts: false,
    showLoading: false,
    moreData: [],
  },
  // 热门搜索
  getSearchRecommend() {
    var localRecommend = wx.getStorageSync('searchRecommend')

    if (localRecommend) {
      localRecommend = JSON.parse(localRecommend)
    }

    if (localRecommend.expires > Date.now()) {
      this.setData({
        recommend_keywords: localRecommend.data
      })
    } else {
      wx.request({
        url: "https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search",
        success: (response) => {
          console.log(response.data.data);
          if (response.data.data) {
            wx.setStorage({
              key: "searchRecommend",
              data: JSON.stringify({
                expires: Date.now() + 60 * 60 * 1000 * 3,
                data: response.data.data.recommend_keywords
              })
            })
            this.setData({
              recommend_keywords: response.data.data.recommend_keywords
            })
          } else {

          }
        },
        fail: () => {},
        complete: () => {}
      })
    }
  },
  hidePosts() {
    this.setData({
      isShowPosts: false
    });
  },
  //点击搜索关键词
  getKeyword(e) {
    console.log(e.currentTarget.dataset.kw)
    this.setData({
      searchData: null,
      value: e.currentTarget.dataset.kw,
      isShowPosts: true,
      searchHistroy: Array.from(new Set([...this.data.searchHistroy, e.currentTarget.dataset.kw]))
    });

    wx.setStorage({
      key: 'localSearch',
      data: JSON.stringify({
        data: this.data.searchHistroy
      })
    })
    wx.request({
      url: "https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search?kw=" + this.data.value,
      success: (response) => {
        console.log(response.data.data);
        this.setData({
          searchData: response.data.data
        })
      },
      fail: () => {},
      complete: () => {
        this.setData({
          showLoading: false
        })
      }
    })
  },
  // 搜索输入关键词
  getSearch(e) {
    this.setData({
      searchData: null,
      value: e.detail,
      isShowPosts: true,
      showLoading: true
    });
    // 设置搜索历史
    console.log(e)
    this.setSearchHistroy(e);

    wx.request({
      url: "https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search?kw=" + this.data.value,
      success: (response) => {
        console.log(response.data.data);
        this.setData({
          searchData: response.data.data
        })
      },
      fail: () => {},
      complete: () => {
        this.setData({
          showLoading: false
        })
      }
    })

  },
  // 更多
  moreSearch() {
    let moreUrl;
    if (this.data.moreData.length === 0) {
      moreUrl = this.data.searchData.result.next_page_url_full;
      console.log(moreUrl)
    } else {
      moreUrl = this.data.moreData[this.data.moreData.length - 1].result.next_page_url_full;
      console.log(moreUrl)
    }
    // this.showLoadShow();
    this.setData({
      showLoading: true
    })

    wx.request({
      url: "https://api.kele8.cn/agent/" + moreUrl,
      success: (response) => {
        console.log(response.data.data);
        if (response.data.data) {
          if (this.data.moreData.length === 0) {
            this.setData({
              moreData: [response.data.data]
            })
          } else {
            console.log([...this.data.moreData, response.data.data])
            this.setData({
              moreData: [...this.data.moreData, response.data.data]
            })
          }
        } else {

        }

      },
      fail: () => {

      },
      complete: () => {
        // this.showLoadHide();
        this.setData({
          showLoading: false
        })
      }
    })
  },

  // 取消 返回首页
  onCancel() {
    wx.navigateBack({
      delta: 1
    })
  },

  //设置搜索历史
  setSearchHistroy(v) {
    this.setData({
      searchHistroy: Array.from(new Set([...this.data.searchHistroy, v.detail]))
    })
    wx.setStorage({
      key: 'localSearch',
      data: JSON.stringify({
        data: this.data.searchHistroy
      })
    })
  },

  //获取本地搜索历史
  getSearchHistroy() {
    var searchHistroy = wx.getStorageSync('localSearch')
    searchHistroy = JSON.parse(searchHistroy).data
    this.setData({
      searchHistroy: searchHistroy
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchRecommend()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSearchHistroy()
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
    this.moreSearch()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})