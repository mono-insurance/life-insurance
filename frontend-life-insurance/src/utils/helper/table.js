import React from 'react';
import { TableAction } from '../../sharedComponents/Table/TableAction/TableAction';

export const sanitizeTableData = (data, keysToBeIncluded, includeButton, handleButtonClick) => {

    const possibleIdFields = ['requestsId', 'feedbackId', 'queryId', 'policyAccountId', 'customerId', 'agentId', 'employeeId', 'cityId', 'stateId', 'policyId', 'typeId', 'id'];

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

    const getId = (item) => {
        for (const idField of possibleIdFields) {
            if (item[idField]) {
                return item[idField];
            }
        }
        return null;
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
            const id = getId(item);
            sanitizedItem['Action'] = <TableAction actions={handleButtonClick(id)} />;
        }
        return sanitizedItem;
    });
};
