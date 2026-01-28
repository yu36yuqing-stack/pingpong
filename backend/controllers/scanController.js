
const db = require('../utils/db');

const checkin = async (req, res) => {
    try {
        const { qrCodeContent } = req.body;
        if (qrCodeContent !== 'GYM_CHECKOUT_QR') {
            return res.status(400).json({ status: 'error', message: 'Invalid QR Code' });
        }

        const userId = req.user.userId;

        const [userRows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        const user = userRows[0];
        
        const now = new Date();
        const nowValue = (process.env.DB_CLIENT || 'mysql').toLowerCase() === 'sqlite'
            ? now.getTime()
            : now;

        const [courseRows] = await db.query(`
            SELECT c.* FROM courses c
            LEFT JOIN course_students cs ON c.course_id = cs.course_id
            WHERE (c.coach_id = ? OR cs.student_id = ?)
            AND c.start_time <= ? AND c.end_time >= ?
            AND c.status = 'SCHEDULED'
        `, [userId, userId, nowValue, nowValue]);

        const course = courseRows[0];

        if (!course) {
            return res.status(404).json({ status: 'error', message: 'No course found for you at this time' });
        }

        if (user.role === 'COACH') {
            await db.query('UPDATE courses SET coach_confirmed = TRUE WHERE course_id = ?', [course.course_id]);
        } else {
            await db.query('UPDATE course_students SET status = "CONSUMED" WHERE course_id = ? AND student_id = ?', [course.course_id, userId]);
            await db.query('UPDATE users SET balance = balance - 1 WHERE user_id = ?', [userId]);
        }
        
        await db.query('INSERT INTO checkin_logs (course_id, user_id, user_role) VALUES (?, ?, ?)', [course.course_id, userId, user.role]);

        res.json({ status: 'success', message: 'Check-in successful', course_info: course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    checkin,
};
