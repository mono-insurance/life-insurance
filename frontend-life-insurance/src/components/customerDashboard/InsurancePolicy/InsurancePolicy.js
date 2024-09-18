import React from 'react'
import { useParams } from 'react-router-dom';

export const InsurancePolicy = () => {
    const routeParams = useParams();
  return (
    <div>InsurancePolicy + {routeParams.insuranceId}</div>
  )
}
