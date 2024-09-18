import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';
import { errorToast } from '../utils/helper/toast';



export const fetchAgent = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/profile/${aid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const updateAgent = async (agentId, editAgent) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/agent/update`, editAgent, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const fetchAgentDashboard = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}



export const getAllTransactions = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/transaction`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getAllTransactionsByAccountNumber = async (currentPage, itemsPerPage, accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/transaction/account/${accountNumber}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getAllTransactionsByDate = async (currentPage, itemsPerPage, startDate, endDate) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/transaction/date`, {
            params: { page: currentPage - 1, size: itemsPerPage, startDate: startDate, endDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const adminProfileUpdate = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getAllActiveCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users/active', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getAllInactiveCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users/inactive', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}




export const makeCustomersInactive = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/users/inactive', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}



export const getAllActiveAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/accounts/active', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getAllInactiveAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/accounts/inactive', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}




export const makeAccountsInactive = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/user/inactive/accounts', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getAllUsers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getSystemStats = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/profile/${aid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export const getAllCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/customers', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllPolicies = async () => {
    try {
        const response = await axios.get('http://localhost:8080/suraksha/policy', {

        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const sendEmail = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/agent/send-email', formData,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const requestWithdrawal = async (withdrawalAmount) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/agent/commission-withdrawal-request', {},
            {
                params: { agentCommission: withdrawalAmount },
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAgentBalance = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/balance',
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getCustomerDocument = async (customerId, documentType) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/files/user/${customerId}/${documentType}`, {
            responseType: 'blob',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}





export const getAllCustomersByCharacters = async (currentPage, itemsPerPage, firstName) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/customers/starts-with', {
            params: { page: currentPage - 1, size: itemsPerPage, startsWith: firstName },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getCustomerById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/customer/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getAllUsersByCharacters = async (currentPage, itemsPerPage, firstName) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users/starts-with', {
            params: { page: currentPage - 1, size: itemsPerPage, startsWith: firstName },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getUserById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const deleteUser = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/user/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}