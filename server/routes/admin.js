const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', authenticate, requireAdmin, (req, res) => {
  const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  const pendingBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get().count;
  const confirmedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").get().count;
  const completedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'").get().count;
  const cancelledBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'cancelled'").get().count;
  const totalStops = db.prepare('SELECT COUNT(*) as count FROM stops').get().count;

  res.json({
    stats: {
      totalStudents,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalStops,
    },
  });
});

// GET /api/admin/students
router.get('/students', authenticate, requireAdmin, (req, res) => {
  const students = db.prepare(
    "SELECT id, name, email, student_id, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC"
  ).all();
  res.json({ students });
});

module.exports = router;
