import axios from 'axios';
import { AxiosError } from '../utils/errors/APIError';


export const getListOfAllActivePoliciesByInsuranceType = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy/all/active/${id}`, {
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}


export const getListOfAllActivePolicies = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/suraksha/policy/all/active`, {
          }).catch((error) => {throw new AxiosError(error.response.data.message)});

        return response.data;
    } 
    catch (error) {
        throw error;
    }

}