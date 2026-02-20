import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const blueIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const NSU_POSITION = [23.8148, 90.4253];
const DHAKA_CENTER = [23.8103, 90.4125];

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPicker({ stops = [], selectedStop, customLocation, onStopSelect, onCustomSelect }) {
  return (
    <div className="map-picker">
      <MapContainer center={DHAKA_CENTER} zoom={12} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* NSU Campus - fixed green marker */}
        <Marker position={NSU_POSITION} icon={greenIcon}>
          <Popup><strong>NSU Campus</strong><br />Dropoff Destination</Popup>
        </Marker>

        {/* Predefined stops - blue markers */}
        {stops.filter(s => s.name !== 'NSU Campus').map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={selectedStop?.id === stop.id ? redIcon : blueIcon}
            eventHandlers={{
              click: () => onStopSelect(stop),
            }}
          >
            <Popup>
              <strong>{stop.name}</strong><br />
              {stop.area_name}<br />
              <em>Click to select as pickup</em>
            </Popup>
          </Marker>
        ))}

        {/* Custom location - red marker */}
        {customLocation && !selectedStop && (
          <Marker position={[customLocation.lat, customLocation.lng]} icon={redIcon}>
            <Popup><strong>Custom Pickup</strong><br />Your selected location</Popup>
          </Marker>
        )}

        <ClickHandler onMapClick={(loc) => onCustomSelect(loc)} />
      </MapContainer>
      <p className="map-hint">
        Click a <strong>blue marker</strong> to select a predefined stop, or click anywhere on the map for a custom pickup point.
      </p>
    </div>
  );
}
