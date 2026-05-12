const cropIcons = {
  'Wheat': '🌾',
  'Maize': '🌽',
  'Rice': '🌱',
  'Tomatoes': '🍅',
  'Potatoes': '🥔',
  'Beans': '🫘',
  'Citrus': '🍊',
  'Mango': '🥭',
  'Avocado': '🥑',
  'Dairy Cattle': '🐄',
  'Goats': '🐐',
  'Poultry': '🐔'
};

export default function CropSelector({ crops = [], selected, onSelect }) {
  return (
    <div className="crop-grid">
      {crops.map((crop) => (
        <button key={crop.id} className={`crop-tile ${selected === crop.id ? 'selected' : ''}`} onClick={() => onSelect(crop.id)} type="button">
          <span className="crop-emoji">{cropIcons[crop.name] || '🌿'}</span>
          <strong>{crop.name}</strong>
          <small>{crop.category}</small>
        </button>
      ))}
    </div>
  );
}
