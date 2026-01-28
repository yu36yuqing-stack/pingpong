
const db = require('../utils/db');

const createCourse = async (req, res) => {
    try {
        const { start_time, end_time, coach_id, student_ids } = req.body;

        const isSqlite = (process.env.DB_CLIENT || 'mysql').toLowerCase() === 'sqlite';
        const startValue = isSqlite ? Date.parse(start_time) : start_time;
        const endValue = isSqlite ? Date.parse(end_time) : end_time;

        const [result] = await db.query(
            'INSERT INTO courses (start_time, end_time, coach_id) VALUES (?, ?, ?)',
            [startValue, endValue, coach_id]
        );
        const courseId = result.insertId;

        if (student_ids && student_ids.length > 0) {
            // mysql2 supports bulk insert; sqlite demo uses simple loop
            for (const student_id of student_ids) {
                await db.query(
                    'INSERT INTO course_students (course_id, student_id) VALUES (?, ?)',
                    [courseId, student_id]
                );
            }
        }

        res.status(201).json({ status: 'success', course_id: courseId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { start_time, end_time, coach_id } = req.body;
        await db.query(
            'UPDATE courses SET start_time = ?, end_time = ?, coach_id = ? WHERE course_id = ?',
            [start_time, end_time, coach_id, courseId]
        );
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        await db.query('DELETE FROM courses WHERE course_id = ?', [courseId]);
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCourses = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    getCourses,
};
