import './BookingCard.css';

export default function BookingCard({ booking, onCancel, isAdmin, onStatusChange, onClick }) {
  const pickup = booking.stop_name || booking.custom_address || 'Custom Location';

  return (
    <div className={`booking-card booking-card-${booking.status}`} onClick={() => onClick?.(booking)}>
      <div className="booking-card-body">
        <div className="booking-card-info">
          <strong className="booking-card-pickup">
            <span className="booking-card-icon">&#128205;</span>
            {pickup}
          </strong>
          {booking.area_name && <span className="booking-card-area">({booking.area_name})</span>}
          {isAdmin && booking.user_name && (
            <div className="booking-card-user">
              <span className="booking-card-icon">&#128100;</span>
              {booking.user_name} ({booking.user_email})
            </div>
          )}
          <div className="booking-card-datetime">
            <span className="booking-card-icon">&#128197;</span>
            {booking.booking_date} &middot; {booking.time_slot}
          </div>
        </div>
        <div className="booking-card-actions" onClick={(e) => e.stopPropagation()}>
          <span className={`booking-status-badge status-${booking.status}`}>
            {booking.status}
          </span>
          {!isAdmin && booking.status === 'pending' && onCancel && (
            <button className="booking-cancel-btn" onClick={() => onCancel(booking.id)}>
              Cancel
            </button>
          )}
          {isAdmin && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <select
              className="booking-status-select"
              value=""
              onChange={(e) => onStatusChange(booking.id, e.target.value)}
            >
              <option value="">Change</option>
              {booking.status === 'pending' && <option value="confirmed">Confirm</option>}
              {booking.status === 'confirmed' && <option value="completed">Complete</option>}
              <option value="cancelled">Cancel</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
