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

export const Table = ({ data, keysToBeIncluded, includeButton, handleButtonClick, showPagination = true, handleRowClicked }) => {
    let tableHeaders;
    let rows;
    let sanitizedData = {};
    try {
        sanitizedData = sanitizeTableData(Array.isArray(data.content) ? data.content : [], keysToBeIncluded, includeButton, handleButtonClick);

        if (Array.isArray(sanitizedData) && sanitizedData.length > 0) {
            tableHeaders = Object.keys(sanitizedData[0]).map((k, index) => (
                <th key={index}>{camelToTitle(k)}</th>
            ));

            rows = sanitizedData.map((d, rowIndex) => (
                <tr key={rowIndex} onClick={() => handleRowClicked(d)}>
                    {Object.keys(d).map((k, colIndex) => (
                        <td key={colIndex}>{d[k]}</td>
                    ))}
                    {/* Add button to the last column of each row */}
                    <td>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the row click event
                                handleRowClicked(d); // Call the button click handler
                            }}
                        >
                            Click
                        </button>
                    </td>
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
                    noOfPages={data.totalPages}
                    noOfElements={data.totalElements}
                />
            )}
        </>
    );
};

