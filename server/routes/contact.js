const express = require('express');
const db = require('../db/database');

const router = express.Router();

// POST /api/contact
router.post('/', (req, res) => {
  try {
    const { name, email, phone, address, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    db.prepare(
      'INSERT INTO contact_messages (name, email, phone, address, message) VALUES (?, ?, ?, ?, ?)'
    ).run(name, email, phone || null, address || null, message);

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
