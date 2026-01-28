const api = require('../../utils/api')

Page({
  onShow() {
    // 入口页：有 token 去扫码；没 token 去登录
    if (api.getToken()) {
      wx.reLaunch({ url: '/pages/scan/scan' })
    } else {
      wx.reLaunch({ url: '/pages/login/login' })
    }
  },
})
