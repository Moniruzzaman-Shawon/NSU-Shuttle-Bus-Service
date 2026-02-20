import './BookingModal.css';

export default function BookingModal({ booking, onClose }) {
  if (!booking) return null;

  const pickup = booking.stop_name || booking.custom_address || 'Custom Location';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        <h2 className="modal-title">Booking Details</h2>

        <div className={`modal-status-bar modal-status-${booking.status}`}>
          {booking.status}
        </div>

        <div className="modal-details">
          <div className="modal-row">
            <span className="modal-label">&#128205; Pickup Location</span>
            <span className="modal-value">{pickup}</span>
          </div>

          {booking.area_name && (
            <div className="modal-row">
              <span className="modal-label">&#127759; Area</span>
              <span className="modal-value">{booking.area_name}</span>
            </div>
          )}

          <div className="modal-row">
            <span className="modal-label">&#128197; Date</span>
            <span className="modal-value">{booking.booking_date}</span>
          </div>

          <div className="modal-row">
            <span className="modal-label">&#128336; Time Slot</span>
            <span className="modal-value">{booking.time_slot}</span>
          </div>

          <div className="modal-row">
            <span className="modal-label">&#128196; Booking ID</span>
            <span className="modal-value">#{booking.id}</span>
          </div>

          {booking.user_name && (
            <div className="modal-row">
              <span className="modal-label">&#128100; Student</span>
              <span className="modal-value">{booking.user_name}</span>
            </div>
          )}

          {booking.user_email && (
            <div className="modal-row">
              <span className="modal-label">&#9993; Email</span>
              <span className="modal-value">{booking.user_email}</span>
            </div>
          )}

          {booking.created_at && (
            <div className="modal-row">
              <span className="modal-label">&#128338; Booked On</span>
              <span className="modal-value">{new Date(booking.created_at).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
