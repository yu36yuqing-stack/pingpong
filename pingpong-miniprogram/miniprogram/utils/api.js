function request(method, path, data) {
  const app = getApp();
  const token = wx.getStorageSync('token');
  
  // 如果是登录接口，不要带 Token (防止旧的无效 Token 导致 403)
  const isLogin = path.includes('/auth/login') || path.includes('/auth/dev-login');
  const header = {
    'Content-Type': 'application/json',
    ...(token && !isLogin ? { 'Authorization': 'Bearer ' + token } : {})
  };

  // 添加详细日志
  console.log('API Request:', {
    url: app.globalData.baseUrl + '/api' + path,
    method: method,
    data: data,
    headers: header
  });
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + '/api' + path,
      method,
      data,
      header: header,
      success(res) {
        console.log('API Success:', res);
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(res.data);
        reject({ statusCode: res.statusCode, data: res.data });
      },
      fail(err) {
        console.error('API Fail:', err);
        reject(err);
      }
    });
  });
}
module.exports = {
  get: (path) => request('GET', path),
  post: (path, data) => request('POST', path, data)
};
