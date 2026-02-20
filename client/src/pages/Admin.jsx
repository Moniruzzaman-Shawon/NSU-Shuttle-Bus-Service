import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import BookingCard from '../components/BookingCard';
import BookingModal from '../components/BookingModal';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import './Admin.css';

const STAT_ICONS = {
  Students: '\uD83C\uDF93',
  'Total Bookings': '\uD83D\uDCCB',
  Pending: '\u23F3',
  Confirmed: '\u2705',
  Completed: '\uD83C\uDFC1',
  Stops: '\uD83D\uDCCD',
};

export default function Admin() {
  const toast = useToast();
  const [tab, setTab] = useState('bookings');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stops, setStops] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalBooking, setModalBooking] = useState(null);

  // Search / Filter state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // New stop form
  const [newStop, setNewStop] = useState({ name: '', lat: '', lng: '', area_name: '' });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    api.get('/admin/stats').then((r) => setStats(r.data.stats)).catch(() => {});
    api.get('/bookings').then((r) => setBookings(r.data.bookings)).catch(() => {});
    api.get('/stops').then((r) => setStops(r.data.stops)).catch(() => {});
    api.get('/admin/students').then((r) => setStudents(r.data.students)).catch(() => {});
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      toast.success(`Booking ${status}`);
      loadAll();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stops', {
        ...newStop,
        lat: parseFloat(newStop.lat),
        lng: parseFloat(newStop.lng),
      });
      toast.success('Stop added successfully');
      setNewStop({ name: '', lat: '', lng: '', area_name: '' });
      loadAll();
    } catch {
      toast.error('Failed to add stop');
    }
  };

  const handleDeleteStop = async (id) => {
    if (!confirm('Delete this stop?')) return;
    try {
      await api.delete(`/stops/${id}`);
      toast.info('Stop deleted');
      loadAll();
    } catch {
      toast.error('Failed to delete stop');
    }
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const text = searchText.toLowerCase();
      if (text) {
        const matchName = b.user_name?.toLowerCase().includes(text);
        const matchEmail = b.user_email?.toLowerCase().includes(text);
        const matchStop = b.stop_name?.toLowerCase().includes(text) || b.custom_address?.toLowerCase().includes(text);
        if (!matchName && !matchEmail && !matchStop) return false;
      }
      if (statusFilter && b.status !== statusFilter) return false;
      if (dateFilter && b.booking_date !== dateFilter) return false;
      return true;
    });
  }, [bookings, searchText, statusFilter, dateFilter]);

  const statItems = stats ? [
    { label: 'Students', value: stats.totalStudents },
    { label: 'Total Bookings', value: stats.totalBookings },
    { label: 'Pending', value: stats.pendingBookings },
    { label: 'Confirmed', value: stats.confirmedBookings },
    { label: 'Completed', value: stats.completedBookings },
    { label: 'Stops', value: stats.totalStops },
  ] : [];

  return (
    <HeroHeader variant="dark" className="admin-page">
      <Navbar variant="dark" />
      <div className="admin-content">
        <h1>Admin Panel</h1>

        {/* Stats */}
        {stats && (
          <div className="stats-grid">
            {statItems.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon">{STAT_ICONS[s.label]}</div>
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>
            Bookings ({bookings.length})
          </button>
          <button className={tab === 'stops' ? 'active' : ''} onClick={() => setTab('stops')}>
            Stops ({stops.length})
          </button>
          <button className={tab === 'students' ? 'active' : ''} onClick={() => setTab('students')}>
            Students ({students.length})
          </button>
        </div>

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="tab-content">
            <div className="filter-bar glass">
              <input
                type="text"
                className="filter-input"
                placeholder="Search by name, email, or stop..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="date"
                className="filter-input filter-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {filteredBookings.length === 0 ? (
              <p className="empty-text">No bookings match your filters.</p>
            ) : (
              filteredBookings.map((b) => (
                <BookingCard key={b.id} booking={b} isAdmin onStatusChange={handleStatusChange} onClick={setModalBooking} />
              ))
            )}
          </div>
        )}

        {/* Stops Tab */}
        {tab === 'stops' && (
          <div className="tab-content">
            <form className="add-stop-form" onSubmit={handleAddStop}>
              <input placeholder="Stop Name" value={newStop.name} onChange={(e) => setNewStop({ ...newStop, name: e.target.value })} required />
              <input placeholder="Latitude" type="number" step="any" value={newStop.lat} onChange={(e) => setNewStop({ ...newStop, lat: e.target.value })} required />
              <input placeholder="Longitude" type="number" step="any" value={newStop.lng} onChange={(e) => setNewStop({ ...newStop, lng: e.target.value })} required />
              <input placeholder="Area Name" value={newStop.area_name} onChange={(e) => setNewStop({ ...newStop, area_name: e.target.value })} required />
              <button type="submit" className="btn-primary">Add Stop</button>
            </form>
            <div className="stops-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Area</th>
                    <th>Lat</th>
                    <th>Lng</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stops.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.area_name}</td>
                      <td>{s.lat}</td>
                      <td>{s.lng}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteStop(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {tab === 'students' && (
          <div className="tab-content">
            <div className="stops-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.student_id || '-'}</td>
                      <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalBooking && (
        <BookingModal booking={modalBooking} onClose={() => setModalBooking(null)} />
      )}
    </HeroHeader>
  );
}
