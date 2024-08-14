import jsPDF from 'jspdf';

export const generatePDF = (order) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10; // margin from left edge
  const tableWidth = 190; // total width of the table (10 mm margin on each side)
  const columnWidths = [100, 40, 30, 30]; // widths of columns for alignment
  const columnX = [10, 110, 150, 180]; // X positions for columns
  const textX = [10, 110, 150, 180]; // X positions for column text

  // Add title
  doc.setFontSize(18);
  doc.text('Web Crea', pageWidth / 2, 10, { align: 'center' });

  // Add order details
  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, pageWidth / 2, 30, { align: 'center' });
  doc.text(`Customer Name: ${order.nameClient}`, pageWidth / 2, 40, { align: 'center' });
  doc.text(`Date: ${order.dateOrder}`, pageWidth / 2, 50, { align: 'center' });

  // Add table headers
  let y = 60;
  doc.setFontSize(12);
  doc.text('Product', textX[0], y);
  doc.text('Price ($)', textX[1], y, { align: 'right' });
  doc.text('Quantity', textX[2], y, { align: 'right' });
  doc.text('Subtotal ($)', textX[3], y, { align: 'right' });

  // Add table separator
  y += 10;
  doc.line(margin, y, margin + tableWidth, y); // Draw line for table separator

  // Add products
  y += 10;
  order.products.forEach((product, index) => {
    doc.text(product.name, textX[0], y);
    doc.text(`${product.price.toFixed(2)}`, textX[1], y, { align: 'right' });
    doc.text(`${product.quantity}`, textX[2], y, { align: 'right' });
    doc.text(`${(product.price * product.quantity).toFixed(2)}`, textX[3], y, { align: 'right' });
    y += 10;
  });

  // Add total
  const total = order.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  doc.line(margin, y, margin + tableWidth, y); // Draw line for total separator
  y += 10;
  doc.setFontSize(14);
  doc.text('Total:', textX[0], y);
  doc.text(`$${total.toFixed(2)}`, textX[3], y, { align: 'right' });

  // Add footer
  y += 20;
  doc.setFontSize(10);
  doc.text('Thank you for your visit!', pageWidth / 2, y, { align: 'center' });

  // Save the PDF to a blob
  return doc.output('blob');
};
