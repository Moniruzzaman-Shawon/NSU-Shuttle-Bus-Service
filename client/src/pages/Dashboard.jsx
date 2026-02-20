import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import MapPicker from '../components/MapPicker';
import BookingForm from '../components/BookingForm';
import BookingCard from '../components/BookingCard';
import BookingModal from '../components/BookingModal';
import api from '../utils/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [stops, setStops] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [customLocation, setCustomLocation] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [modalBooking, setModalBooking] = useState(null);

  useEffect(() => {
    api.get('/stops').then((r) => setStops(r.data.stops)).catch(() => {});
    loadBookings();
  }, []);

  const loadBookings = () => {
    api.get('/bookings').then((r) => setBookings(r.data.bookings)).catch(() => {});
  };

  const handleStopSelect = (stop) => {
    setSelectedStop(stop);
    setCustomLocation(null);
  };

  const handleCustomSelect = (loc) => {
    setCustomLocation(loc);
    setSelectedStop(null);
  };

  const handleBooking = async ({ bookingDate, timeSlot }) => {
    setBookingLoading(true);
    try {
      const payload = {
        booking_date: bookingDate,
        time_slot: timeSlot,
      };
      if (selectedStop) {
        payload.stop_id = selectedStop.id;
      } else if (customLocation) {
        payload.custom_lat = customLocation.lat;
        payload.custom_lng = customLocation.lng;
        payload.custom_address = `Custom (${customLocation.lat.toFixed(4)}, ${customLocation.lng.toFixed(4)})`;
      }
      await api.post('/bookings', payload);
      toast.success('Shuttle booked successfully!');
      loadBookings();
      setSelectedStop(null);
      setCustomLocation(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}`, { status: 'cancelled' });
      toast.info('Booking cancelled');
      loadBookings();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const totalCount = bookings.length;

  return (
    <HeroHeader variant="dark" className="dashboard-page">
      <Navbar variant="dark" />
      <div className="dashboard-content">
        {/* Welcome Banner */}
        <div className="dash-welcome glass">
          <div className="dash-welcome-text">
            <h1>Welcome, {user?.name}</h1>
            <p>Manage your shuttle bookings and track your rides.</p>
          </div>
          <div className="dash-mini-stats">
            <div className="dash-mini-stat">
              <div className="mini-stat-num">{totalCount}</div>
              <div className="mini-stat-label">Total</div>
            </div>
            <div className="dash-mini-stat">
              <div className="mini-stat-num pending-color">{pendingCount}</div>
              <div className="mini-stat-label">Pending</div>
            </div>
            <div className="dash-mini-stat">
              <div className="mini-stat-num confirmed-color">{confirmedCount}</div>
              <div className="mini-stat-label">Confirmed</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-left">
            <MapPicker
              stops={stops}
              selectedStop={selectedStop}
              customLocation={customLocation}
              onStopSelect={handleStopSelect}
              onCustomSelect={handleCustomSelect}
            />
            <BookingForm
              selectedStop={selectedStop}
              customLocation={customLocation}
              onSubmit={handleBooking}
              loading={bookingLoading}
            />
          </div>
          <div className="dashboard-right">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="empty-text">No bookings yet. Select a pickup point on the map to get started.</p>
            ) : (
              bookings.map((b) => (
                <BookingCard key={b.id} booking={b} onCancel={handleCancel} onClick={setModalBooking} />
              ))
            )}
          </div>
        </div>
      </div>

      {modalBooking && (
        <BookingModal booking={modalBooking} onClose={() => setModalBooking(null)} />
      )}
    </HeroHeader>
  );
}
