import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchListOfActiveInsuranceCategories } from '../../../services/AdminServices';
import { getListOfAllActivePolicies, getListOfAllActivePoliciesByInsuranceType } from '../../../services/SharedServices';
import { errorToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const Products = () => {
  const {insuranceType} = useParams();
  const [insurance, setInsurance] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const policyTable = async () => {
    try {
      setLoading(true);
        let response = {};

        if(insuranceType) {
          response = await getListOfAllActivePoliciesByInsuranceType(insuranceType);
        }
        else {
          response = await getListOfAllActivePolicies();
        }
        setData(response);
        console.log(response);

    } catch (error) {
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
    const fetchInsurance = async () => {
      const response = await fetchListOfActiveInsuranceCategories();
      console.log(response);
      setInsurance(response);
    }
    fetchInsurance();
}, []);

useEffect(() => {
  policyTable();
}, [insuranceType]);


  return (
    <>
    <div>
    {loading && <Loader />}
      <p className='text-gray-600'>Browse through the insurances</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-3 text-sm text-gray-600'>
        {insurance.map((insurance) => (
            <p key={insurance.typeId} onClick={() => (insuranceType == insurance.typeId) ? navigate('/suraksha/insurances') : navigate(`/suraksha/insurances/${insurance.typeId}`)} className={`w-full sm:w-[200px] pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${insuranceType == insurance.typeId? "bg-indigo-100 text-black": ""}`}>
              {insurance.insuranceCategory}
            </p>
        ))}
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {data.map((policy,index) => (
            <div onClick={() => navigate(`/suraksha/scheme/${policy.policyId}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
              <img className="br-blue-50 w-full h-40 object-cover" src={`data:image/jpeg;base64,${policy.imageBase64}`} alt="policy" />
              <div className='p-4'>
                <p className='text-gray-900 text-lg font-medium'>{policy.policyName}</p>
                <p className='text-gray-600 text-sm font-medium'>Scheme Id: SCH{policy.policyId}</p>
                <p className='text-gray-600 text-sm'> Profit: {policy.profitRatio}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
    </>
    
  )
}
