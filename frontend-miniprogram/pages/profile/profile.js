const api = require('../../utils/api')

Page({
  data: {
    loading: false,
    profile: null,
    courses: [],
    error: '',
  },

  async onShow() {
    if (!api.getToken()) {
      wx.reLaunch({ url: '/pages/login/login' })
      return
    }

    this.setData({ loading: true, error: '' })
    try {
      const [p, c] = await Promise.all([
        api.request({ path: '/user/profile' }),
        api.request({ path: '/user/courses' }),
      ])
      this.setData({
        profile: p.data,
        courses: c.data || [],
      })
    } catch (e) {
      this.setData({ error: (e && (e.errMsg || e.message)) || 'load failed' })
      console.error(e)
    } finally {
      this.setData({ loading: false })
    }
  },

  back() {
    wx.navigateBack()
  },
})
