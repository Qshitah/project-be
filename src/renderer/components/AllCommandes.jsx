import React, { useState } from 'react';
import Pagination from './Pagination';
import orderList from '../data/orders.json';
import { useNavigate } from 'react-router-dom';

const ORDERS_PER_PAGE = 10;
export default function AllCommandes() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the total number of pages
  const totalPages = Math.ceil(orderList.length / ORDERS_PER_PAGE);

  // Calculate the orders to display on the current page
  const paginatedOrders = orderList
    .sort((a, b) => b.id - a.id)
    .slice(currentPage * ORDERS_PER_PAGE, (currentPage + 1) * ORDERS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <React.Fragment>
      <div className="ec-content-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-end align-items-center">
                <button
                  type="button"
                  onClick={() => navigate('/addOrder')}
                  className="btn btn-primary"
                  style={{
                    marginBottom: '10px',
                  }}

                >
                  Add Order
                </button>
              </div>
            </div>
            <div className="col-12">
              <div className="card card-default">
                <div
                  className="card-body"
                  style={{
                    boxShadow:
                      'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                    borderRadius: '10px',
                  }}
                >
                  <div className="table-responsive">
                    <table
                      id="responsive-data-table"
                      className="table"
                      style={{ width: '100%', textAlign: 'center' }}
                    >
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name Client</th>
                          <th>Date Order</th>
                          <th>Total Price</th>
                          <th>Acción</th>
                          <th>Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.sort((a, b) => b.id - a.id).map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.nameClient}</td>
                            <td>{order.dateOrder}</td>
                            <td>
                              ${order.products.reduce(
                                (total, product) =>
                                  total + product.price * product.quantity,
                                0,
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/order/${order.id}`)}
                              >
                                Details
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  window.electron.deleteOrder(order.id);
                                  window.electron.onOrderDeleted(() => {
                                    navigate('/');
                                  });
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                       currentPage={currentPage}
                       totalPages={totalPages}
                       onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
