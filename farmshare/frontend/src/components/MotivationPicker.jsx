const motivations = [
  ['benchmarking', 'Regional benchmarking', 'See how your farm compares locally'],
  ['recommendations', 'Personalised recommendations', 'Unlock practical next steps'],
  ['research', 'Contribute to research', 'Help improve agricultural knowledge'],
  ['compliance', 'Compliance requirement', 'Keep records ready for programmes'],
  ['unsure', "I'm not sure", 'Share now and decide later']
];

export default function MotivationPicker({ selected, onSelect }) {
  return (
    <div className="motivation-grid">
      {motivations.map(([value, title, text]) => (
        <button key={value} type="button" className={`motivation-card ${selected === value ? 'selected' : ''}`} onClick={() => onSelect(value)}>
          <strong>{title}</strong>
          <span>{text}</span>
        </button>
      ))}
    </div>
  );
}
