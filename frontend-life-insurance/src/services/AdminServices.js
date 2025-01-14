import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';


export const fetchAdmin = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/admin', {
        headers: {
            'Authorization': `Bearer ${token}`
        }}).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllCustomers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/customers', {
              params: { page: currentPage - 1, size: itemsPerPage },
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
        const response = await axios.get('http://localhost:8080/suraksha/employee/active-customers', {
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
        const response = await axios.get('http://localhost:8080/suraksha/employee/inactive-customers', {
            params: { page: currentPage - 1, size: itemsPerPage },
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
        const response = await axios.get(`http://localhost:8080/suraksha/customer/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllStates = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/state', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllActiveStates = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/state/activated', {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllInactiveStates = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/state/inactivated', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllCities = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/city', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllActiveCities = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/city/activated', {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllInactiveCities = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/city/inactivated', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllEmployees = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllActiveEmployees = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/active', {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllInactiveEmployees = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/employee/inactive', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getEmployeeById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/profile/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllAgents = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/agents', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllActiveAgents = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/agent/active/true', {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllInactiveAgents = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/employee/agent/active/false', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAgentsById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/agent/profile/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllInsuranceCategories = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/insurancetype/insurance/type', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllActiveInsuranceCategories = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/insurancetype/insurance/type/activated', {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllInactiveInsuranceCategories = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/insurancetype/insurance/type/inactivated', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getInsuranceCategoriesById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/insurancetype/insurance/type/  ${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllPolicy = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/policy', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllActivePolicy = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/policy/active', {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllInactivePolicy = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/policy/policy/inactive', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getPolicyById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy/policy/${id}`, {
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const createNewEmployee = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/employee/employee', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const createNewState = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/admin/state', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const createNewCity = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/admin/city', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getListOfActiveStates = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/state/all/active`, {
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const createNewInsuranceCategory = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/admin/insurance/type', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const fetchGlobalSettingsByKey = async (key) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/settings/settings/key`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { settingKey: key } 
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const addOrUpdateSettings = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/settings/settings/update', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllFeedbacks = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/feedback/feedback', {
            params: { page: currentPage - 1, size: itemsPerPage, direction: 'DESC', sort: 'feedbackId' },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getFeedbackByCustomerId = async (id, currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/feedback/feedback/customer/${id}`, {
            params: { page: currentPage - 1, size: itemsPerPage , direction: 'DESC', sort: 'feedbackId' },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllQueries = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/query/queries', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllResolvedQueries = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/query/queries/resolved', {
          params: { page: currentPage - 1, size: itemsPerPage },
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllUnresolvedQueries = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/query/queries/unresolved', {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getQueriesByCustomerId = async (id, currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/query/queries/customer/${id}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const createNewPolicy = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/admin/policy', formState, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const fetchListOfActiveInsuranceCategories = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/insurancetype/all/active`, {
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const fetchListOfAllDocuments = async () => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/all`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getInsuranceCategoryById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/insurancetype/insurance/type/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updateInsuranceCategory = async (id, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/insurancetype/insurance/type/${id}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const deleteInsuranceCategory = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/insurancetype/insurance/type/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getStateById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/state/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updateState = async (id, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/state/${id}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const deleteState = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/admin/state/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getCityById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/city/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updateCity = async (id, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/city/${id}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const deleteCity = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/admin/city/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const createNewAdmin = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post('http://localhost:8080/suraksha/admin/create/admin', formState, {
          headers: { 'Authorization': `Bearer ${token}` }
      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updateAdminProfile = async (formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put('http://localhost:8080/suraksha/admin', formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getQueryById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/query/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updateQuery = async (id, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/query/query/${id}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const deleteQuery = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/query/query/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updatePolicy = async (id, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/policy/${id}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getPolicyImage = async (policyId) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy/download/policy-image/${policyId}`, {
              responseType: 'blob',
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const uploadNewPolicyImage = async (policyId, file) => {
    const token = localStorage.getItem('auth');
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/policy/update/policy-image/${policyId}`, formData, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const deletePolicy = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/admin/policy/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const fetchEmployeeById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/employee/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const updateEmployee = async (id, formState) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.put(`http://localhost:8080/suraksha/employee/employee/${id}`, formState, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const deleteEmployee = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.delete(`http://localhost:8080/suraksha/employee/employee/${id}`, {
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
        const response = await axios.get('http://localhost:8080/suraksha/admin/counts', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getNewUsers = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/admin/new/users', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllClaims = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/withdrawal-request/total/claim', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllRegistrationCommissions = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/transaction/commissions/registration', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getAllInstallmentCommissions = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/transaction/commissions/installment', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllWithdrawalRequests = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/withdrawal-request', {
              params: { page: currentPage - 1, size: itemsPerPage , direction: 'DESC', sortBy: 'withdrawalRequestsId' },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllWithdrawalRequestsByWithdraw = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get('http://localhost:8080/suraksha/withdrawal-request/withdraw', {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getWithdrawalRequestsByCustomerId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/customer/${id}`, {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getWithdrawalRequestsByAgentId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/agent/${id}`, {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getWithdrawByCustomerId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/customer/${id}/withdraw`, {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getWithdrawByAgentId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/agent/${id}/withdraw`, {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getApprovedByCustomerId = async (currentPage, itemsPerPage, id) => {
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




export const getApprovedByAgentId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/agent/${id}/approved`, {
              params: { page: currentPage - 1, size: itemsPerPage },
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const fetchWihdrawalRequestById = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/withdrawal-request/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const approveOrRejectWithdrawalRequests = async (id, isApproved) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/withdrawal-request/admin/${id}`, isApproved, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },

      }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getAllTransactions = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/transaction`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getAllTransactionsByPolicyAccountId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/transaction/transactions/policy-account/${id}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllTransactionsByCustomerId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/transaction/transactions/customer/${id}`, {
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
        const response = await axios.get(`http://localhost:8080/suraksha/transaction/transactions/date`, {
            params: { page: currentPage - 1, size: itemsPerPage , startDate: startDate, endDate: endDate},
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const downloadRequestsInCSV = async () => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/withdrawal/download/csv`, {
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





export const downloadRequestsInPDF = async () => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/withdrawal/download/pdf`, {
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




export const downloadTransactionsInCSV = async () => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/transaction/download/csv`, {
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





export const downloadTransactionsByIdInPDF = async (id) => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/transactions/policy-account/${id}/download/pdf`, {
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





export const downloadTransactionsInPDF = async () => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/transaction/download/pdf`, {
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




export const downloadCustomersInCSV = async () => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/customer/download/csv`, {
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



export const getAllDisapprovedDocuments = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/documents/not-approved`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getAllDocumentsByCustomerId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/documents/customer/${id}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllDocumentsByAgentId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/documents/agent/${id}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getAllDocuments = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/document/documents`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const approveDocument = async (id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/admin/document/approve/${id}`,{}, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const downloadPolicyAccountInCSV = async () => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/policy/accounts/download/csv`, {
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





export const getAllPolicyAccountByCustomerId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/policy-account/customer/${id}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}



export const getAllPolicyAccountByAgentId = async (currentPage, itemsPerPage, id) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/policy-account/agent/${id}`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const getAllPolicyAccount = async (currentPage, itemsPerPage) => {
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/employee/policy-account/view`, {
            params: { page: currentPage - 1, size: itemsPerPage },
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}




export const downloadAgentsInCSV = async () => {  
    const token = localStorage.getItem('auth');
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/download/admin/agent/download/csv`, {
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



// export const makeCustomersInactive = async () => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.put('http://localhost:8080/api/admin/users/inactive',{}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }



// export const getAllActiveAccounts = async (currentPage, itemsPerPage) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get('http://localhost:8080/api/admin/accounts/active', {
//           params: { page: currentPage - 1, size: itemsPerPage },
//           headers: { 'Authorization': `Bearer ${token}` }
//         }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const getAllInactiveAccounts = async (currentPage, itemsPerPage) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get('http://localhost:8080/api/admin/accounts/inactive', {
//             params: { page: currentPage - 1, size: itemsPerPage },
//             headers: { 'Authorization': `Bearer ${token}` }
//           }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }




// export const makeAccountsInactive = async () => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.put('http://localhost:8080/api/admin/user/inactive/accounts',{}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const getAllUsers = async (currentPage, itemsPerPage) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get('http://localhost:8080/api/admin/users', {
//                 params: { page: currentPage - 1, size: itemsPerPage },
//                 headers: { 'Authorization': `Bearer ${token}` }
//             }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const getSystemStats = async () => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get('http://localhost:8080/api/admin/counts', {
//               headers: { 'Authorization': `Bearer ${token}` }
//             }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }




// export const makeAnotherAdmin = async (formState) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.post('http://localhost:8080/api/admin/user-admin', formState, {
//           headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const getCustomerDocument = async (customerId, documentType) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get(`http://localhost:8080/api/admin/files/user/${customerId}/${documentType}`, {
//           responseType: 'blob',
//           headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }



// export const makeCustomerAccount = async (customerId, updatedFormState) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.post(`http://localhost:8080/api/admin/user/${customerId}`, updatedFormState, {
//           headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const makeAllRequestsCustomerActivate = async () => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.put('http://localhost:8080/api/admin/activate/requests/customer',{}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const activateParticularCustomer = async (customerId) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.put(`http://localhost:8080/api/admin/users/${customerId}/activate`, {}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }



// export const makeAllRequestsAccountActivate = async () => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.put('http://localhost:8080/api/admin/activate/requests/account',{}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const activateParticularAccount = async (accountNumber) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.put(`http://localhost:8080/api/admin/accounts/${accountNumber}/activate`, {}, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }



// export const getAllCustomersByCharacters = async (currentPage, itemsPerPage, firstName) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get('http://localhost:8080/api/admin/customers/starts-with', {
//               params: { page: currentPage - 1, size: itemsPerPage, startsWith: firstName },
//               headers: { 'Authorization': `Bearer ${token}` }
//           }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }





// export const getAllUsersByCharacters = async (currentPage, itemsPerPage, firstName) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get('http://localhost:8080/api/admin/users/starts-with', {
//               params: { page: currentPage - 1, size: itemsPerPage, startsWith: firstName },
//               headers: { 'Authorization': `Bearer ${token}` }
//           }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const getUserById = async (id) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.get(`http://localhost:8080/api/admin/users/${id}`, {
//               headers: { 'Authorization': `Bearer ${token}` }
//           }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }


// export const deleteUser = async (id) => {
//     const token = localStorage.getItem('auth');
//     try {
//         const response = await axios.delete(`http://localhost:8080/api/admin/user/${id}`, {
//               headers: { 'Authorization': `Bearer ${token}` }
//           }).catch((error) => {throw new AxiosError(error.response.data.message)});

//         return response.data;
//     } 
//     catch (error) {
//         throw error;
//     }

// }