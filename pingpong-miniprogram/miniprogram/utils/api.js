function request(method, path, data) {
  const app = getApp();
  const token = wx.getStorageSync('token');
  
  // 添加详细日志
  console.log('API Request:', {
    url: app.globalData.baseUrl + '/api' + path,
    method: method,
    data: data,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {})
    }
  });
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + '/api' + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
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