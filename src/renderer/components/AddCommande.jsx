import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

export default function AddCommande() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameClient: '',
    dateOrder: new Date().toISOString().slice(0, 10),
    products: [
      {
        name: '',
        price: 0,
        quantity: 0,
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    name: '',
    message: '',
  });

  const handleProductsChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = field === 'price' ? parseFloat(value) : (field === 'quantity' ? parseInt(value) : value) ;
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError({ name: '', message: '' });

    if (formData.dateOrder.trim() === '') {
      return setError({ name: 'dateOrder', message: 'Date Order is required' });
    }

    if (formData.nameClient.trim() === '') {
      return setError({
        name: 'nameClient',
        message: 'Name Client is required',
      });
    }

    if (formData.products.length === 0) {
      return setError({ name: 'products', message: 'Products is required' });
    }

    let error = false;

    formData.products.forEach((product, index) => {
      if (product.name.trim() === '') {
        error = true;
        return setError({
          name: `products.${index}.name`,
          message: 'Products name is required',
        });
      }

      if (product.price <= 0) {
        error = true;
        return setError({
          name: `products.${index}.price`,
          message: 'Products price is required',
        });
      }

      if (product.quantity <= 0) {
        error = true;
        return setError({
          name: `products.${index}.quantity`,
          message: 'Products quantity is required',
        });
      }
    });

    if(error) return

    setLoading(true);

    setTimeout(() => {
      window.electron.saveOrder({
        ...formData,
        dateOrder: new Date().toISOString(),
      });
      window.electron.onOrderSaved((newOrder) => {
        console.log('Order saved:', newOrder);

        window.electron
          .savePDF(newOrder)
          .then((filePath) => {
            console.log('PDF saved at:', filePath);
            setLoading(false);
            navigate('/'); // Navigate or show a success message
          })
          .catch((error) => {
            console.error('Error saving PDF:', error);
            setLoading(false);
          });
      });
    }, 2000);
  };

  return (
    <div className="wrapper">
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <ReactLoading type="spin" color="#fff" height={100} width={100} />
        </div>
      )}
      <div className="ec-page-wrapper">
        <div className="ec-content-wrapper">
          <div className="content">
            <div className="ec-cat-form">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="nameClient">Name Client</label>
                      <input
                        type="text"
                        style={{ backgroundColor: 'white' }}
                        className="form-control"
                        placeholder="Name Client"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nameClient: e.target.value,
                          })
                        }
                        value={formData.nameClient}
                      />
                      {error.name === 'nameClient' && (
                        <p className="text-danger">{error.message}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="dateOrder">Date Order</label>
                      <input
                        type="date"
                        className="form-control"
                        style={{ backgroundColor: 'white' }}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOrder: e.target.value,
                          })
                        }
                        value={formData.dateOrder}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card card-default">
                      <div className="card-body">
                        <div className="table-responsive">
                          <table
                            id="responsive-data-table"
                            className="table"
                            style={{ width: '100%', textAlign: 'center' }}
                          >
                            <thead>
                              <tr>
                                <th>Name Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>SubTotal</th>
                                <th>Acción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.products.map((produit, index) => (
                                <tr key={index}>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Name Product"
                                      onChange={(e) =>
                                        handleProductsChange(
                                          index,
                                          'name',
                                          e.target.value,
                                        )
                                      }
                                      value={produit.name}
                                    />
                                    {error.name ===
                                      `products.${index}.name` && (
                                      <p className="text-danger">
                                        {error.message}
                                      </p>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Price"
                                      onChange={(e) =>
                                        handleProductsChange(
                                          index,
                                          'price',
                                          e.target.value,
                                        )
                                      }
                                      value={produit.price}
                                    />
                                    {error.name ===
                                      `products.${index}.price` && (
                                      <p className="text-danger">
                                        {error.message}
                                      </p>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Quantity"
                                      onChange={(e) =>
                                        handleProductsChange(
                                          index,
                                          'quantity',
                                          e.target.value,
                                        )
                                      }
                                      value={produit.quantity}
                                    />
                                    {error.name ===
                                      `products.${index}.quantity` && (
                                      <p className="text-danger">
                                        {error.message}
                                      </p>
                                    )}
                                  </td>
                                  <td>${produit.price * produit.quantity}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={() =>
                                        setFormData({
                                          ...formData,
                                          products: formData.products.filter(
                                            (_, i) => i !== index,
                                          ),
                                        })
                                      }
                                    >
                                      Supprimer
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan="3" />
                                <td className="text-right">
                                  <strong>Total</strong>
                                </td>
                                <td className="text-right">
                                  <strong>
                                  ${formData.products.reduce(
                                      (total, produit) =>
                                        total +
                                        produit.price * produit.quantity,
                                      0,
                                    )}{' '}

                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="4" />
                                <td colSpan="2" />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-12"
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginTop: '25px',
                    gap: '15px',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        products: [
                          ...formData.products,
                          { name: '', price: 0, quantity: 0 },
                        ],
                      })
                    }
                  >
                    Add Product
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Order and Print
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
