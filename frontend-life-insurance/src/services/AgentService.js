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
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while fetching agent");
    }
}
export const generateAllAccountReceipts = async (formData, format) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/policy-accounts/download/${format}`, {
            params: formData,
            headers: {

                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob',
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while generate All Account Receipts");
    }
}
export const generateAllTransactionsReceipts = async (formData, format) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/transactions/download/${format}`, {
            params: formData,
            headers: {

                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob',
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while generateAllTransactionsReceipts");
    }
}
export const generateAllCustomersReceipts = async (formData, format) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/customer/download/${format}`, {
            params: formData,
            headers: {

                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob',
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while generateAllCustomersReceipts");
    }
}
export const generateAllAgentsReceipts = async (formData, format) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/agent/download/${format}`, {
            params: formData,
            headers: {

                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob',
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while generateAllAgentsReceipts");
    }
}

export const generateAllWithdrawalsReceipts = async (formData, format) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/withdrawal/download/${format}`, {
            params: formData,
            headers: {

                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob',
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while generateAllWithdrawalsReceipts");
    }
}



export const updateAgent = async (agentId, editAgent) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/agent/update`, editAgent, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while update Agent");
    }
}
export const fetchAgentDashboard = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while fetch Agent Dashboard");
    }

}



export const getAllTransactions = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/transactions`, {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Transactions");
    }
}
export const getAllAccounts = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/policy-accounts`, {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Accounts");
    }
}
export const fetchCustomer = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/customer/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while fetch Customer");
    }
}


export const getAllTransactionsByAccountNumber = async (currentPage, itemsPerPage, accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/transaction/account/${accountNumber}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Transactions By Account Number");
    }

}


export const getAllTransactionsByDate = async (currentPage, itemsPerPage, startDate, endDate) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/transaction/date`, {
            params: { page: currentPage - 1, size: itemsPerPage, startDate: startDate, endDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Transactions By Date");
    }

}


export const adminProfileUpdate = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while admin Profile Update");
    }

}


export const getAllActiveCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users/active', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Active Customers");
    }

}


export const getAllInactiveCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users/inactive', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Inactive Customers");
    }

}




export const makeCustomersInactive = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/users/inactive', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while makeCustomersInactive");
    }

}



export const getAllActiveAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/accounts/active', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getAllActiveAccounts");
    }

}


export const getAllInactiveAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/accounts/inactive', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getAllInactiveAccounts");
    }

}




export const makeAccountsInactive = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/user/inactive/accounts', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while makeAccountsInactive");
    }

}


export const getAllUsers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getAllUsers");
    }

}


export const getSystemStats = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/profile/${aid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getSystemStats");
    }

}

export const getAllCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/customers', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Customers");
    }
}
export const getAllPolicies = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/policy', {

            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getAllPolicies");
    }
}
export const sendEmail = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/agent/send-email', formData,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while sending Email");
    }
}

export const requestWithdrawal = async (withdrawalAmount) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/agent/commission-withdrawal-request', {},
            {
                params: { agentCommission: withdrawalAmount },
                headers: { 'Authorization': `Bearer ${token}` }
            })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while request Withdrawal");
    }
}
export const getAgentBalance = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/balance',
            {
                headers: { 'Authorization': `Bearer ${token}` }
            })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getAgentBalance");
    }
}


export const getCustomerDocument = async (customerId, documentType) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/files/user/${customerId}/${documentType}`, {
            responseType: 'blob',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get Customer Document");
    }
}





export const getAllCustomersByCharacters = async (currentPage, itemsPerPage, firstName) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/customers/starts-with', {
            params: { page: currentPage - 1, size: itemsPerPage, startsWith: firstName },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get AllCustomers By Characters");
    }

}


export const getCustomerById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/customer/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getCustomerById");
    }
}

export const getDocumentById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/customer/document/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while fetching document");
    }

}


export const getAllUsersByCharacters = async (currentPage, itemsPerPage, firstName) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/api/admin/users/starts-with', {
            params: { page: currentPage - 1, size: itemsPerPage, startsWith: firstName },
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while get All Users By Characters");
    }

}


export const getUserById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while getUserById");
    }

}


export const deleteUser = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/api/admin/user/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while delete User");
    }

}