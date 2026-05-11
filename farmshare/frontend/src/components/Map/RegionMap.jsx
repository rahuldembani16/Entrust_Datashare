import { MapContainer, Polygon, TileLayer, Tooltip } from 'react-leaflet';

const centers = [[0.5, 37.5], [0.1, 34.7], [1.3, 36.7], [-0.4, 36.9], [-1.6, 37.3], [-3.2, 39.6]];

export default function RegionMap({ regions = [], selected, onSelect }) {
  return (
    <div className="map-wrap">
      <MapContainer center={[-0.5, 37.2]} zoom={6} scrollWheelZoom={false} style={{ height: 280 }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {regions.map((region, index) => {
          const [lat, lng] = centers[index % centers.length];
          const positions = [[lat - 0.35, lng - 0.45], [lat - 0.35, lng + 0.45], [lat + 0.35, lng + 0.45], [lat + 0.35, lng - 0.45]];
          return <Polygon key={region.id} pathOptions={{ color: selected === region.id ? '#E8A838' : '#4A7C59' }} positions={positions} eventHandlers={{ click: () => onSelect(region.id) }}><Tooltip>{region.name}</Tooltip></Polygon>;
        })}
      </MapContainer>
    </div>
  );
}
