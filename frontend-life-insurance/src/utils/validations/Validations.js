import validator from 'validator';
import { SurakshaError, UserError } from '../errors/APIError';

export const validateForm = (formState) => {
  const errors = {};

  if (validator.isEmpty(formState.firstName)) {
    errors.firstName = 'First Name is required';
  }

  if (validator.isEmpty(formState.username)) {
    errors.username = 'Username is required';
  }

  if (validator.isEmpty(formState.email)) {
    errors.email = 'A valid Email is required';
  }

  if (validator.isEmpty(formState.password) || !validator.isStrongPassword(formState.password)) {
    errors.password = 'A Strong Password is required';
  }
}

export const validateCalculationsFields = (policyTerm, totalInvestmentAmount, installmentTimePeriod, minPolicyTerm, maxPolicyTerm, minInvestmentAmount, maxInvestmentAmount) => {
  const errors = {};

  if (policyTerm === undefined || policyTerm === null || policyTerm === '') {
    errors.policyTerm = 'Policy Term is required';
  } else if (isNaN(policyTerm) || policyTerm <= 0) {
    errors.policyTerm = 'Policy Term must be a positive integer.';
  } else if (policyTerm < minPolicyTerm || policyTerm > maxPolicyTerm) {
    errors.policyTerm = `Policy Term must be between ${minPolicyTerm} and ${maxPolicyTerm} years.`;
  }

  // Total Investment Amount validation
  if (totalInvestmentAmount === undefined || totalInvestmentAmount === null || totalInvestmentAmount === '') {
    errors.totalInvestmentAmount = 'Total Investment Amount is required';
  } else if (isNaN(totalInvestmentAmount) || totalInvestmentAmount <= 0) {
    errors.totalInvestmentAmount = 'Total Investment Amount must be a valid number.';
  } else if (totalInvestmentAmount < minInvestmentAmount || totalInvestmentAmount > maxInvestmentAmount) {
    errors.totalInvestmentAmount = `Investment must be between ${minInvestmentAmount} and ${maxInvestmentAmount}.`;
  }

  // Installment Time Period validation
  if (installmentTimePeriod === undefined || installmentTimePeriod === null || installmentTimePeriod === '') {
    errors.installmentTimePeriod = 'Installment Time Period is required';
  } else if (!Number.isInteger(installmentTimePeriod) || installmentTimePeriod <= 0) {
    errors.installmentTimePeriod = 'Installment Time Period must be a positive integer.';
  }
  return errors;
};


