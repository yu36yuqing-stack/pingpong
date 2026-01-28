
const axios = require('axios');
const jwt =require('jsonwebtoken');
const db = require('../utils/db');

const login = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Code is required' });
        }

        const { WX_APPID, WX_SECRET, JWT_SECRET } = process.env;
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_APPID}&secret=${WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
        const { data } = await axios.get(url);

        if (data.errcode) {
            return res.status(400).json({ message: data.errmsg });
        }

        const { openid } = data;

        let [rows] = await db.query('SELECT * FROM users WHERE open_id = ?', [openid]);
        let user = rows[0];

        if (!user) {
            const [result] = await db.query('INSERT INTO users (open_id, name, role) VALUES (?, ?, ?)', [openid, 'New User', 'STUDENT']);
            [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
            user = rows[0];
        }

        const token = jwt.sign({ userId: user.user_id, openid }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, userInfo: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
};
