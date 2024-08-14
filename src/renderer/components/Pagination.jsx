import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`page-item ${number === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(number)}
        >
          {number + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
