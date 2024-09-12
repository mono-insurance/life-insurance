import React, { useContext } from 'react';
import { Pagesize } from './Pagesize';
import './pagination.scss';
import { PaginationContext } from '../../../context/PaginationContext';

export const Pagination = ({ noOfPages, noOfElements}) => {
  const { currentPage, handlePageChange } = useContext(PaginationContext);
    if (currentPage > noOfPages) {
      handlePageChange(noOfPages > 1 ? noOfPages : 1);
      }
      
  const handleClick = (page) => {
    handlePageChange(page);
  };

  const pageNumber = [];
  for (let index = 1; index <= noOfPages; index++) {
    pageNumber.push(index);
  }

  return (
    <div className="pagination-container">
      <Pagesize noOfElements={noOfElements} />
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {pageNumber.map(p => (
            <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
              <a className="page-link" onClick={(e) => {
                e.preventDefault();
                handleClick(p);
              }}>
                {p}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};