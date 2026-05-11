const fallbackIcons = ['🌾', '🌽', '🌱', '🍅', '🥔', '🫘', '🍊', '🥭', '🥑', '🐄', '🐐', '🐔'];

export default function CropSelector({ crops = [], selected, onSelect }) {
  return (
    <div className="crop-grid">
      {crops.map((crop, index) => (
        <button key={crop.id} className={`crop-tile ${selected === crop.id ? 'selected' : ''}`} onClick={() => onSelect(crop.id)} type="button">
          <span className="crop-emoji">{fallbackIcons[index % fallbackIcons.length]}</span>
          <strong>{crop.name}</strong>
          <small>{crop.category}</small>
        </button>
      ))}
    </div>
  );
}
