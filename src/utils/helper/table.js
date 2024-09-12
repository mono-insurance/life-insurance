import React from 'react';
import { MdOutlineDelete } from 'react-icons/md';

export const sanitizeTableData = (data, keysToBeIncluded, includeButton, handleButtonClick) => {

    const findKeyInObject = (obj, key) => {
        if (!obj || typeof obj !== 'object') return undefined;

        if (key in obj) return obj[key];

        for (let subKey in obj) {
            if (typeof obj[subKey] === 'object') {
                const result = findKeyInObject(obj[subKey], key);
                if (result !== undefined) return result;
            }
        }

        return undefined;
    };

    return data.map((item) => {
        const sanitizedItem = {};

        keysToBeIncluded.forEach((key) => {
            let value = findKeyInObject(item, key);

            if (typeof value === 'boolean') {
                value = JSON.stringify(value);
            }

            if (value !== undefined) {
                sanitizedItem[key] = value;
            } else {
                sanitizedItem[key] = '';
            }
        });

        if (includeButton) {
            sanitizedItem['Action'] = (
                <button onClick={() => handleButtonClick(item)} className="edit-button large-icon" style={{ justifyContent: 'center' }}>
                    <MdOutlineDelete color='var(--primary-color)'/>
                </button>
            );
        }
        return sanitizedItem;
    });
};
