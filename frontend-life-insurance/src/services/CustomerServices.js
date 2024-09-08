import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';

export const fetchCustomer = async () => {
    const token = localStorage.getItem('auth');

    try {
        const response = await axios.get("http://localhost:8080/api/customer", {
        headers: {
            'Authorization': `Bearer ${token}`
        }}).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}

export const fetchCustomerAccounts = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/customer/all/accounts', {
        headers: {
            'Authorization': `Bearer ${token}`
        }}).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const customerProfileUpdate = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/customer', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getPassbook = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/customer/transactions', {
                params: { page: currentPage - 1, size: itemsPerPage, sortBy: "transactionDate", direction: "desc" },
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => {throw new AxiosError(error.response.data.message)});


        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const passbookDownload = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/customer/passbook/download', {
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob',
            }).catch((error) => {throw new AxiosError(error.response.data.message)});


        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const makeTransactions = async (data) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/api/customer/transaction/new', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => {throw new AxiosError(error.response.data.message)});


        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getBalanceAndAccounts = async(currentPage, itemsPerPage)=> {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/customer/balance', {
                params: { page: currentPage - 1, size: itemsPerPage },
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const accountRequestActivation = async (selectedAccount) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/api/customer/request-activation/${selectedAccount}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});
        
        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getPassbookByDates = async (currentPage, itemsPerPage, startDate, endDate) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/customer/transactions/date', {
                params: { page: currentPage - 1, size: itemsPerPage, sortBy: "transactionDate", direction: "desc", startDate: startDate, endDate: endDate },
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => {throw new AxiosError(error.response.data.message)});


        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getPassbookByAccountNumber = async (currentPage, itemsPerPage, accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/customer/transactions/${accountNumber}`, {
                params: { page: currentPage - 1, size: itemsPerPage, sortBy: "transactionDate", direction: "desc" },
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => {throw new AxiosError(error.response.data.message)});


        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const passbookDownloadByDates = async (startDate, endDate) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/customer/passbook/date/download', {
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob',
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            }).catch((error) => {throw new AxiosError(error.response.data.message)});


        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const passbookDownloadByAccountNumber = async (accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/customer/passbook/download/${accountNumber}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob',
            }).catch((error) => {throw new AxiosError(error.response.data.message)});


        return response.data;
    } 
    catch (error) {
        throw error;
    }

}
