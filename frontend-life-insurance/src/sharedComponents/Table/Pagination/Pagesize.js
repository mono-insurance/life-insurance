import React, { useContext } from 'react';
import './pagination.scss';
import { PaginationContext } from '../../../context/PaginationContext';

export const Pagesize = ({pageSize, setPageSize }) => {
  // const { itemsPerPage, handleItemsPerPageChange } = useContext(PaginationContext);
    
  const pageSizeOptions = [5, 10, 20, 50, 100];

  return (
    <div className="pagesize-select">
      <select aria-label="Page size selector" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        <option value="" disabled>Select Page Size</option>
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>
  );
};