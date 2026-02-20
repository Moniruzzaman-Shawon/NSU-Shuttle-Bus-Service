const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings
router.get('/', authenticate, (req, res) => {
  let bookings;
  if (req.user.role === 'admin') {
    bookings = db.prepare(`
      SELECT b.*, u.name as user_name, u.email as user_email, s.name as stop_name, s.area_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN stops s ON b.stop_id = s.id
      ORDER BY b.created_at DESC
    `).all();
  } else {
    bookings = db.prepare(`
      SELECT b.*, s.name as stop_name, s.area_name
      FROM bookings b
      LEFT JOIN stops s ON b.stop_id = s.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(req.user.id);
  }
  res.json({ bookings });
});

// POST /api/bookings
router.post('/', authenticate, (req, res) => {
  const { stop_id, custom_lat, custom_lng, custom_address, booking_date, time_slot } = req.body;

  if (!booking_date || !time_slot) {
    return res.status(400).json({ error: 'booking_date and time_slot are required' });
  }

  if (!stop_id && (custom_lat == null || custom_lng == null)) {
    return res.status(400).json({ error: 'Either stop_id or custom location is required' });
  }

  const result = db.prepare(`
    INSERT INTO bookings (user_id, stop_id, custom_lat, custom_lng, custom_address, booking_date, time_slot, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(
    req.user.id,
    stop_id || null,
    custom_lat || null,
    custom_lng || null,
    custom_address || null,
    booking_date,
    time_slot
  );

  const booking = db.prepare(`
    SELECT b.*, s.name as stop_name, s.area_name
    FROM bookings b
    LEFT JOIN stops s ON b.stop_id = s.id
    WHERE b.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json({ booking });
});

// PATCH /api/bookings/:id
router.patch('/:id', authenticate, (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Students can only cancel their own bookings
  if (req.user.role === 'student') {
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (req.body.status !== 'cancelled') {
      return res.status(400).json({ error: 'Students can only cancel bookings' });
    }
  }

  const { status } = req.body;
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);

  const updated = db.prepare(`
    SELECT b.*, s.name as stop_name, s.area_name
    FROM bookings b
    LEFT JOIN stops s ON b.stop_id = s.id
    WHERE b.id = ?
  `).get(req.params.id);

  res.json({ booking: updated });
});

module.exports = router;
