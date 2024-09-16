import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import { ToastContainer } from 'react-toastify';
import './accounts.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { Button, Form, Modal } from 'react-bootstrap';
import { accountRequestActivation, fetchCustomerAccounts, getBalanceAndAccounts } from '../../../services/CustomerServices';
import { useParams } from 'react-router-dom';

export const Accounts = () => {
    const {currentPage, itemsPerPage, resetPagination} = useContext(PaginationContext);
    const token = localStorage.getItem("auth");
    const [data, setData] = useState({});
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [accounts, setAccounts] = useState([]);
    const routeParams = useParams();
  
    const defaultTableList = async () => {
        try {
            const response = await getBalanceAndAccounts(currentPage, itemsPerPage);
  
            setData(response);
            setKeysToBeIncluded(["accountNumber", "accountType", "balance", "active"]);
  
        } catch (error) {
            setData([]);
        }
    };


    const handleSubmit = async () => {
        try {
           await accountRequestActivation(selectedAccount);
            
            successToast("Request submitted successfully!");
            setIsModalOpen(false);
        } catch (error) {
            setIsModalOpen(false);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An unexpected error occurred. Please try again later.");
            }
        }
    };

    const handleAccountChange = (e) => {
        setSelectedAccount(e.target.value);
    };

  
      useEffect(() => {
        defaultTableList();
      }, [currentPage, itemsPerPage]);

  
      useEffect(() => {
        resetPagination();
      },[]);

      useEffect(() => {
        if (isModalOpen) {
            const fetchAccounts = async () => {
                try{
                    const accountsData = await fetchCustomerAccounts();
                    if (accountsData && accountsData.length > 0) {
                        const accountNumbers = accountsData.map(account => account.accountNumber);
                        setAccounts(accountNumbers);
                        setSelectedAccount(accountNumbers[0]);
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
        }
    }, [isModalOpen]);


  return (
    <div className='content-area'>
        <AreaTop pageTitle={"Get Your Accounts"} pagePath={"Accounts"} pageLink={`/user/transactions/${routeParams.id}`}/>
        <section className="content-area-table">
            <div className="data-table-info">
                <h3 className="data-table-title">Your Accounts</h3>
                <button type="submit" className="form-submit-a" onClick={() => setIsModalOpen(true)}>Make Inactive Account Request</button>
            </div>
            <div className="data-table-diagram">
                <Table
                    data={data}
                    keysToBeIncluded={keysToBeIncluded} 
                    includeButton={false}
                    handleButtonClick={null}
                />
            </div>
            <h3 className='data-table-body'>Total Balance: {data.totalBalance}</h3>
        </section>
        <ToastContainer position="bottom-right"/>
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} dialogClassName="modal-dialog-centered">
                <Modal.Header closeButton={false}>
                    <Modal.Title>Make Inactive Account Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="accountSelect">
                            <Form.Label>Select Account to Inactivate</Form.Label>
                            <Form.Control as="select" value={selectedAccount} onChange={handleAccountChange}>
                                {accounts.map((account, index) => (
                                    <option key={index} value={account}>{account}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="custom-modal-footer">
                    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
    </div>
  )
}
