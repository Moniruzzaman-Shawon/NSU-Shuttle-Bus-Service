const request = require('supertest');
const app = require('../index');
const db = require('../db/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../middleware/auth');

// ── Helpers ──────────────────────────────────────────
function makeToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

let studentToken, adminToken;
let studentId, adminId;
let testStopId;

// ── Setup & Teardown ─────────────────────────────────
beforeAll(async () => {
  // Clean test data
  db.exec("DELETE FROM bookings");
  db.exec("DELETE FROM contact_messages");
  db.exec("DELETE FROM users WHERE email IN ('teststudent@northsouth.edu','testadmin@northsouth.edu')");

  // Create test student
  const studentHash = await bcrypt.hash('test123456', 10);
  const studentResult = db.prepare(
    "INSERT INTO users (name, email, student_id, password_hash, role) VALUES (?, ?, ?, ?, ?)"
  ).run('Test Student', 'teststudent@northsouth.edu', '1234567', studentHash, 'student');
  studentId = studentResult.lastInsertRowid;
  studentToken = makeToken({ id: studentId, name: 'Test Student', email: 'teststudent@northsouth.edu', role: 'student' });

  // Create test admin
  const adminHash = await bcrypt.hash('admin123456', 10);
  const adminResult = db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
  ).run('Test Admin', 'testadmin@northsouth.edu', adminHash, 'admin');
  adminId = adminResult.lastInsertRowid;
  adminToken = makeToken({ id: adminId, name: 'Test Admin', email: 'testadmin@northsouth.edu', role: 'admin' });

  // Ensure at least one stop exists
  const existingStop = db.prepare('SELECT id FROM stops LIMIT 1').get();
  if (existingStop) {
    testStopId = existingStop.id;
  } else {
    const stopResult = db.prepare(
      "INSERT INTO stops (name, lat, lng, area_name) VALUES (?, ?, ?, ?)"
    ).run('Test Stop', 23.8103, 90.4125, 'Test Area');
    testStopId = stopResult.lastInsertRowid;
  }
});

afterAll(() => {
  // Clean up test data
  db.exec("DELETE FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email IN ('teststudent@northsouth.edu','testadmin@northsouth.edu'))");
  db.exec("DELETE FROM contact_messages WHERE email = 'teststudent@northsouth.edu'");
  db.exec("DELETE FROM users WHERE email IN ('teststudent@northsouth.edu','testadmin@northsouth.edu')");
});

// ══════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════

describe('POST /api/auth/register', () => {
  afterAll(() => {
    db.exec("DELETE FROM users WHERE email = 'newuser@northsouth.edu'");
  });

  test('registers a new student with valid NSU email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'New User', email: 'newuser@northsouth.edu', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('newuser@northsouth.edu');
    expect(res.body.user.role).toBe('student');
  });

  test('rejects non-NSU email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bad User', email: 'user@gmail.com', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/northsouth\.edu/);
  });

  test('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Pass' });
    expect(res.status).toBe(400);
  });

  test('rejects short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Short', email: 'short@northsouth.edu', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/6 characters/);
  });

  test('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Dup', email: 'teststudent@northsouth.edu', password: 'password123' });
    expect(res.status).toBe(409);
  });

  test('rejects invalid student ID format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bad ID', email: 'badid@northsouth.edu', student_id: '123', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/7 digits/);
  });
});

describe('POST /api/auth/login', () => {
  test('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teststudent@northsouth.edu', password: 'test123456' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('Test Student');
  });

  test('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teststudent@northsouth.edu', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  test('rejects non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@northsouth.edu', password: 'password123' });
    expect(res.status).toBe(401);
  });

  test('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  test('returns current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('teststudent@northsouth.edu');
    expect(res.body.user.password_hash).toBeUndefined();
  });

  test('rejects request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/auth/profile', () => {
  test('updates name and student_id', async () => {
    const res = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Updated Name', student_id: '7654321' });
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Updated Name');
    expect(res.body.user.student_id).toBe('7654321');

    // Restore original name
    await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Test Student', student_id: '1234567' });
  });

  test('rejects empty name', async () => {
    const res = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: '' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/auth/password', () => {
  test('changes password with correct current password', async () => {
    const res = await request(app)
      .patch('/api/auth/password')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ currentPassword: 'test123456', newPassword: 'newpass123' });
    expect(res.status).toBe(200);

    // Change it back
    await request(app)
      .patch('/api/auth/password')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ currentPassword: 'newpass123', newPassword: 'test123456' });
  });

  test('rejects wrong current password', async () => {
    const res = await request(app)
      .patch('/api/auth/password')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ currentPassword: 'wrongpass', newPassword: 'newpass123' });
    expect(res.status).toBe(401);
  });

  test('rejects short new password', async () => {
    const res = await request(app)
      .patch('/api/auth/password')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ currentPassword: 'test123456', newPassword: '123' });
    expect(res.status).toBe(400);
  });
});

// ══════════════════════════════════════════════════════
// STOPS ROUTES
// ══════════════════════════════════════════════════════

