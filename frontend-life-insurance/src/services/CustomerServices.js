import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';

export const fetchCustomer = async (customerId) => {
    const token = localStorage.getItem('auth');

    try {
        const response = await axios.get(`http://localhost:8080/suraksha/customer/customer/profile/${customerId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }}).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getListOfActiveCitiesByState = async (stateName) => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/city/all/active/state`, {
              params: { stateName }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getListOfActiveCitiesByStateId = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/city/all/active/state/${id}`).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const customerProfileUpdate = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/customer', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const updateCustomerAddress = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/address/address', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const addFeedbackByCustomer = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/feedback/feedback', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const addQueryByCustomer = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/query/query', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllResolvedQueriesByCustomer = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/query/queries/customer/${id}/resolved`, {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllUnresolvedQueriesByCustomer = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/query/queries/customer/${id}/unresolved`, {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const updateQueryByCustomerEnd = async (id, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/query/query/unresolved/${id}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const deleteQueryByCustomer = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/query/query/unresolved/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllPolicyAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/customer/policy-accounts', {
              params: { page: currentPage - 1, size: itemsPerPage, direction: 'desc' },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getPolicyAccountById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/customer/policy-accounts/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getWithdrawalRequestsByPolicyAccountId = async (id, customerId) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/policy-account/${id}/customer/${customerId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const fetchingTransactionsByPolicyAccountId = async (id, currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/transaction/transactions/policy-account/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` },
              params: { page: currentPage - 1, size: itemsPerPage }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const requestForWithdrawalByCustomer = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/withdrawal-request/customer', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllApprovedRequestsByCustomer = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/customer/${id}/approved`, {
            params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updateWithdrawRequestToTrue = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/withdrawal-request/customer/withdraw/${id}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const fetchAllDocumentsByCustomer = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/customer/documents/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}





export const uploadDocumentOfCustomer = async (selectedDocument, uploadedFile, customerId) => {
    const token = localStorage.getItem('auth');
    const formData = new FormData();
    formData.append('documentType', selectedDocument);
    formData.append('file', uploadedFile);

    try {
        const response = await axios.put(
            `http://localhost:8080/suraksha/customer/documents/add-or-update/${customerId}`, 
            formData, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Document upload failed:', error);
        throw error;
    }
};




export const getCustomerApprovedDocuments = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/customer/documents/approved/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const generatePayment = async (requestData) => {  
    const token = localStorage.getItem('auth');
    try {
        console.log(requestData);
        const response = await axios.post('http://localhost:8080/suraksha/payment/sessions', requestData, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});
        
        window.location.href = response.data;
    }
    catch (error) {
        throw error;
    }
}



export const verifyPaymentIntent = async (sessionId) => {  
    const token = localStorage.getItem('auth');
    try {
        console.log(sessionId);
        const response = await axios.post('http://localhost:8080/suraksha/payment/verify', { sessionId }, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});
        
        return response.data;
    }
    catch (error) {
        throw error;
    }
}




export const generateInstallmentPayment = async (requestData) => {  
    const token = localStorage.getItem('auth');
    try {
        console.log(requestData);
        const response = await axios.post('http://localhost:8080/suraksha/payment/installment/sessions', requestData, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});
        
        window.location.href = response.data;
    }
    catch (error) {
        throw error;
    }
}





export const generatePaymentReceipt = async (id) => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/receipt/pdf/${id}`, {
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
