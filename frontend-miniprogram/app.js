
App({
  onLaunch() {
    // a
    wx.login({
      success: res => {
        // b
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
