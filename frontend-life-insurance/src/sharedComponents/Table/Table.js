import React from 'react';
import { Pagination } from './Pagination/Pagination';
import './table.scss';
import { sanitizeTableData } from '../../utils/helper/table';
import { errorToast } from '../../utils/helper/toast';

function camelToTitle(camelCase) {
    return camelCase
      .replace(/([A-Z])/g, match => ` ${match}`)
      .replace(/^./, match => match.toUpperCase());
  }

export const Table = ({ data, keysToBeIncluded, includeButton, currentPage, pageSize, setPage, setPageSize, handleButtonClick, showPagination = true}) => {
    let tableHeaders;
    let rows;
    let sanitizedData = {};
    try {
        sanitizedData = sanitizeTableData(Array.isArray(data.content) ? data.content : [], keysToBeIncluded, includeButton, handleButtonClick);
        

        if (Array.isArray(sanitizedData) && sanitizedData.length > 0) {
            tableHeaders = Object.keys(sanitizedData[0]).map((key, index) => (
                <th key={index} className={key === 'Action' ? 'center-align' : ''}>
                    {camelToTitle(key)}
                </th>
            ));

            rows = sanitizedData.map((d, rowIndex) => (
                <tr key={rowIndex}>
                    {Object.keys(d).map((k, colIndex) => (
                        <td key={colIndex}>{d[k]}</td>
                    ))}
                </tr>
            ));
        }

    } catch (error) {
        errorToast('Error displaying data');
    }

    return (
        <>
            {sanitizedData.length !== 0 && (
                <table className="table">
                    <thead>
                        <tr>{tableHeaders}</tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            )}
            {showPagination && (
                <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                    noOfPages={data.totalPages}
                    noOfElements={data.totalElements}
                />
            )}
        </>
    );
};

