const api = require('../../utils/api')

Page({
  data: {
    scanning: false,
  },

  onShow() {
    if (!api.getToken()) {
      wx.reLaunch({ url: '/pages/login/login' })
    }
  },

  async onScan() {
    if (this.data.scanning) return
    this.setData({ scanning: true })

    try {
      const scanRes = await new Promise((resolve, reject) => {
        wx.scanCode({
          onlyFromCamera: true,
          success: resolve,
          fail: reject,
        })
      })

      const qrCodeContent = scanRes.result
      const res = await api.request({
        path: '/scan/checkin',
        method: 'POST',
        data: { qrCodeContent },
      })

      wx.navigateTo({
        url: '/pages/result/result?payload=' + encodeURIComponent(JSON.stringify({
          ok: true,
          qrCodeContent,
          response: res.data,
        })),
      })
    } catch (e) {
      wx.navigateTo({
        url: '/pages/result/result?payload=' + encodeURIComponent(JSON.stringify({
          ok: false,
          error: (e && (e.errMsg || e.message)) || 'scan/checkin failed',
        })),
      })
      console.error(e)
    } finally {
      this.setData({ scanning: false })
    }
  },

  onProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' })
  },

  onLogout() {
    api.clearToken()
    wx.reLaunch({ url: '/pages/login/login' })
  },
})
