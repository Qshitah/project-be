import React from 'react';

const PrintTemplate = ({ order }) => {
  return (
    <div style={{ width: '80mm', padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Receipt</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Name:</strong> {order.nameClient}</p>
      <p><strong>Date:</strong> {order.dateOrder}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>Product</th>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'right' }}>Price</th>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'right' }}>Qty</th>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td style={{ textAlign: 'right' }}>{product.price.toFixed(2)} Dh</td>
              <td style={{ textAlign: 'right' }}>{product.quantity}</td>
              <td style={{ textAlign: 'right' }}>{(product.price * product.quantity).toFixed(2)} Dh</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
              {order.products.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)} Dh
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintTemplate;
