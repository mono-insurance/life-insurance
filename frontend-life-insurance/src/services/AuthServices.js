import axios from 'axios';
import { errorToast } from '../utils/helper/toast';
import { AxiosError, NotFoundError } from '../utils/errors/APIError';

export const verifyAdmin = async ({ adminId }) => {
    const token = localStorage.getItem('auth');

    if (!token) {
        throw new NotFoundError('Unauthorized access. You are not an admin.');
    }

    try {
        const response = await axios.get(`http://localhost:8080/public/api/auth/verify/admin/${adminId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const verifyAgent = async ({ agentId }) => {
    console.log("agent id is", agentId)
    const token = localStorage.getItem('auth');

    if (!token) {
        throw new NotFoundError('Unauthorized access. You are not an admin.');
    }

    try {
        const response = await axios.get(`http://localhost:8080/public/api/auth/verify/agent/${agentId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getAllStates = async () => {
    return axios.get('http://localhost:8080/public/api/auth/all-states', {
        params: {
            page: 0,
            size: 100,
            direction: 'asc'
        }
    });
};

export const verifyEmployee = async ({ empId }) => {
    const token = localStorage.getItem('auth');

    if (!token) {
        throw new NotFoundError('Unauthorized access. You are not an admin.');
    }

    try {
        const response = await axios.get(`http://localhost:8080/public/api/auth/verify/employee/${empId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}


export const verifyCustomer = async ({ customerId }) => {
    const token = localStorage.getItem('auth');

    if (!token) {
        throw new NotFoundError('Unauthorized access. You are not an admin.');
    }

    try {
        const response = await axios.get(`http://localhost:8080/api/auth/verify/customer/${customerId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}



export const login = async (usernameOrEmail, password) => {
    try {
        const response = await axios.post('http://localhost:8080/public/api/auth/login', {
            usernameOrEmail, password
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;

    }
    catch (error) {
        throw error;
    }
}


export const customerRequestActivation = async (usernameOrEmail, password, customerId) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/auth/request-activation/${customerId}`, {
            usernameOrEmail, password
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;

    }
    catch (error) {
        throw error;
    }
}

export const register = async (formData) => {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data', }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;

    }
    catch (error) {
        throw error;
    }
}
