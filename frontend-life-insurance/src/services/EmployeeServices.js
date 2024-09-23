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
        else errorToast("error while fetching employee");
    }
}
export const fetchEmployeeDashboard = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/dashboard`, {
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
        else errorToast("error while fetching employee dashboard");
    }
}


export const addNewInsuranceImages = async (pid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/policy/${pid}/upload-policy-image`,
            formData,
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
        else errorToast("error while adding new image");
    }
}

export const updatePolicy = async (pid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/policy/${pid}`,
            formData,
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
        else errorToast("error while updating policy");
    }
}

export const updateEmployee = async (eid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/profile`,
            formData,
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
        else errorToast("error while updating employee");
    }
}

export const deleteCustomer = async (customerId) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/employee/customer/${customerId}`,
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
        else errorToast("error while deleting customer");
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
        else errorToast("error while activating customer");
    }
}
export const activateAgent = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/activate-agent/${aid}`,
            {},
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
        else errorToast("error while activating agent");
    }
}

export const approveDocument = async (did, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/approve-document/${did}`,
            {},
            {
                params: { isApproved: formData },
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
        else errorToast("error while approving document");
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
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log("checking data", error.response.data.message);
            // Show error toast, but do not throw it
            errorToast(error.response.data.message);
        }
        // Throw the actual error object to keep proper promise rejection flow
        else errorToast("error while downloading document");
    }
}

export const getAllActiveAgents = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/active-agents`, {
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
        else errorToast("error while fetching all active agent");
    }
}

export const getAllInActiveAgents = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/inactive-agents`, {
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
        else errorToast("error while fetching all inactive agent");
    }
}
export const getAllActiveCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/active-customers', {
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
        else errorToast("error while fetching all active customers");
    }
}
export const getAgentById = async (agentId, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/${agentId}`, {
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
        else errorToast("error while fetching an agent");
    }
}
export const getAllApprovedDocuments = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/document/approved', {
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
        else errorToast("error while fetching all approved documents");
    }
}
export const getAllNotApprovedDocuments = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/document/not-approved', {
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
        else errorToast("error while fetching all not approved documents");
    }
}
export const getAllDocuments = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/document/all', {
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
        else errorToast("error while fetching all documents");
    }
}
export const getDocumentById = async (documentId) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/document/${documentId}`, {
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
        else errorToast("error while fetching an document");
    }
}
export const allRegisteredCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/registered-customers', {
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
        else errorToast("error while fetching registered customers");
    }
}
export const reviewCommissionWithdrawalRequest = async (withdrawalId, isApproved) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/review-commissions/${withdrawalId}/${isApproved}`,
            {},
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
        else errorToast("error while reviewing commission request");
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
        else errorToast("error while approving Customer Profile ");
    }
}

export const getAllTransactions = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/transactions`,
            {
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
        else errorToast("error while fetching all transactions");
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
        else errorToast("error while fetching all approved commissions");
    }
}
export const getAllNotApprovedCommissions = async (agentId, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/not-approved-commissions/${agentId}`,
            {
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
        else errorToast("error while fetching all not  approved commissions Customer Profile ");
    }
}


export const getAllTransactionsByAccountNumber = async (accountNumber, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/transaction/policy-account/${accountNumber}`, {
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
        else errorToast("error while fetching all transactions by account number");
    }
}


export const getAllTransactionsByDate = async (currentPage, itemsPerPage, startDate, endDate) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/transactions/date`, {
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
        else errorToast("error while transactions by date");
    }

}


export const employeeProfileUpdate = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/employee/profile', formState, {
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
        else errorToast("error while employee Profile Update");
    }

}

export const updateState = async (sid, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/state/${sid}`, formState, {
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
        else errorToast("error while updating State");
    }

}
export const updateCity = async (cid, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/city/${cid}`, formState, {
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
        else errorToast("error while updating city");
    }

}



export const getAllInactiveCustomers = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/inactive-customers', {
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
        else errorToast("error while fetching all inactive customers");
    }
}
export const getAllStates = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/state', {
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
        else errorToast("error while fetching all states");
    }
}
export const getAllCities = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/city', {
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
        else errorToast("error while fetching all cities");
    }
}
export const getAllInsuranceTypes = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/insurance-type', {
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
        else errorToast("error while fetching all insuranc types");
    }
}
export const getAllResolvedQueries = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/queries/resolved', {
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
        else errorToast("error while fetching all resolved queries");
    }
}
export const getAllUnResolvedQueries = async (formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/queries/unresolved', {
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
        else errorToast("error while fetching all not resolved queries");
    }
}
export const getAllQueriesByCustomer = async (cid, formData) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/queries/customer/${cid}`, {
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
        else errorToast("error while fetching all not resolved queries");
    }
}


export const getAllActiveAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/policy-accounts/active', {
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
        else errorToast("error while fetching all active accounts");
    }

}
export const getAllAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/customer/policy-accounts', {
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
        else errorToast("error while fetching all accounts");
    }
}


export const getAllInactiveAccounts = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/policy-accounts/inactive', {
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
        else errorToast("error while fetching all deleted accounts");
    }
}
export const getAccountById = async (accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/customer/policy-accounts/${accountNumber}`, {
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
        else errorToast("error while fetching account");
    }
}
export const deleteAccount = async (accountNumber) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/employee/policy-account/${accountNumber}`, {
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
        else errorToast("error while deleting account");
    }
}





export const EmployeeProfile = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/profile/${aid}`, {
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
        else errorToast("error while fetching emp profile");
    }

}

export const getAllCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/agent/customers', {
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
        else errorToast("error while fetching all customers");
    }

}


export const getCustomerDocument = async (did) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/download/${did}`, {
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
        else errorToast("error while fetching all customer documents");
    }

}



export const makeCustomerAccount = async (customerId, updatedFormState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/employee/user/${customerId}`,
            updatedFormState,
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
        else errorToast("error while creating policy account");
    }

}


export const makeAllRequestsCustomerActivate = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/employee/activate/requests/customer', {}, {
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
        const response = await axios.post(`http://localhost:8080/suraksha/employee/activate-customer/${customerId}`, {}, {
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
        else errorToast("error while activating customer");
    }

}



export const makeAllRequestsAccountActivate = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/employee/activate/requests/account', {}, {
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
        const response = await axios.put(`http://localhost:8080/suraksha/employee/activate-policy-account/${accountNumber}`, {}, {
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
        else errorToast("error while activating policy account");
    }

}



export const getAllCustomersByCharacters = async (currentPage, itemsPerPage, firstName) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/customers/starts-with', {
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
        else errorToast("error while fetching all customers");
    }

}


export const getCustomerById = async (id) => {
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
        else errorToast("error while fetching customer");
    }

}


export const getAllUsersByCharacters = async (currentPage, itemsPerPage, firstName) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/users/starts-with', {
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
        else errorToast("error while fetching all not resolved queries");
    }
}


export const deleteAgent = async (aid) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/employee/agent/${aid}`, {
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
        else errorToast("error while deleting agent");
    }

}