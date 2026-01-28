
const axios = require('axios');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'devsecret';
  return jwt.sign({ userId: user.user_id, openid: user.open_id }, secret, { expiresIn: '7d' });
}

const login = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const { WX_APPID, WX_SECRET } = process.env;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
    const { data } = await axios.get(url);

    if (data.errcode) {
      return res.status(400).json({ message: data.errmsg });
    }

    const { openid } = data;

    let [rows] = await db.query('SELECT * FROM users WHERE open_id = ?', [openid]);
    let user = rows[0];

    if (!user) {
      const [result] = await db.query(
        'INSERT INTO users (open_id, name, role) VALUES (?, ?, ?)',
        [openid, 'New User', 'STUDENT']
      );
      [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
      user = rows[0];
    }

    const token = signToken(user);
    res.json({ token, userInfo: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Demo helper: POST /auth/dev-login
// body: { open_id, name, role, balance }
const devLogin = async (req, res) => {
  try {
    const { open_id, name, role, balance } = req.body || {};
    const openid = open_id || `dev_${Date.now()}`;
    const userName = name || 'Demo User';
    const userRole = role || 'STUDENT';

    let [rows] = await db.query('SELECT * FROM users WHERE open_id = ?', [openid]);
    let user = rows[0];

    if (!user) {
      const [result] = await db.query(
        'INSERT INTO users (open_id, name, role, balance) VALUES (?, ?, ?, ?)',
        [openid, userName, userRole, Number.isFinite(balance) ? balance : (userRole === 'STUDENT' ? 10 : 0)]
      );
      [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
      user = rows[0];
    }

    const token = signToken(user);
    res.json({ token, userInfo: user, demo: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  devLogin,
};
