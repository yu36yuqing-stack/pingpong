const api = require('../../utils/api')

Page({
  data: {
    loading: false,
    // demo 默认值：可在输入框修改
    open_id: 'demo_open_id_001',
    name: 'Demo教务',
    role: 'teacher',
    balance: 0,
  },

  onLoad() {
    // 已有 token 直接去扫码页
    if (api.getToken()) {
      wx.reLaunch({ url: '/pages/scan/scan' })
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },

  async onDevLogin() {
    if (this.data.loading) return
    this.setData({ loading: true })
    try {
      await api.devLogin({
        open_id: this.data.open_id,
        name: this.data.name,
        role: this.data.role,
        balance: Number(this.data.balance) || 0,
      })
      wx.showToast({ title: '登录成功', icon: 'success' })
      wx.reLaunch({ url: '/pages/scan/scan' })
    } catch (e) {
      wx.showToast({ title: '登录失败', icon: 'none' })
      console.error(e)
    } finally {
      this.setData({ loading: false })
    }
  },

  async onWxLogin() {
    if (this.data.loading) return
    this.setData({ loading: true })
    try {
      await api.wxLogin()
      wx.showToast({ title: '登录成功', icon: 'success' })
      wx.reLaunch({ url: '/pages/scan/scan' })
    } catch (e) {
      wx.showToast({ title: '登录失败', icon: 'none' })
      console.error(e)
    } finally {
      this.setData({ loading: false })
    }
  },
})
