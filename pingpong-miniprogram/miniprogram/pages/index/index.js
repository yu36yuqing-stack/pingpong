const api = require('../../utils/api');

Page({
  data: {
    profile: null,
    courses: [],
    loading: false
  },
  
  // 页面销毁标志，防止退出时的竞态条件
  _isDestroyed: false,

  onShow() {
    if (this._isDestroyed) return;
    
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.reLaunch({ url: '/pages/login/index' });
      return;
    }
    this.load();
  },

  async load() {
    if (this._isDestroyed) return;
    
    this.setData({ loading: true });
    try {
      const [profile, courses] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/courses')
      ]);
      
      if (this._isDestroyed) return;
      
      this.setData({ profile, courses });
    } catch (e) {
      if (this._isDestroyed) return;
      
      console.error('API error:', e);
      
      // 只有在 401 未授权时才认为 token 过期
      if (e.statusCode === 401) {
        wx.removeStorageSync('token');
        wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
        setTimeout(() => wx.reLaunch({ url: '/pages/login/index' }), 400);
      } else {
        // 其他错误显示具体信息，不跳转
        wx.showToast({ 
          title: '加载失败: ' + (e.data?.message || '网络错误'), 
          icon: 'none' 
        });
      }
    } finally {
      if (this._isDestroyed) return;
      this.setData({ loading: false });
    }
  },

  async onScanAndCheckin() {
    if (this._isDestroyed) return;
    
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

  onUnload() {
    // 页面卸载时设置销毁标志
    this._isDestroyed = true;
  },

  onLogout() {
    // 设置销毁标志，防止退出过程中的异步操作
    this._isDestroyed = true;
    wx.removeStorageSync('token');
    wx.reLaunch({ url: '/pages/login/index' });
  }
});