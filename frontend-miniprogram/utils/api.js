// utils/api.js
const { API_BASE } = require('./config')

const TOKEN_KEY = 'token'

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || ''
}

function setToken(token) {
  wx.setStorageSync(TOKEN_KEY, token)
}

function clearToken() {
  wx.removeStorageSync(TOKEN_KEY)
}

function request({ path, method = 'GET', data = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    wx.request({
      url: API_BASE + path,
      method,
      data,
      header: {
        'content-type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...header,
      },
      success: (res) => {
        if (res.statusCode === 401) {
          clearToken()
          // 避免在某些生命周期里直接 redirect 出错
          wx.reLaunch({ url: '/pages/login/login' })
          return
        }
        resolve(res)
      },
      fail: (err) => reject(err),
    })
  })
}

async function devLogin(payload) {
  const res = await request({
    path: '/auth/dev-login',
    method: 'POST',
    data: payload,
  })
  if (res.data && res.data.token) setToken(res.data.token)
  return res.data
}

async function wxLogin() {
  const code = await new Promise((resolve, reject) => {
    wx.login({
      success: (r) => (r.code ? resolve(r.code) : reject(new Error('no code'))),
      fail: reject,
    })
  })
  const res = await request({
    path: '/auth/login',
    method: 'POST',
    data: { code },
  })
  if (res.data && res.data.token) setToken(res.data.token)
  return res.data
}

module.exports = {
  request,
  getToken,
  setToken,
  clearToken,
  devLogin,
  wxLogin,
}
