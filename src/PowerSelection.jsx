const POWER_OPTIONS = ['30', '200', '1M', '10M', '50M', 'CM', 'Ø'];

export default function PowerSelection({ value, onChange, required = false }) {
  const handlePowerChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      className="form-select"
      value={value || ''}
      onChange={handlePowerChange}
      required={required}
    >
      <option value="">Select Power</option>
      {POWER_OPTIONS.map((power) => (
        <option key={power} value={power}>
          {power}
        </option>
      ))}
    </select>
  );
} 