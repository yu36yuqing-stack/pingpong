const api = require('../../utils/api');

Page({
  data: {
    profile: null,
    courses: [],
    loading: false
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.reLaunch({ url: '/pages/login/index' });
      return;
    }
    this.load();
  },

  async load() {
    this.setData({ loading: true });
    try {
      const [profile, courses] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/courses')
      ]);
      this.setData({ profile, courses });
    } catch (e) {
      console.error(e);
      // token invalid
      wx.removeStorageSync('token');
      wx.showToast({ title: '登录失效，请重新登录', icon: 'none' });
      setTimeout(() => wx.reLaunch({ url: '/pages/login/index' }), 400);
    } finally {
      this.setData({ loading: false });
    }
  },

  async onScanAndCheckin() {
    try {
      await wx.scanCode({ scanType: ['qrCode', 'barCode'] });
      const res = await api.post('/scan/checkin', {});
      if (res && res.ok) {
        wx.showToast({ title: '打卡成功', icon: 'success' });
      } else {
        wx.showToast({ title: res?.message || '打卡失败', icon: 'none' });
      }
      this.load();
    } catch (e) {
      // user cancel scan
      if (e && e.errMsg && e.errMsg.includes('cancel')) return;
      console.error(e);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  onLogout() {
    wx.removeStorageSync('token');
    wx.reLaunch({ url: '/pages/login/index' });
  }
});
