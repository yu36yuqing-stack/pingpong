const api = require('../../utils/api');

Page({
  async onWxLogin() {
    try {
      // 1. 获取用户信息（需要弹窗授权）
      const userRes = await wx.getUserProfile({
        desc: '用于完善会员资料', // 必填，声明用途
      });
      const nickname = userRes.userInfo.nickName;

      // 2. 获取登录 Code
      const loginRes = await wx.login();
      if (!loginRes.code) {
        throw new Error('wx.login failed: ' + loginRes.errMsg);
      }

      // 3. 调用后端登录
      const data = await api.post('/auth/login', { 
        code: loginRes.code,
        nickname: nickname
      });

      // 4. 保存 Token 并跳转
      wx.setStorageSync('token', data.token);
      wx.reLaunch({ url: '/pages/index/index' });

    } catch (e) {
      console.error('Login failed:', e);
      let errorMsg = '登录失败';
      if (e.errMsg && e.errMsg.includes('url not in domain list')) {
        errorMsg = '域名配置问题，请检查微信公众平台配置';
      } else if (e.statusCode) {
        errorMsg = `服务器错误: ${e.statusCode}`;
      } else if (e.errMsg && e.errMsg.includes('getUserProfile:fail')) {
        errorMsg = '需要授权才能登录';
      }
      wx.showToast({ title: errorMsg, icon: 'none' });
    }
  }
});
