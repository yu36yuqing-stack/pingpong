
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.post('/courses', authMiddleware, roleMiddleware('ADMIN'), adminController.createCourse);
router.put('/courses/:id', authMiddleware, roleMiddleware('ADMIN'), adminController.updateCourse);
router.delete('/courses/:id', authMiddleware, roleMiddleware('ADMIN'), adminController.deleteCourse);
router.get('/courses', authMiddleware, roleMiddleware('ADMIN'), adminController.getCourses);

module.exports = router;
