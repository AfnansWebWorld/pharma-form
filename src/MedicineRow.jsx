import { motion } from 'framer-motion';
import MedicineAutocomplete from './MedicineAutocomplete.jsx';
import PowerSelection from './PowerSelection.jsx';
import PackSizeSelection from './PackSizeSelection.jsx';

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

export default function MedicineRow({ row, onChange, onRemove }) {
  const { id, name, power, quantity, packSize } = row;

  const handleChange = (field) => (e) => {
    onChange(id, field, field === 'quantity' ? Number(e.target.value) : e.target.value);
  };

  return (
    <motion.tr
      layout
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.25 }}
      className="medicine-row"
    >
      {/* Medicine Name - Full width on mobile, responsive on desktop */}
      <td className="medicine-name-cell">
        <div className="medicine-input-wrapper">
        <MedicineAutocomplete
          value={name}
          onChange={(value) => onChange(id, 'name', value)}
          required
        />
        </div>
      </td>
      
      {/* Power - Responsive width */}
      <td className="power-cell">
        <div className="power-input-wrapper">
        <PowerSelection
          value={power}
          onChange={(value) => onChange(id, 'power', value)}
          required
        />
        </div>
      </td>
      
      {/* Pack Size - Responsive width */}
      <td className="pack-size-cell">
        <div className="pack-size-input-wrapper">
        <PackSizeSelection
          value={packSize}
          onChange={(value) => onChange(id, 'packSize', value)}
          required
        />
        </div>
      </td>
      
      {/* Quantity - Responsive width */}
      <td className="quantity-cell">
        <div className="quantity-input-wrapper">
        <input
            className="form-input quantity-input"
            style={{ textAlign: 'center', fontWeight: '600' }}
          type="number"
          min="1"
          value={quantity}
          onChange={handleChange('quantity')}
          required
            aria-label="Quantity"
        />
        </div>
      </td>
      
      {/* Action Button - Responsive width */}
      <td className="action-cell" style={{ textAlign: 'center' }}>
        <div className="action-button-wrapper">
        <button
          type="button"
            className="btn btn-sm btn-danger remove-btn"
          onClick={() => onRemove(id)}
            aria-label="Remove medicine"
            title="Remove medicine"
        >
            <span className="remove-icon">&times;</span>
        </button>
        </div>
      </td>
    </motion.tr>
  );
} 