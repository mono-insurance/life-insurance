import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';
import { errorToast } from '../utils/helper/toast';



export const fetchAdmin = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin', {
        headers: {
            'Authorization': `Bearer ${token}`
        }}).catch((error) => {throw new AxiosError(error.response.data.message)});

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
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
            params: { page: currentPage - 1, size: itemsPerPage , startDate: startDate, endDate: endDate},
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const makeCustomersInactive = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/users/inactive',{}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const makeAccountsInactive = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/user/inactive/accounts',{}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
            }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getSystemStats = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/counts', {
              headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}

export const getAllCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/customers', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const makeAnotherAdmin = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/api/admin/user-admin', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const makeCustomerAccount = async (customerId, updatedFormState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/api/admin/user/${customerId}`, updatedFormState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const makeAllRequestsCustomerActivate = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/activate/requests/customer',{}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const activateParticularCustomer = async (customerId) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/api/admin/users/${customerId}/activate`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const makeAllRequestsAccountActivate = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/activate/requests/account',{}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const activateParticularAccount = async (accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/api/admin/accounts/${accountNumber}/activate`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

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
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}