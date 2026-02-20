const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/stops
router.get('/', authenticate, (req, res) => {
  const stops = db.prepare('SELECT * FROM stops ORDER BY name').all();
  res.json({ stops });
});

// POST /api/stops (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, lat, lng, area_name } = req.body;
  if (!name || lat == null || lng == null || !area_name) {
    return res.status(400).json({ error: 'name, lat, lng, and area_name are required' });
  }
  const result = db.prepare(
    'INSERT INTO stops (name, lat, lng, area_name) VALUES (?, ?, ?, ?)'
  ).run(name, lat, lng, area_name);
  const stop = db.prepare('SELECT * FROM stops WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ stop });
});

// PUT /api/stops/:id (admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { name, lat, lng, area_name } = req.body;
  const existing = db.prepare('SELECT * FROM stops WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Stop not found' });
  }
  db.prepare(
    'UPDATE stops SET name = ?, lat = ?, lng = ?, area_name = ? WHERE id = ?'
  ).run(
    name || existing.name,
    lat != null ? lat : existing.lat,
    lng != null ? lng : existing.lng,
    area_name || existing.area_name,
    req.params.id
  );
  const stop = db.prepare('SELECT * FROM stops WHERE id = ?').get(req.params.id);
  res.json({ stop });
});

// DELETE /api/stops/:id (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM stops WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Stop not found' });
  }
  db.prepare('DELETE FROM stops WHERE id = ?').run(req.params.id);
  res.json({ message: 'Stop deleted' });
});

module.exports = router;
