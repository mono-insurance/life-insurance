import React, { useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import './makeTransactions.scss';
import { ToastContainer } from 'react-toastify';
import { fetchCustomerAccounts, makeTransactions } from '../../../services/CustomerServices';
import {  NotFoundError } from '../../../utils/errors/APIError';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { validateBalance } from '../../../utils/validations/Validations';

export const MakeTransactions = () => {

    const [transactionType, setTransactionType] = useState('credit');
    const [transferType, setTransferType] = useState('own');
    const [amount, setAmount] = useState('');
    const [accountToTransfer, setAccountToTransfer] = useState();
    const [recipientAccount, setRecipientAccount] = useState();
    const [ownAccounts, setOwnAccounts] = useState([]);
    const [account, setAccount] = useState();
    const routeParams = useParams();

    const handleSubmit = async ()=>{
        try {
            if(!amount){
                throw new NotFoundError('Amount is required');
            }
            const data = {amount:amount,transactionType:transactionType,senderAccountNumber:account};
            if(transactionType !== 'transfer'){
                data.receiverAccountNumber = account;
            }
            else{
                if(transferType === 'own'){
                    data.receiverAccountNumber = accountToTransfer;
                }
                else{
                    data.receiverAccountNumber = recipientAccount;
                }
            }

            validateBalance(amount);
            await makeTransactions(data);

            successToast("Transaction successful!");

            setAmount('');
            setTransactionType('credit');
            setTransferType('own');
            setRecipientAccount('');
            setAccountToTransfer(ownAccounts[0]);
            setAccount(ownAccounts[0]);
            
        } catch (error) {
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An unexpected error occurred. Please try again later.");
            }
        }
    }

    useEffect(() => {
        const fetchAccounts = async () => {
            try{
                const accountsData = await fetchCustomerAccounts();
                if (accountsData && accountsData.length > 0) {
                    const accountNumbers = accountsData.map(account => account.accountNumber);
                    setOwnAccounts(accountNumbers);
                    setAccount(accountNumbers[0]);
                    setAccountToTransfer(accountNumbers[0]);
                } else {
                    errorToast("No account found");
                }
            }catch(error){
                console.log(error)
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast("An unexpected error occurred while fetching accounts. Please try again later.");
                }
            }
        };
        fetchAccounts();
    }, []);



  return (
    <div className='content-area'>
            <AreaTop pageTitle={"Make Transactions"} pagePath={"Make-transactions"} pageLink={`/user/transactions/${routeParams.id}`} />

            <section className="content-area-form">
                <div className="transaction-form">
                    <div className="form-row-t">
                        <label className="form-label">
                            <span>Select Account:</span>
                            <select name="account" className="form-input" value={account} onChange={(e) => setAccount(e.target.value)}>
                            {ownAccounts.map((account, index) => (
                                <option key={index} value={account}>{account}</option>
                            ))}
                            </select>
                        </label>

                        <label className="form-label">
                            <span>Transaction Type:</span>
                            <select name="transactionType" className="form-input" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                                <option value="credit">Credit</option>
                                <option value="debit">Debit</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </label>
                    </div>

                    {transactionType === 'transfer' && (
                        <>
                            <div className="form-row-t">
                                <label className="form-label">
                                    <span>Transfer To:</span>
                                    <select name="transferType" className="form-input" value={transferType} onChange={(e) => setTransferType(e.target.value)}>
                                        <option value="own">Transfer to Own Accounts</option>
                                        <option value="other">Transfer to Another Person</option>
                                    </select>
                                </label>

                                {transferType === 'own' && (
                                    <label className="form-label">
                                        <span>Select Account:</span>
                                        <select name="accountToTransfer" className="form-input" value={accountToTransfer} onChange={(e) => setAccountToTransfer(e.target.value)}>
                                            {ownAccounts.map((account, index) => (
                                                <option key={index} value={account}>{account}</option>
                                            ))}
                                        </select>
                                    </label>
                                )}
                            
                                {transferType === 'other' && (
                                    <label className="form-label">
                                        <span>Recipient Account:</span>
                                        <input type="number" name="recipientAccount" className="form-input" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} placeholder="Enter Recipient Account Number" />
                                    </label>
                                )}
                            </div>
                        </>
                    )}
                    <div className="form-row-t">
                        <label className="form-label full-width">
                            <span>Enter Amount:</span>
                            <input type="number" name="amount" className="form-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Amount" />
                        </label>
                    </div>
                    <button type="submit" className="form-submit full-width" onClick={handleSubmit}>Send</button>
                </div>
            </section>
            <ToastContainer position="bottom-right" />
        </div>
    );
}
