import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Test function to debug jsPDF
export const testPDFGeneration = () => {
  try {
    console.log('Testing jsPDF import:', jsPDF);
    const doc = new jsPDF();
    console.log('jsPDF instance created:', doc);
    console.log('autoTable available:', typeof doc.autoTable);
    console.log('autoTable function:', autoTable);
    doc.text('Test', 20, 20);
    console.log('Text added successfully');
    return doc;
  } catch (error) {
    console.error('jsPDF test failed:', error);
    throw error;
  }
};

export const generateOrderPDF = (orderData) => {
  try {
    const { clinicName, clientName, city, medicines } = orderData;
    
    // Validate required data
    if (!clinicName || !clientName || !city) {
      throw new Error('Missing required fields: Clinic Name, Client Name, or City');
    }
    
    if (!medicines || medicines.length === 0) {
      throw new Error('No medicines data found');
    }
    
    // Create new PDF document
    const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const headerText = `${clinicName} - ${city} - ${clientName}`;
  doc.text(headerText, 105, 25, { align: 'center' });
  
  // Date line
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
  doc.text(`Date: ${today}`, 105, 35, { align: 'center' });
  
  // Medicines table data
  const tableData = medicines.map((medicine, index) => [
    index + 1, // S. #
    medicine.name || '', // Medicine Name
    medicine.power || '', // Potency
    medicine.packSize || '', // Pack Size
    medicine.quantity || '', // Qty
    '', // Availability (empty for filling)
    '', // Labels (empty for filling)
    '', // Mfg (empty for filling)
  ]);
  
  // Calculate total quantity
  const totalQuantity = medicines.reduce((sum, medicine) => sum + (parseInt(medicine.quantity) || 0), 0);
  
  // Add total row
  tableData.push([
    '', // S. #
    'TOTAL', // Medicine Name
    '', // Potency
    '', // Pack Size
    totalQuantity, // Total Qty
    '', // Availability
    '', // Labels
    '', // Mfg
  ]);
  
  // Medicines table
  autoTable(doc, {
    head: [['S. #', 'Medicine Name', 'Potency', 'Pack Size', 'Qty', 'Availability', 'Labels', 'Mfg']],
    body: tableData,
    startY: 50,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: { top: 1, right: 2, bottom: 1, left: 2 },
      lineWidth: 0.3,
      lineColor: [150, 150, 150],
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: { top: 1, right: 2, bottom: 1, left: 2 },
      lineWidth: 0.3,
      lineColor: [150, 150, 150],
      minCellHeight: 8,
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' }, // S. #
      1: { cellWidth: 45, halign: 'left' }, // Medicine Name
      2: { cellWidth: 18, halign: 'center' }, // Potency
      3: { cellWidth: 20, halign: 'center' }, // Pack Size
      4: { cellWidth: 12, halign: 'center' }, // Qty
      5: { cellWidth: 25, halign: 'center' }, // Availability
      6: { cellWidth: 20, halign: 'center' }, // Labels
      7: { cellWidth: 18, halign: 'center' }, // Mfg
    },
    didParseCell: function (data) {
      // Style the total row differently
      if (data.row.index === tableData.length - 1) { // Last row (total row)
        data.cell.styles.fillColor = [230, 230, 230]; // Light gray background
        data.cell.styles.fontStyle = 'bold';
        if (data.column.index === 1) { // Medicine Name column
          data.cell.styles.halign = 'center';
        }
      }
    },
    margin: { left: 15, right: 15 },
    tableLineWidth: 0.3,
    tableLineColor: [150, 150, 150],
  });
  
  // Signature table
  const signatureStartY = doc.lastAutoTable.finalY + 8;
  
  autoTable(doc, {
    head: [['Prepared By', 'Checked By', 'Manufactured By', 'Received By']],
    body: [['______________________', '______________________', '______________________', '______________________']],
    startY: signatureStartY,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: { top: 2, right: 4, bottom: 2, left: 4 },
      lineWidth: 0.3,
      lineColor: [150, 150, 150],
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.3,
      lineColor: [150, 150, 150],
      minCellHeight: 14,
    },
    columnStyles: {
      0: { cellWidth: 42.5, halign: 'center' },
      1: { cellWidth: 42.5, halign: 'center' },
      2: { cellWidth: 42.5, halign: 'center' },
      3: { cellWidth: 42.5, halign: 'center' },
    },
    margin: { left: 15, right: 15 },
    tableLineWidth: 0.3,
    tableLineColor: [150, 150, 150],
  });
  
  return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadPDF = (orderData, filename = 'order_details.pdf') => {
  try {
    const doc = generateOrderPDF(orderData);
    doc.save(filename);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

export const getPDFAsBlob = (orderData) => {
  try {
    const doc = generateOrderPDF(orderData);
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw error;
  }
};

export const getPDFAsBase64 = (orderData) => {
  try {
    const doc = generateOrderPDF(orderData);
    return doc.output('datauristring'); // Returns data:application/pdf;base64,... string
  } catch (error) {
    console.error('Error generating PDF base64:', error);
    throw error;
  }
}; 