import validator from 'validator';
import { UserError } from '../errors/APIError';

export const validateForm = (formState) => {
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

    return errors;
};


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


export const validateFiles= (files) => {
    if (validator.isEmpty(files) || files === undefined || files === null) {
      throw new UserError("All files are required.");
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


    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      errors.email = 'A valid Email is required';
    }

    if (validator.isEmpty(password)) {
      errors.password = 'A Password is required';
    }

    return errors;
};
