
import React from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { Table } from '../../../sharedComponents/Table/Table'
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton'
import { errorToast } from '../../../utils/helper/toast'
import { addDays } from "date-fns"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { getAllTransactions, getAllTransactionsByAccountNumber } from '../../../services/EmployeeServices'
import { formatDateTimeForBackend } from '../../../services/SharedServices'
import { useParams, useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useState, useEffect, useRef } from 'react'
import './transactions.scss'
import { getAllTransactionsByCustomerId, getAllTransactionsByDate } from '../../../services/AdminServices'

export const AffTransactions = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState({});
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [filter, setFilter] = useState(false);
    const [showFilterButton, setShowFilterButton] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setId] = useState('');
    const routeParams = useParams();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dateRangeRef = useRef(null);
    const filterOptions = [
        { label: 'By Date', value: 'date' },
        { label: 'By PolicyAccount Id', value: 'policyAccountId' }
    ];

    const [state, setState] = useState([
        {
            startDate: addDays(new Date(), - 7),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const handleClickOutside = (event) => {
        if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
            setShowDatePicker(false);
        }
    };

    const handleInputClick = () => {
        setShowDatePicker(true);
    };


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const resetPagination = () => {
        setCurrentPage(1);
        setItemsPerPage(10);
    };

    const handleSearch = async () => {
        resetPagination();
        if (filterType === 'policyAccountId' || filterType === 'byCustomerId') {
            setSearchParams({ filterType, id, currentPage, itemsPerPage });
        }
        if (filterType === 'date') {
            setSearchParams({ filterType, startDate: state[0].startDate, enddate: state[0].endDate, currentPage, itemsPerPage });
        }
        setFilter(true);
        await fetchData();
    };

    const handleReset = () => {
        setFilterType('');
        setId('');
        setShowFilterButton(true);
        resetPagination();
        setFilter(false);
        setSearchParams({});
    };

    const fetchData = async () => {
        try {
            let response = {};
            const formData = {
                page: currentPage - 1,
                size: itemsPerPage
            }

            switch (filterType) {
                case 'date':
                    const startDate = formatDateTimeForBackend(state[0].startDate, true);
                    const endDate = formatDateTimeForBackend(state[0].endDate, false);

                    response = await getAllTransactionsByDate(currentPage, itemsPerPage, startDate, endDate);
                    break;
                case 'byCustomerId':
                    response = await getAllTransactionsByCustomerId(currentPage, itemsPerPage, id);
                    break;
                case 'policyAccountId':
                    response = await getAllTransactionsByAccountNumber(id, formData);
                    break;
                default:
                    response = await getAllTransactions(formData);
            }
            setData(response);
            setKeysToBeIncluded(["transactionId", "transactionDate", "amount", "status", "policyAccountId"]);
        } catch (error) {
            setData([]);
            console.error(error);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An unexpected error occurred. Please try again later.");
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter, currentPage, itemsPerPage, searchParams]);

    return (
        <>
            <div className='content-area-transactions'>
                <AreaTop pageTitle={"Get All Transactions"} pagePath={"Transactions"} pageLink={`/agent/dashboard/${routeParams.aid}`} />
                <section className="content-area-table-transactions">
                    <div className="data-table-information">
                        <h3 className="data-table-title">Transactions</h3>
                        {showFilterButton && (
                            <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
                        )}
                        {(filterType === 'policyAccountId' || filterType === 'date' || filterType === 'byCustomerId') && (
                            <div className="filter-container">
                                {(filterType === 'policyAccountId' || filterType === 'byCustomerId') && (
                                    <div className="filter">
                                        <input type="number" placeholder={filterType === 'byCustomerId' ? "Enter Customer Id" : "Enter Account Number"} className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
                                    </div>
                                )}
                                {filterType === 'date' && (
                                    <div className="filter">
                                        <div ref={dateRangeRef} className={`date-range-wrapper ${!showDatePicker ? "hide-date-range" : ""}`} onClick={handleInputClick}>
                                            <DateRange
                                                editableDateInputs={true}
                                                onChange={(item) => setState([item.selection])}
                                                moveRangeOnFirstSelection={false}
                                                ranges={state}
                                                showMonthAndYearPickers={false}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="filter-buttons">
                                    <button className="form-submit-b" onClick={handleSearch}>Search</button>
                                    <button className="form-submit-b" onClick={handleReset}>Clear</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="data-table-diagram">
                        <Table
                            data={data}
                            keysToBeIncluded={keysToBeIncluded}
                            includeButton={false}
                            handleButtonClick={null}
                            currentPage={currentPage}
                            pageSize={itemsPerPage}
                            setPage={setCurrentPage}
                            setPageSize={setItemsPerPage}
                        />
                    </div>
                </section>
                <ToastContainer position="bottom-right" />
            </div>
        </>
    )
}
