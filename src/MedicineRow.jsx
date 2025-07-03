import { motion } from 'framer-motion';
import MedicineAutocomplete from './MedicineAutocomplete.jsx';
import PowerSelection from './PowerSelection.jsx';

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

export default function MedicineRow({ row, onChange, onRemove }) {
  const { id, name, power, quantity } = row;

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
    >
      <td>
        <MedicineAutocomplete
          value={name}
          onChange={(value) => onChange(id, 'name', value)}
          required
        />
      </td>
      <td>
        <PowerSelection
          value={power}
          onChange={(value) => onChange(id, 'power', value)}
          required
        />
      </td>
      <td>
        <input
          className="form-control"
          type="number"
          min="1"
          value={quantity}
          onChange={handleChange('quantity')}
          required
        />
      </td>
      <td className="text-center">
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => onRemove(id)}
        >
          &times;
        </button>
      </td>
    </motion.tr>
  );
} 