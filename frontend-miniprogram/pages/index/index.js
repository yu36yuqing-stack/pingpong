
// index.js
const app = getApp()

Page({
  data: {
    motto: '点击按钮开始扫码',
  },
  scanCode: function() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        wx.request({
          url: 'http://localhost:3000/scan/checkin',
          method: 'POST',
          data: {
            qrCodeContent: res.result
          },
          header: {
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          success: (res) => {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          },
          fail: (err) => {
            console.error(err)
            wx.showToast({
              title: '核销失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  onLoad() {
    // Perform login and get token when page loads
    wx.login({
      success: res => {
        wx.request({
          url: 'http://localhost:3000/auth/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res) => {
            wx.setStorageSync('token', res.data.token)
          }
        })
      }
    })
  },
})
