import { createContext, useState } from "react";
import { PropTypes } from "prop-types";

export const PaginationContext = createContext({});

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
  };

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        handlePageChange,
        itemsPerPage,
        handleItemsPerPageChange,
        resetPagination,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
}

PaginationProvider.propTypes = {
  children: PropTypes.node,
};