import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MedicineRow from './MedicineRow.jsx';
import { downloadPDF, getPDFAsBlob, testPDFGeneration } from './pdfGenerator.js';

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
  const [generatingPDF, setGeneratingPDF] = useState(false);

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

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      // Validate form data
      if (!clinicName.trim() || !clientName.trim() || !city.trim()) {
        alert('Please fill in all required fields: Clinic Name, Client Name, and City');
        return;
      }
      
      const validMedicines = rows.filter(medicine => medicine.name.trim() !== '');
      if (validMedicines.length === 0) {
        alert('Please add at least one medicine with a name');
        return;
      }
      
      const orderData = {
        clinicName: clinicName.trim(),
        clientName: clientName.trim(),
        city: city.trim(),
        medicines: validMedicines
      };
      
      console.log('Generating PDF with data:', orderData);
      
      // Test jsPDF first
      console.log('Testing jsPDF...');
      testPDFGeneration();
      console.log('jsPDF test passed, generating order PDF...');
      
      // Generate and download PDF
      downloadPDF(orderData, `order_${clinicName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      alert('PDF generated successfully! 📄');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message || 'Please try again.'}`);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSubmitWithPDF = async (e, includePDF = false) => {
    e.preventDefault();
    setSubmitting(true);
    
    const orderData = {
      clinicName,
      clientName,
      city,
      medicines: rows.map(({ id, ...rest }) => rest).filter(medicine => medicine.name.trim() !== '')
    };

    // Debug logging
    console.log('Sending data to Make.com:', orderData);

    try {
      let requestBody = orderData;
      
      let response;
      
      // If PDF is requested, send as FormData with file
      if (includePDF) {
        try {
          const pdfBlob = getPDFAsBlob(orderData);
          const pdfFilename = `order_${clinicName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
          
          // Create FormData to send file + data
          const formData = new FormData();
          formData.append('clinicName', orderData.clinicName);
          formData.append('clientName', orderData.clientName);
          formData.append('city', orderData.city);
          formData.append('medicines', JSON.stringify(orderData.medicines));
          formData.append('pdfFile', pdfBlob, pdfFilename);
          
          response = await fetch(webhookURL, {
            method: 'POST',
            body: formData // No Content-Type header needed, browser sets it automatically for FormData
          });
        } catch (pdfError) {
          console.error('Error generating PDF for submission:', pdfError);
          alert('Error generating PDF for submission. Submitting without PDF.');
          // Fall back to JSON submission
          response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          });
        }
      } else {
        // Regular JSON submission
        response = await fetch(webhookURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Try to get response text for debugging
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
        alert(`Order submitted successfully${includePDF ? ' with PDF' : ''}! ✨`);
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

  const handleSubmit = (e) => handleSubmitWithPDF(e, false);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          backgroundImage: `url('/back_wallpaper.JPG')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(0px)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
        <motion.form
          className={`glass-form ${isSuccess ? 'animate-pulse-slow' : ''}`}
          style={{ width: '100%', maxWidth: '1200px', padding: '3rem' }}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <h1 className="form-title">Mansoora Homoeo Pharma Order Form</h1>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="clinicName" className="form-label" style={{ display: 'block' }}>
              Clinic Name
            </label>
            <input
              type="text"
              id="clinicName"
              className="form-input"
              placeholder="Enter clinic or doctor name"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="clientName" className="form-label" style={{ display: 'block' }}>
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              className="form-input"
              placeholder="Enter client name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="city" className="form-label" style={{ display: 'block' }}>
              City
            </label>
            <input
              type="text"
              id="city"
              className="form-input"
              placeholder="Enter city name"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </div>

          <div className="table-container">
            <table className="medicine-table">
              <thead>
                <tr>
                  <th className="medicine-name-header">Medicine Name</th>
                  <th className="power-header">Power</th>
                  <th className="pack-size-header">Pack Size</th>
                  <th className="quantity-header">Quantity</th>
                  <th className="action-header" style={{ textAlign: 'center' }}>
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

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            justifyContent: 'flex-end', 
            marginTop: '2rem' 
          }}>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={addRow}
            >
              <span style={{ marginRight: '0.5rem' }}>➕</span>Add Medicine
            </button>
            
            {/* PDF Generation Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexDirection: 'row'
            }}
            className="pdf-buttons-container">
              <button
                type="button"
                className={`btn btn-primary ${generatingPDF ? '' : 'hover:animate-pulse-slow'}`}
                onClick={generatePDF}
                disabled={generatingPDF || !clinicName || !clientName || !city}
                style={{ flex: 1 }}
              >
                {generatingPDF && (
                  <span className="loading-spinner"></span>
                )}
                {generatingPDF ? 'Generating PDF...' : '📄 Generate PDF'}
              </button>
              
              <button 
                type="button"
                className={`btn btn-success ${submitting ? '' : 'hover:animate-pulse-slow'}`} 
                onClick={(e) => handleSubmitWithPDF(e, true)}
                disabled={submitting || !clinicName || !clientName || !city}
                style={{ flex: 1 }}
              >
                {submitting && (
                  <span className="loading-spinner"></span>
                )}
                {submitting ? 'Submitting...' : '📧 Submit with PDF'}
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-success ${submitting ? '' : 'hover:animate-pulse-slow'}`} 
              disabled={submitting || !clinicName || !clientName || !city}
            >
              {submitting && (
                <span className="loading-spinner"></span>
              )}
              {submitting ? 'Submitting Order...' : 'Submit Order Only'}
            </button>
          </div>
        </motion.form>
      </div>
    </>
  );
} 