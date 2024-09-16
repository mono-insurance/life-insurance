import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';
import { errorToast } from '../utils/helper/toast';


export const fetchEmployee = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/profile/${aid}`, {
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
export const fetchEmployeeDashboard = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/dashboard`, {
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


export const addNewInsuranceImages = async (pid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/policy/${pid}/upload-policy-image`,
            formData,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const updatePolicy = async (pid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/policy/${pid}`,
            formData,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const updateEmployee = async (eid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/profile`,
            formData,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const deleteCustomer = async (customerId) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/employee/customer/${customerId}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const activateCustomer = async (cid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/activate-customer/${cid}`,
            {}
            ,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const activateAgent = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/activate-agent/${aid}`,
            {},
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const approveDocument = async (did, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/approve-document/${did}`,
            formData,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const downloadDocument = async (did) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/download/${did}`, {
            responseType: 'blob', // Ensure response is treated as binary data
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Create a URL for the file blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element
        const link = document.createElement('a');
        link.href = url;

        // Set the file name if available from the response or default it
        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'default-filename';
        link.setAttribute('download', fileName);

        // Append to the document and trigger a click to start the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading the document:', error);
        throw error;
    }
}

export const getAllActiveAgents = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/active-agents`, {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}

export const getAllInActiveAgents = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/inactive-agents`, {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const getAllActiveCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/active-customers', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const getAllApprovedDocuments = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/document/approved', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const getAllNotApprovedDocuments = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/document/not-approved', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const allRegisteredCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/registered-customers', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}

export const getAllInactiveActiveCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/inactive-customers`, {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const reviewCommissionWithdrawalRequest = async (withdrawalId, isApproved) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/review-commissions/${withdrawalId}/${isApproved}`,
            {},
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const approveCustomerProfile = async (customerId, isApproved) => {
    const token = localStorage.getItem('auth');
    console.log("approveCustomerProfile", token)
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/approve-customer/${customerId}/${isApproved}`,
            {},
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getAllTransactions = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/transactions`,
            {
                params: formData,
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllApprovedCommissions = async (agentId, formData) => {
    const token = localStorage.getItem('auth');
    console.log("in getAllApprovedCommissions ", token)
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/approved-commissions/${agentId}`,
            {
                params: formData,
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const getAllNotApprovedCommissions = async (agentId, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/not-approved-commissions/${agentId}`,
            {
                params: formData,
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}


export const getAllTransactionsByAccountNumber = async (currentPage, itemsPerPage, accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/employee/transaction/account/${accountNumber}`, {
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
        const response = await axios.get(`http://localhost:8080/suraksha/employee/employee/transaction/date`, {
            params: { page: currentPage - 1, size: itemsPerPage, startDate: startDate, endDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const employeeProfileUpdate = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/employee/profile', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export const updateState = async (sid, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/state/${sid}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}
export const updateCity = async (cid, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/city/${cid}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}



export const getAllInactiveCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/inactive-customers', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllStates = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/state', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllCities = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/city', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllInsuranceTypes = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/insurance-type', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllResolvedQueries = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/queries/resolved', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllUnResolvedQueries = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/queries/unresolved', {
            params: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getAllQueriesByCustomer = async (cid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/queries/customer/${cid}`, {
            params: formData,
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
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/accounts/active', {
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
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/accounts/inactive', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}





export const EmployeeProfile = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/profile/${aid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export const getAllCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/customers', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const getCustomerDocument = async (did) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/download/${did}`, {
            responseType: 'blob',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}



export const makeCustomerAccount = async (customerId, updatedFormState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/employee/user/${customerId}`,
            updatedFormState,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const makeAllRequestsCustomerActivate = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/employee/employee/activate/requests/customer', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const activateParticularCustomer = async (customerId) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/employee/users/${customerId}/activate`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}



export const makeAllRequestsAccountActivate = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/employee/employee/activate/requests/account', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}


export const activateParticularAccount = async (accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/employee/accounts/${accountNumber}/activate`, {}, {
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
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/customers/starts-with', {
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
        const response = await axios.get(`http://localhost:8080/suraksha/customer/${id}`, {
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
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/users/starts-with', {
            params: { page: currentPage - 1, size: itemsPerPage, startsWith: firstName },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const deleteAgent = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/employee/agent/${aid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response.data;
    }
    catch (error) {
        throw error;
    }

}