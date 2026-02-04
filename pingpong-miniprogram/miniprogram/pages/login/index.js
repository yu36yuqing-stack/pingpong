const api = require('../../utils/api');

Page({
  async onWxLogin() {
    try {
      const data = await api.post('/auth/dev-login', { 
        name: 'test_user',
        role: 'USER'
      });
      wx.setStorageSync('token', data.token);
      wx.reLaunch({ url: '/pages/index/index' });
    } catch (e) {
      console.error('Login failed:', e);
      let errorMsg = '登录失败';
      if (e.errMsg && e.errMsg.includes('url not in domain list')) {
        errorMsg = '域名配置问题，请检查微信公众平台配置';
      } else if (e.statusCode) {
        errorMsg = `服务器错误: ${e.statusCode}`;
      }
      wx.showToast({ title: errorMsg, icon: 'none' });
    }
  }
});