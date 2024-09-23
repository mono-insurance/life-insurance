import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';


export const getListOfAllActivePoliciesByInsuranceType = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy/all/active/${id}`, {
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}
export const formatDateTimeForBackend = (dateStr, isStartDate) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    if (isStartDate) {
        date.setHours(5, 30, 0, 0);
    } else {
        date.setHours(29, 29, 59, 999);
    }

    return date.toISOString().slice(0, 10);
};
export const formatRoleForTable = (data) => {
    return data.content.map(item => {
        let role = "Unknown"; // Default if none of the roles match

        if (item.role.includes("ROLE_ADMIN")) {
            role = "Admin";
        } else if (item.role.includes("ROLE_AGENT")) {
            role = "Agent";
        } else if (item.role.includes("ROLE_CUSTOMER")) {
            role = "Customer";
        } else if (item.role.includes("ROLE_EMPLOYEE")) {
            role = "Employee";
        }

        item.role = role; // Assign the role to the item
        return item;
    });
}
export const covertIdDataIntoTable = (data) => {
    const result = {
        content: [data],
        page: 0,
        size: 1,
        totalElements: 1,
        totalPages: 1,
        last: true
    };

    return result;
}


export const getListOfAllActivePolicies = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy/all/active`, {
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}