import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MedicineRow from './MedicineRow.jsx';

const webhookURL = 'https://hook.eu2.make.com/ti8xjyr5wxliv20yvkd9yevlg2xtani1'; // TODO: replace with your Make.com webhook URL

export default function App() {
  const [clinicName, setClinicName] = useState('');
  const [clientName, setClientName] = useState('');
  const [city, setCity] = useState('');
  const [rows, setRows] = useState([
    { id: Date.now(), name: '', power: '', packSize: '', quantity: 1 }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addRow = () => {
    setRows(prev => [
      ...prev,
      { id: Date.now() + Math.random(), name: '', power: '', packSize: '', quantity: 1 }
    ]);
  };

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeRow = id => {
    if (rows.length === 1) return; // keep at least one row
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    
    const orderData = {
      clinicName,
      clientName,
      city,
      medicines: rows.map(({ id, ...rest }) => rest)
    };

    // Debug logging
    console.log('Sending data to Make.com:', orderData);

    try {
      const response = await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Try to get response text for debugging
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
        alert('Order submitted successfully! ✨');
        // reset form
        setClinicName('');
        setClientName('');
        setCity('');
        setRows([{ id: Date.now(), name: '', power: '', packSize: '', quantity: 1 }]);
      } else {
        alert(`Error submitting order! Status: ${response.status}\nResponse: ${responseText}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Network error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="wallpaper-overlay"></div>
      <div className="d-flex justify-content-center py-5">
        <motion.form
          id="orderForm"
          className={isSuccess ? 'success-animation' : ''}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <h1 className="form-title">Mansoora Homoeo Pharma Order Form</h1>
          </div>

          <div className="mb-4">
            <label htmlFor="clinicName" className="form-label">
              Clinic Name
            </label>
            <input
              type="text"
              id="clinicName"
              className="form-control"
              placeholder="Enter clinic or doctor name"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="clientName" className="form-label">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              className="form-control"
              placeholder="Enter client name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              id="city"
              className="form-control"
              placeholder="Enter city name"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </div>

          <div className="table-responsive" style={{ overflow: 'visible' }}>
            <table className="table align-middle" id="medicineTable">
              <thead>
                <tr>
                  <th style={{ width: 200 }}>Medicine Name</th>
                  <th style={{ width: 120 }}>Power</th>
                  <th style={{ width: 110 }}>Pack Size</th>
                  <th style={{ width: 120 }}>Quantity</th>
                  <th style={{ width: 80 }} className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map(row => (
                    <MedicineRow
                      key={row.id}
                      row={row}
                      onChange={updateRow}
                      onRemove={removeRow}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-md-row gap-2 justify-content-end mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={addRow}
            >
              <span className="me-1">➕</span>Add Medicine
            </button>
            <button 
              type="submit" 
              className={`btn btn-success ${submitting ? '' : 'pulse-on-hover'}`} 
              disabled={submitting}
            >
              {submitting && (
                <span className="loading-spinner"></span>
              )}
              {submitting ? 'Submitting Order...' : 'Submit Order'}
            </button>
          </div>
        </motion.form>
      </div>
    </>
  );
} 