describe('GET /api/stops', () => {
  test('returns stops for authenticated user', async () => {
    const res = await request(app)
      .get('/api/stops')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.stops)).toBe(true);
  });

  test('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/stops');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/stops (admin)', () => {
  let createdStopId;

  afterAll(() => {
    if (createdStopId) {
      db.prepare('DELETE FROM stops WHERE id = ?').run(createdStopId);
    }
  });

  test('admin can create a stop', async () => {
    const res = await request(app)
      .post('/api/stops')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Jest Stop', lat: 23.75, lng: 90.38, area_name: 'Jest Area' });
    expect(res.status).toBe(201);
    expect(res.body.stop.name).toBe('Jest Stop');
    createdStopId = res.body.stop.id;
  });

  test('student cannot create a stop', async () => {
    const res = await request(app)
      .post('/api/stops')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Nope', lat: 23.75, lng: 90.38, area_name: 'Nope' });
    expect(res.status).toBe(403);
  });

  test('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/stops')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/stops/:id (admin)', () => {
  let tempStopId;

  beforeAll(() => {
    const result = db.prepare(
      "INSERT INTO stops (name, lat, lng, area_name) VALUES (?, ?, ?, ?)"
    ).run('Temp Stop', 23.80, 90.40, 'Temp Area');
    tempStopId = result.lastInsertRowid;
  });

  test('admin can delete a stop', async () => {
    const res = await request(app)
      .delete(`/api/stops/${tempStopId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('returns 404 for non-existent stop', async () => {
    const res = await request(app)
      .delete('/api/stops/99999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  test('student cannot delete a stop', async () => {
    const s = db.prepare("INSERT INTO stops (name, lat, lng, area_name) VALUES (?, ?, ?, ?)").run('No Del', 23.0, 90.0, 'X');
    const res = await request(app)
      .delete(`/api/stops/${s.lastInsertRowid}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
    db.prepare('DELETE FROM stops WHERE id = ?').run(s.lastInsertRowid);
  });
});

// ══════════════════════════════════════════════════════
// BOOKINGS ROUTES
// ══════════════════════════════════════════════════════

describe('POST /api/bookings', () => {
  test('student can create a booking with stop_id', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ stop_id: testStopId, booking_date: '2026-04-01', time_slot: '9:00 AM' });
    expect(res.status).toBe(201);
    expect(res.body.booking.status).toBe('pending');
    expect(res.body.booking.time_slot).toBe('9:00 AM');
  });

  test('student can create a booking with custom location', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ custom_lat: 23.81, custom_lng: 90.41, custom_address: 'Custom Spot', booking_date: '2026-04-02', time_slot: '10:00 AM' });
    expect(res.status).toBe(201);
    expect(res.body.booking.custom_address).toBe('Custom Spot');
  });

  test('rejects booking without date/time', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ stop_id: testStopId });
    expect(res.status).toBe(400);
  });

  test('rejects booking without stop or custom location', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ booking_date: '2026-04-01', time_slot: '9:00 AM' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/bookings', () => {
  test('student sees only own bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    res.body.bookings.forEach(b => {
      expect(b.user_id).toBe(Number(studentId));
    });
  });

  test('admin sees all bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
  });
});

describe('PATCH /api/bookings/:id', () => {
  let bookingId;

  beforeAll(() => {
    const result = db.prepare(
      "INSERT INTO bookings (user_id, stop_id, booking_date, time_slot, status) VALUES (?, ?, ?, ?, ?)"
    ).run(studentId, testStopId, '2026-05-01', '11:00 AM', 'pending');
    bookingId = result.lastInsertRowid;
  });

  test('student can cancel own booking', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'cancelled' });
    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('cancelled');
  });

  test('student cannot confirm a booking', async () => {
    // Re-set to pending
    db.prepare("UPDATE bookings SET status = 'pending' WHERE id = ?").run(bookingId);
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'confirmed' });
    expect(res.status).toBe(400);
  });

  test('admin can change booking status', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('confirmed');
  });

  test('rejects invalid status', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'invalid_status' });
    expect(res.status).toBe(400);
  });

  test('returns 404 for non-existent booking', async () => {
    const res = await request(app)
      .patch('/api/bookings/99999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });
    expect(res.status).toBe(404);
  });
});

// ══════════════════════════════════════════════════════
// CONTACT ROUTE
// ══════════════════════════════════════════════════════

describe('POST /api/contact', () => {
  test('submits a contact message', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Tester', email: 'teststudent@northsouth.edu', message: 'Hello from tests' });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/sent/i);
  });

  test('rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'No message' });
    expect(res.status).toBe(400);
  });

  test('accepts optional phone and address', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Full', email: 'full@northsouth.edu', phone: '01700000000', address: 'Dhaka', message: 'Full form' });
    expect(res.status).toBe(201);
  });
});

// ══════════════════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════════════════

describe('GET /api/admin/stats', () => {
  test('admin can access stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(typeof res.body.stats.totalStudents).toBe('number');
    expect(typeof res.body.stats.totalBookings).toBe('number');
    expect(typeof res.body.stats.pendingBookings).toBe('number');
    expect(typeof res.body.stats.confirmedBookings).toBe('number');
    expect(typeof res.body.stats.completedBookings).toBe('number');
    expect(typeof res.body.stats.cancelledBookings).toBe('number');
    expect(typeof res.body.stats.totalStops).toBe('number');
  });

  test('student cannot access admin stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });

  test('unauthenticated request is rejected', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/students', () => {
  test('admin can list students', async () => {
    const res = await request(app)
      .get('/api/admin/students')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    res.body.students.forEach(s => {
      expect(s.password_hash).toBeUndefined();
    });
  });

  test('student cannot list students', async () => {
    const res = await request(app)
      .get('/api/admin/students')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });
});

// ══════════════════════════════════════════════════════
// MIDDLEWARE TESTS
// ══════════════════════════════════════════════════════

describe('Auth Middleware', () => {
  test('rejects expired token', async () => {
    const expiredToken = jwt.sign(
      { id: studentId, name: 'Test', email: 'test@northsouth.edu', role: 'student' },
      JWT_SECRET,
      { expiresIn: '0s' }
    );
    // Small delay to ensure token is expired
    await new Promise(r => setTimeout(r, 100));
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });

  test('rejects malformed Authorization header', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'NotBearer token');
    expect(res.status).toBe(401);
  });
});
