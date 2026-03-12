const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const stopsRoutes = require('./routes/stops');
const bookingsRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stops', stopsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Auto-seed on first run if DB is empty
const db = require('./db/database');
const seedDb = async () => {
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@northsouth.edu');
  if (!adminExists) {
    console.log('Empty database detected — running seed...');
    require('./db/seed');
  }
};

if (require.main === module) {
  seedDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
