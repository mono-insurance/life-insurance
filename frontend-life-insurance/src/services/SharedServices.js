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