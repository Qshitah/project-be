import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import orderList from '../data/orders.json';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function CommandeDetail() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const order = orderList.find((o) => o.id === parseInt(id));
    setOrder(order);
  }, [id]);

  return (
    <React.Fragment>
      <div className="ec-content-wrapper">
        <div className="content">
          <div className="breadcrumb-wrapper breadcrumb-wrapper-2">
            <h1>Order Detail</h1>
          </div>

          {order && (
            <div className="row">
              <div className="col-12">
                <div className="ec-odr-dtl card card-default">
                  <div className="card-header card-header-border-bottom d-flex justify-content-between">
                    <h2 className="ec-odr">
                      <span className="small">Order ID: #00{order.id}</span>
                    </h2>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-xl-3 col-lg-6">
                        <address className="info-grid">
                          <div className="info-title">
                            <strong>Client:</strong>
                          </div>
                          <br />
                          <div className="info-content">{order.nameClient}</div>
                        </address>
                      </div>
                      <div className="col-xl-3 col-lg-6">
                        <address className="info-grid">
                          <div className="info-title">
                            <strong>Commande Date:</strong>
                          </div>
                          <br />
                          <div className="info-content">{order.dateOrder}</div>
                        </address>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <h3 className="tbl-title">Products</h3>
                        <div className="table-responsive">
                          <table
                            className="table table-striped o-tbl"
                            style={{ width: '100%', textAlign: 'center' }}
                          >
                            <thead>
                              <tr className="line">
                                <td>
                                  <strong>#</strong>
                                </td>
                                <td className="text-center">
                                  <strong>PRODUIT</strong>
                                </td>
                                <td className="text-center">
                                  <strong>PRIX/UNITÉ</strong>
                                </td>
                                <td className="text-center">
                                  <strong>QUANTITÉ</strong>
                                </td>
                                <td className="text-center">
                                  <strong>SOUS-TOTAL</strong>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.length > 0 &&
                                order.products.map((product, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <strong>{product.name}</strong>
                                    </td>
                                    <td className="text-center">
                                      ${product.price}
                                    </td>
                                    <td className="text-center">
                                      {product.quantity}
                                    </td>
                                    <td className="text-center">
                                      ${product.price * product.quantity}
                                    </td>
                                  </tr>
                                ))}
                              <tr>
                                <td colSpan="3"></td>
                                <td className="text-right">
                                  <strong style={{ fontWeight: 'bold', fontSize: '20px', color: 'black' }}>Total</strong>
                                </td>
                                <td className="text-right">
                                  <strong style={{ fontWeight: 'bold', fontSize: '20px', color: 'black' }}>
                                    ${order.products.reduce(
                                      (total, product) =>
                                        total +
                                        product.price * product.quantity,
                                      0,
                                    )}{' '}

                                  </strong>
                                </td>
                              </tr>

                              <tr></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
          type="button"
          onClick={() => navigate('/')}
          className="btn btn-danger"
          style={{
            borderRadius: '50%',
            marginTop: '10px',
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
          }}
        >
          <FaArrowLeft />
        </button>
        </div>

      </div>
    </React.Fragment>
  );
}
