const PACK_SIZE_OPTIONS = ['30ML', '120ML', '500ML'];

export default function PackSizeSelection({ value, onChange, required = false }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      className="form-select"
      value={value || ''}
      onChange={handleChange}
      required={required}
    >
      <option value="">Select Pack Size</option>
      {PACK_SIZE_OPTIONS.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  );
} 