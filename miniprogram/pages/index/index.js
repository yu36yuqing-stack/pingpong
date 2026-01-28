// index.js
Page({
  scanCode: function() {
    wx.scanCode({
      success: (res) => {
        console.log(res);
        // Here we would call our backend API
        wx.request({
          url: 'http://localhost:3000/scan/checkin', // Replace with actual backend URL
          method: 'POST',
          data: {
            qrCodeContent: res.result
          },
          success: (res) => {
            wx.showToast({
              title: '核销成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail: (err) => {
            wx.showToast({
              title: '核销失败',
              icon: 'none',
              duration: 2000
            });
          }
        });
      }
    });
  }
});
