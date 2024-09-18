import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';
import { errorToast } from '../utils/helper/toast';
export const getAllPolicies = async (formData) => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy`, {
            params: formData
        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const SinglePolicy = async (policyId) => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy/${policyId}`, {

        }).catch((error) => { throw new AxiosError(error.response.data.message) });

        return response;
    }
    catch (error) {
        throw error;
    }
}
export const DocumentOptions = async () => {
    const token = localStorage.getItem('auth')
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/public/documents`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).catch((error) => { throw new AxiosError(error.response.data.message) });
        if (response.data==false){
            throw new AxiosError('you can not purchase this policy, please contact your agent!')
        }
        return response;
    }
    catch (error) {
        throw error;
    }
}
export const IsEligible = async (policyId) => {
    const token = localStorage.getItem('auth')
    try {
        const response = await axios.post(`http://localhost:8080/suraksha/policy/eligible-check/${policyId}`, {},
            {
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