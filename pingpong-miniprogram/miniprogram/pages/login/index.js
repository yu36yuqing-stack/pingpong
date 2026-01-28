const api = require('../../utils/api');

Page({
  async onWxLogin() {
    try {
      const { code } = await wx.login();
      const data = await api.post('/auth/login', { code });
      wx.setStorageSync('token', data.token);
      wx.reLaunch({ url: '/pages/index/index' });
    } catch (e) {
      wx.showToast({ title: '登录失败', icon: 'none' });
      console.error(e);
    }
  }
});
