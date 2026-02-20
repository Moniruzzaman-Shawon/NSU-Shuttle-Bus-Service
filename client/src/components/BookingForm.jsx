import { useState } from 'react';
import './BookingForm.css';

const TIME_SLOTS = [
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM',
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
];

export default function BookingForm({ selectedStop, customLocation, onSubmit, loading }) {
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const pickup = selectedStop ? selectedStop.name : customLocation ? 'Custom Location' : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickup) return;
    onSubmit({ bookingDate, timeSlot });
    setBookingDate('');
    setTimeSlot('');
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Book a Shuttle</h3>
      <div className="form-field">
        <label>Pickup Location</label>
        <input type="text" value={pickup || 'Select on map'} readOnly className="readonly-field" />
      </div>
      <div className="form-field">
        <label>Date</label>
        <input type="date" value={bookingDate} min={today} onChange={(e) => setBookingDate(e.target.value)} required />
      </div>
      <div className="form-field">
        <label>Time Slot</label>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
          <option value="">Select time slot</option>
          {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <button type="submit" className="book-btn" disabled={!pickup || !bookingDate || !timeSlot || loading}>
        {loading ? 'Booking...' : 'Book Shuttle'}
      </button>
    </form>
  );
}
