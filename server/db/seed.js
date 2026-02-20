const db = require('./database');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@northsouth.edu');
  if (!adminExists) {
    db.prepare(
      'INSERT INTO users (name, email, student_id, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).run('Admin', 'admin@northsouth.edu', '0000000', adminPassword, 'admin');
    console.log('Admin user created: admin@northsouth.edu / admin123');
  } else {
    console.log('Admin user already exists');
  }

  // Seed 10 Dhaka stops
  const stops = [
    { name: 'Mirpur 10', lat: 23.8069, lng: 90.3687, area_name: 'Mirpur' },
    { name: 'Dhanmondi 27', lat: 23.7466, lng: 90.3762, area_name: 'Dhanmondi' },
    { name: 'Gulshan 1', lat: 23.7808, lng: 90.4168, area_name: 'Gulshan' },
    { name: 'Uttara Sector 3', lat: 23.8759, lng: 90.3795, area_name: 'Uttara' },
    { name: 'Banani Chairmanbari', lat: 23.7937, lng: 90.4066, area_name: 'Banani' },
    { name: 'Mohakhali Bus Stand', lat: 23.7781, lng: 90.4040, area_name: 'Mohakhali' },
    { name: 'Farmgate', lat: 23.7573, lng: 90.3906, area_name: 'Farmgate' },
    { name: 'Motijheel', lat: 23.7330, lng: 90.4185, area_name: 'Motijheel' },
    { name: 'Bashundhara Gate', lat: 23.8139, lng: 90.4312, area_name: 'Bashundhara' },
    { name: 'NSU Campus', lat: 23.8148, lng: 90.4253, area_name: 'Bashundhara R/A' },
  ];

  const existingStops = db.prepare('SELECT COUNT(*) as count FROM stops').get();
  if (existingStops.count === 0) {
    const insertStop = db.prepare(
      'INSERT INTO stops (name, lat, lng, area_name) VALUES (?, ?, ?, ?)'
    );
    for (const stop of stops) {
      insertStop.run(stop.name, stop.lat, stop.lng, stop.area_name);
    }
    console.log(`${stops.length} stops seeded`);
  } else {
    console.log('Stops already exist');
  }

  console.log('Seed complete!');
}

seed().catch(console.error);
