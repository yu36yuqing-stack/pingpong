Page({
  data: {
    ok: false,
    qrCodeContent: '',
    responseText: '',
    error: '',
  },

  onLoad(query) {
    try {
      const payload = JSON.parse(decodeURIComponent(query.payload || ''))
      this.setData({
        ok: !!payload.ok,
        qrCodeContent: payload.qrCodeContent || '',
        responseText: payload.response ? JSON.stringify(payload.response, null, 2) : '',
        error: payload.error || '',
      })
    } catch (e) {
      this.setData({ ok: false, error: 'payload parse failed' })
    }
  },

  backToScan() {
    wx.redirectTo({ url: '/pages/scan/scan' })
  },
})
