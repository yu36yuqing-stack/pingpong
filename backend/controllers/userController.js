
const db = require('../utils/db');

const getCourses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [courseRows] = await db.query(`
            SELECT c.* FROM courses c
            LEFT JOIN course_students cs ON c.course_id = cs.course_id
            WHERE (c.coach_id = ? OR cs.student_id = ?)
        `, [userId, userId]);
        res.json(courseRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [userRows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        const user = userRows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCourses,
    getProfile,
};
