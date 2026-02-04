Page({
  onLoad() {
    this.testConnection();
  },
  
  async testConnection() {
    try {
      wx.request({
        url: 'https://pingpong.waitworld.com/api/auth/dev-login',
        method: 'POST',
        data: { name: 'test', role: 'USER' },
        success: (res) => {
          console.log('Success:', res);
          wx.showToast({ title: '网络正常', icon: 'success' });
        },
        fail: (err) => {
          console.error('Network error:', err);
          wx.showToast({ title: '网络失败', icon: 'none' });
        }
      });
    } catch (e) {
      console.error('Exception:', e);
      wx.showToast({ title: '异常错误', icon: 'none' });
    }
  }
});