export const validateFeedbackForm = (formState) => {
  const errors = {};

  if (!formState.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!formState.description.trim()) {
    errors.description = 'Description is required';
  }

  if (formState.rating < 1 || formState.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  return errors;
}


export const validatePolicyAccountId = (id) => {
  if (validator.isEmpty(id) || id === undefined) {
    throw new SurakshaError("Policy Account ID is required.");
  }

  if (!validator.isInt(id, { gt: 0 })) {
    throw new SurakshaError("Policy Account ID must be a valid number greater than zero.");
  }
}



export const validatePersonalInfoForm = (formPersonalInfo) => {
  const errors = {};

  if (!formPersonalInfo.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formPersonalInfo.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const date = new Date(formPersonalInfo.dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = 'Invalid date of birth';
    }
  }

  if (!formPersonalInfo.gender) {
    errors.gender = 'Gender is required';
  }

  if (!formPersonalInfo.nomineeName.trim()) {
    errors.nomineeName = 'Nominee name is required';
  }

  if (!formPersonalInfo.nomineeRelation.trim()) {
    errors.nomineeRelation = 'Nominee relation is required';
  }


  if (validator.isEmpty(formPersonalInfo.email) || !validator.isEmail(formPersonalInfo.email)) {
    errors.email = 'A valid Email is required';
  }

  const mobilePattern = /^\+91[0-9]{10}$/;
  if (!formPersonalInfo.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!mobilePattern.test(formPersonalInfo.mobileNumber)) {
    errors.mobileNumber = 'Mobile number must be in the format +91XXXXXXXXXX';
  }

  return errors;
};



export const validateAddressInfoForm = (formAddressInfo) => {
  const errors = {};

  if (!formAddressInfo.firstStreet.trim()) {
    errors.firstStreet = 'First street is required';
  }


  const pincodePattern = /^[0-9]{6}$/;
  if (!formAddressInfo.pincode.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!pincodePattern.test(formAddressInfo.pincode)) {
    errors.pincode = 'Pincode must be a 6-digit number';
  }

  if (!formAddressInfo.state.trim()) {
    errors.state = 'State is required';
  }

  if (!formAddressInfo.city.trim()) {
    errors.city = 'City is required';
  }

  return errors;
};



// export const validateLoginForm = (email, password) => {
//   const errors = {};

//   if (validator.isEmpty(email) || !validator.isEmail(email)) {
//     errors.email = 'A valid Email is required';
//   }

//   if (validator.isEmpty(password)) {
//     errors.password = 'A Password is required';
//   }

//   return errors;
// };



export const validateCalculatorFields = (policyTerm, totalInvestmentAmount, installmentTimePeriod, rate) => {
  const errors = {};

  if (policyTerm === undefined || policyTerm === null || policyTerm === '') {
    errors.policyTerm = 'Years required';
  } else if (isNaN(policyTerm) || policyTerm <= 0) {
    errors.policyTerm = 'Years must be a positive integer.';
  }

  // Total Investment Amount validation
  if (totalInvestmentAmount === undefined || totalInvestmentAmount === null || totalInvestmentAmount === '') {
    errors.totalInvestmentAmount = 'Total Investment Amount is required';
  } else if (isNaN(totalInvestmentAmount) || totalInvestmentAmount <= 0) {
    errors.totalInvestmentAmount = 'Total Investment Amount must be a valid number.';
  }

  // Installment Time Period validation
  if (installmentTimePeriod === undefined || installmentTimePeriod === null || installmentTimePeriod === '') {
    errors.installmentTimePeriod = 'Installment Time Period (Months) is required';
  } else if (!Number.isInteger(installmentTimePeriod) || installmentTimePeriod <= 0) {
    errors.installmentTimePeriod = 'Installment Time Period (Months) must be a positive integer.';
  }


  if (rate === undefined || rate === null || rate === '') {
    errors.installmentTimePeriod = 'Profit percentage is required';
  } else if (isNaN(rate) || rate <= 0 || rate > 100) {
    errors.installmentTimePeriod = 'Profit percentage must be a positive integer and in under 100.';
  }

  return errors;
};



export const validateFiles = (files) => {
  console.log(files);
  if (files === undefined || files === null) {
    throw new SurakshaError("Files are required.");
  }

  if (Array.isArray(files) && files.length === 0) {
    throw new SurakshaError("At least one file is required.");
  }

  if (typeof files === 'string' && validator.isEmpty(files)) {
    throw new SurakshaError("File path cannot be empty.");
  }
};


export const validateRegistrationForm = (formState, userType) => {
  const errors = {};

  if (validator.isEmpty(formState.firstName)) {
    errors.firstName = 'First Name is required';
  }

  if (validator.isEmpty(formState.username)) {
    errors.username = 'Username is required';
  }

  if (validator.isEmpty(formState.email) || !validator.isEmail(formState.email)) {
    errors.email = 'A valid Email is required';
  }

  if (validator.isEmpty(formState.password) || !validator.isStrongPassword(formState.password)) {
    errors.password = 'A Strong Password is required';
  }

  const mobilePattern = /^\+91\d{10}$/;
  if (!formState.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!mobilePattern.test(formState.mobileNumber)) {
    errors.mobileNumber = 'Mobile number must be in the format +91XXXXXXXXXX';
  }

  if (!formState.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Date of birth is required';
  }

  if (userType === 'customer') {
    if (!formState.gender.trim()) {
      errors.gender = 'Gender is required';
    }
  }

  if (userType === 'agent') {
    if (!formState.qualification.trim()) {
      errors.agentCode = 'Qualification is required';
    }
  }

  if (userType === 'customer') {
    if (!formState.nomineeName.trim()) {
      errors.nomineeName = 'Nominee name is required';
    }

    if (!formState.nomineeRelation.trim()) {
      errors.nomineeRelation = 'Nominee relation is required';
    }
  }
  if (!formState.firstStreet.trim()) {
    errors.firstStreet = 'First street is required';
  }

  const pincodePattern = /^[0-9]{6}$/;
  if (!formState.pincode.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!pincodePattern.test(formState.pincode)) {
    errors.pincode = 'Pincode must be a 6-digit number';
  }

  if (!formState.stateId.trim()) {
    errors.stateId = 'State is required';
  }

  if (!formState.cityId.trim()) {
    errors.cityId = 'City is required';
  }


  return errors;
};




export const validatePasswordInfoForm = (formPasswordInfo) => {
  const errors = {};

  if (!formPasswordInfo.oldPassword.trim()) {
    errors.oldPassword = 'Old password is required';
  }

  if (validator.isEmpty(formPasswordInfo.newPassword) || !validator.isStrongPassword(formPasswordInfo.newPassword)) {
    errors.password = 'A Strong New Password is required';
  }

  if (!formPasswordInfo.retypeNewPassword.trim()) {
    errors.retypeNewPassword = 'Retype new password is required';
  } else if (formPasswordInfo.newPassword !== formPasswordInfo.retypeNewPassword) {
    errors.retypeNewPassword = 'New Passwords do not match';
  }

  return errors;
};






// export const validateForm = (formState) => {
//   const errors = {};

//   if (validator.isEmpty(formState.firstName)) {
//     errors.firstName = 'First Name is required';
//   }

//   if (validator.isEmpty(formState.username)) {
//     errors.username = 'Username is required';
//   }

//   if (validator.isEmpty(formState.email) || !validator.isEmail(formState.email)) {
//     errors.email = 'A valid Email is required';
//   }

//   if (validator.isEmpty(formState.password) || !validator.isStrongPassword(formState.password)) {
//     errors.password = 'A Strong Password is required';
//   }

//   return errors;
// };




export const validateCustomerId = (customerId) => {
  if (validator.isEmpty(customerId) || customerId === undefined) {
    throw new UserError("Customer ID is required.");
  }

  if (!validator.isInt(customerId, { gt: 0 })) {
    throw new UserError("Customer ID must be a valid number greater than zero.");
  }
};

export const validateBalance = (balance) => {
  if (validator.isEmpty(balance) || balance === undefined) {
    throw new UserError("Amount is required.");
  }

  if (!validator.isInt(balance, { gt: 0 })) {
    throw new UserError("Amount must be a valid number greater than zero.");
  }
};


export const validateAccountNumber = (accountNumber) => {
  if (validator.isEmpty(accountNumber) || accountNumber === undefined) {
    throw new UserError("Account Number is required.");
  }

  if (!validator.isInt(accountNumber, { gt: 0 })) {
    throw new UserError("Account Number must be a valid number greater than zero.");
  }
};


export const validateFirstName = (firstName) => {
  if (validator.isEmpty(firstName) || firstName === undefined) {
    throw new UserError("Characters are required.");
  }

  if (!validator.isAlpha(firstName)) {
    throw new UserError("Characters must contain only alphabets.");
  }
}


export const validateUserId = (userId) => {
  if (validator.isEmpty(userId) || userId === undefined) {
    throw new UserError("User ID is required.");
  }

  if (!validator.isInt(userId, { gt: 0 })) {
    throw new UserError("User ID must be a valid number greater than zero.");
  }
};


export const validateRequestForm = (formState) => {
  const errors = {};


  if (validator.isEmpty(formState.email) || !validator.isEmail(formState.email)) {
    errors.email = 'A valid Email is required';
  }

  if (validator.isEmpty(formState.password)) {
    errors.password = 'A Strong Password is required';
  }

  if (validator.isEmpty(formState.customerId) || formState.customerId === undefined) {
    errors.customerId = "Customer ID is required.";
  }

  if (!validator.isInt(formState.customerId, { gt: 0 })) {
    errors.customerId = "Customer ID must be a valid number greater than zero.";
  }

  return errors;
};
export const validateLoginForm = (email, password) => {
  const errors = {};


  if (validator.isEmpty(email)) {
    errors.email = 'A valid Email is required';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'A Password is required';
  }

  return errors;
};