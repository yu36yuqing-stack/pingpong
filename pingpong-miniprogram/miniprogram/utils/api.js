function request(method, path, data) {
  const app = getApp();
  const token = wx.getStorageSync('token');
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(res.data);
        reject({ statusCode: res.statusCode, data: res.data });
      },
      fail(err) { reject(err); }
    });
  });
}
module.exports = {
  get: (path) => request('GET', path),
  post: (path, data) => request('POST', path, data)
};
