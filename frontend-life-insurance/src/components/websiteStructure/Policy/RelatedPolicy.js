import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getListOfAllActivePoliciesByInsuranceType } from '../../../services/SharedServices';
import { errorToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const RelatedPolicy = ({ policyId, insuranceTypeId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const policyTable = async () => {
        try {
            setLoading(true);
            const response = await getListOfAllActivePoliciesByInsuranceType(insuranceTypeId);
            const filteredData = response.filter(policy => policy.policyId != policyId);
            const shuffledData = filteredData.sort(() => 0.5 - Math.random());
            const selectedPolicies = shuffledData.slice(0, Math.min(4, shuffledData.length));
            setData(selectedPolicies);
            console.log(selectedPolicies);
        } catch (error) {
            setData([]);
            if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An unexpected error occurred. Please try again later.");
            }
        }finally{
            setLoading(false);
        }
    };

    

    useEffect(() => {
        policyTable();
      }, [insuranceTypeId, policyId]);

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        {loading && <Loader />}
        <h1 className='text-3xl font-medium'> Related Schemes</h1>
        <p className='sm:w-1/3 text-center text-sm'>Simply Browse our extensive list of related schemes</p>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {data.map((policy) => (
            <div onClick={() => {navigate(`/suraksha/scheme/${policy.policyId}`); window.scrollTo(0,0) }} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
                <img className="br-blue-50 w-full h-40 object-cover" src={`data:image/jpeg;base64,${policy.imageBase64}`} alt="policy" />
                <div className='p-4'>
                    <p className='text-gray-900 text-lg font-medium'>{policy.policyName}</p>
                    <p className='text-gray-600 text-sm font-medium'>Scheme Id: SCH{policy.policyId}</p>
                    <p className='text-gray-600 text-sm'> Profit: {policy.profitRatio}%</p>
                </div>
            </div>
            ))}
        </div>
        <ToastContainer position="bottom-right"/>
    </div>
  )
}
