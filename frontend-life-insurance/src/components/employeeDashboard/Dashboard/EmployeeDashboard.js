import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { Card } from '../../../sharedComponents/Card/Card'
import './EmployeeDashboard.scss';
import { errorToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import { ProgressBar } from '../../../sharedComponents/ProgressBar/ProgresBar';
import { useParams, useSearchParams } from 'react-router-dom';
import { formatRoleForTable } from '../../../services/SharedServices';
import { getAllCustomers, getAllCustomersByCharacters, fetchEmployeeDashboard, getCustomerById } from '../../../services/EmployeeServices';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { validateFirstName, validateUserId } from '../../../utils/validations/Validations';

export const EmployeeDashboard = () => {
    const [counts, setCounts] = useState({});
    const { currentPage, itemsPerPage, resetPagination, handlePageChange, handleItemsPerPageChange } = useContext(PaginationContext);
    const [data, setData] = useState([]);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const [showFilterButton, setShowFilterButton] = useState(true);
    const [filterType, setFilterType] = useState('');
    const [filter, setFilter] = useState(false);
    const routeParams = useParams();
    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [showPagination, setShowPagination] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const filterOptions = [
        { label: 'Search by User Id', value: 'id' },
        { label: 'Search by Characters', value: 'firstName' }
    ];


    const handleSearch = () => {
        resetPagination();
        if (filterType === 'id') {
            setSearchParams({ filterType, id });
            setShowPagination(false);
        }
        if (filterType === 'firstName') {
            setSearchParams({ filterType, firstName, currentPage, itemsPerPage });
            setShowPagination(true);
        }
        if (filter === false) {
            setFilter(true);
        }
        else {
            userTable();
        }
    }


    const handleReset = () => {
        setFilterType('');
        setId('');
        setFirstName('');
        setShowFilterButton(true);
        resetPagination();
        setFilter(false);
        setShowPagination(true);
        setSearchParams({});
    };



    const userTable = async () => {
        try {
            let response = {};
            if (filterType === 'firstName') {
                validateFirstName(firstName);
                response = await getAllCustomersByCharacters(currentPage, itemsPerPage, firstName);
            }
            else if (filterType === 'id') {
                validateUserId(id);
                response = await getCustomerById(id);
            }
            else {
                const formData = {
                    currentPage: currentPage,
                    itemsPerPage: itemsPerPage
                }
                response = await getAllCustomers(formData);
            }
            console.log("data in emp dash", data)
            setData(
                response
            );

            setKeysToBeIncluded(["customerId", "firstName", "lastName", "isActive", "isApproved", "dateOfBirth"]);

        } catch (error) {
            setData([]);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An unexpected error occurred. Please try again later.");
            }
        }
    };

    const generateData = () => {
        return [
            {
                id: 1,
                name: "Total policyAccounts",
                percentValues: counts.policyAccounts,
            },
            {
                id: 2,
                name: "Total activePolicyAccounts",
                percentValues: counts.activePolicyAccounts,
            },
            {
                id: 3,
                name: "Total inActivePolicyAccounts",
                percentValues: counts.inActivePolicyAccounts,
            },
            {
                id: 4,
                name: "Total withdrawals",
                percentValues: counts.withdrawals,
            },
            {
                id: 5,
                name: "Total approvedWithdrawals",
                percentValues: counts.approvedWithdrawals,
            },
            {
                id: 6,
                name: "Total notApprovedWithdrawals",
                percentValues: counts.notApprovedWithdrawals,
            },
            {
                id: 7,
                name: "Total agents",
                percentValues: counts.agents,
            },
            {
                id: 8,
                name: "Total activeAgents",
                percentValues: counts.activeAgents,
            },
            {
                id: 9,
                name: "Total inactiveAgents",
                percentValues: counts.inactiveAgents,
            },
            {
                id: 10,
                name: "Total allCommissions",
                percentValues: counts.allCommissions,
            },

            {
                id: 11,
                name: "Total approvedCommissions",
                percentValues: counts.approvedCommissions,
            },
            {
                id: 12,
                name: "Total notApprovedCommissions",
                percentValues: counts.notApprovedCommissions,
            },
            {
                id: 13,
                name: "Total customers",
                percentValues: counts.customers,
            },
            {
                id: 14,
                name: "Total activeCustomers",
                percentValues: counts.activeCustomers,
            },
            {
                id: 15,
                name: "Total inactiveCustomers",
                percentValues: counts.inactiveCustomers,
            },
            {
                id: 16,
                name: "Total notApprovedCustomers",
                percentValues: counts.notApprovedCustomers,
            },
        ];
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                console.log("in fetchEmployeeDashboard")
                const response = await fetchEmployeeDashboard();

                setCounts(response);
                console.log(response);

            } catch (error) {
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast("An unexpected error occurred. Please try again later.");
                }
            }
        };
        fetchDashboard();
    }, []);

    useEffect(() => {
        const filterTypeParam = searchParams.get('filterType') || '';
        const idParam = searchParams.get('id') || '';
        const firstNameParam = searchParams.get('firstName') || '';
        const currentPageParam = Number(searchParams.get('currentPage')) || 1;
        const itemsPerPageParam = Number(searchParams.get('itemsPerPage')) || 10;
        console.log(filterTypeParam, idParam, firstNameParam, currentPageParam, itemsPerPageParam);
        if (filterTypeParam === 'id' || filterTypeParam === 'firstName') {
            setFilterType(filterTypeParam);
            setShowFilterButton(!filterTypeParam);
            setFilter(true);
            if (filterTypeParam === 'firstName') {
                setFirstName(firstNameParam);
                handlePageChange(currentPageParam);
                handleItemsPerPageChange(itemsPerPageParam);
            } else if (filterTypeParam === 'id') {
                setId(idParam);
                setShowPagination(false);
                resetPagination();
            }
        } else {
            setShowFilterButton(true);
            setId('');
            setFirstName('');
            setFilterType('');
            setFilter(false);
            setShowPagination(true);
            resetPagination();
        }
    }, [searchParams]);


    useEffect(() => {
        const hasSearchParams = searchParams.toString() !== '';

        if (!hasSearchParams) {
            setShowFilterButton(true);
            setId('');
            setFirstName('');
            setFilterType('');
            setFilter(false);
            setShowPagination(true);
            resetPagination();
        }
        const timeoutId = setTimeout(() => {
            userTable();
        }, hasSearchParams ? 0 : 0);
        return () => clearTimeout(timeoutId);

    }, [filter, currentPage, itemsPerPage, searchParams]);



    return (
        <>
            <AreaTop pageTitle={"Employee Dashboard"} pagePath={"Dashboard"} pageLink={`/employee/dashboard/${routeParams.id}`} />
            <section className="content-area-cards">
                <Card
                    colors={["#e4e8ef", "#4ce13f"]}
                    percentFillValue={(counts.activePolicyAccounts / (counts.policyAccounts || 1)) * 100}
                    cardInfo={{
                        title: "activePolicyAccounts",
                        value: counts.activePolicyAccounts,
                        text: "activePolicyAccounts",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.inActivePolicyAccounts / (counts.totalCustomers || 1)) * 100}
                    cardInfo={{
                        title: "Inactive accounts",
                        value: counts.inActivePolicyAccounts,
                        text: "Current Inactive accounts",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#4ce13f"]}
                    percentFillValue={(counts.approvedWithdrawals / (counts.withdrawals || 1)) * 100}
                    cardInfo={{
                        title: "approved withdrawals",
                        value: counts.approvedWithdrawals,
                        text: "approved withdrawals",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.notApprovedWithdrawals / (counts.withdrawals || 1)) * 100}
                    cardInfo={{
                        title: "not approved withdrawals",
                        value: counts.notApprovedWithdrawals,
                        text: "not approved withdrawals",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.agents / (counts.agents || 1)) * 100}
                    cardInfo={{
                        title: "agents",
                        value: counts.agents,
                        text: "agents",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.activeAgents / (counts.agents || 1)) * 100}
                    cardInfo={{
                        title: "activeAgents",
                        value: counts.activeAgents,
                        text: "activeAgents",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.inactiveAgents / (counts.agents || 1)) * 100}
                    cardInfo={{
                        title: "inactiveAgents",
                        value: counts.inactiveAgents,
                        text: "inactiveAgents",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.allCommissions / (counts.allCommissions || 1)) * 100}
                    cardInfo={{
                        title: "allCommissions",
                        value: counts.allCommissions,
                        text: "allCommissions",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.approvedCommissions / (counts.allCommissions || 1)) * 100}
                    cardInfo={{
                        title: "approvedCommissions",
                        value: counts.notApprovedWithdrawals,
                        text: "approvedCommissions",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.notApprovedCommissions / (counts.allCommissions || 1)) * 100}
                    cardInfo={{
                        title: "notApprovedCommissions",
                        value: counts.notApprovedCommissions,
                        text: "notApprovedCommissions",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.customers / (counts.customers || 1)) * 100}
                    cardInfo={{
                        title: "customers",
                        value: counts.customers,
                        text: "customers",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.activeCustomers / (counts.customers || 1)) * 100}
                    cardInfo={{
                        title: "activeCustomers",
                        value: counts.activeCustomers,
                        text: "activeCustomers",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.inactiveCustomers / (counts.customers || 1)) * 100}
                    cardInfo={{
                        title: "inactiveCustomers",
                        value: counts.inactiveCustomers,
                        text: "inactiveCustomers",
                    }}
                />
                <Card
                    colors={["#e4e8ef", "#f29a2e"]}
                    percentFillValue={(counts.notApprovedCustomers / (counts.customers || 1)) * 100}
                    cardInfo={{
                        title: "notApprovedCustomers",
                        value: counts.notApprovedCustomers,
                        text: "notApprovedCustomers",
                    }}
                />
            </section>
            <section className="content-area-charts">
                <ProgressBar data={generateData()} />
            </section>
            <section className="content-area-table">
                <div className="data-table-infor">
                    <h3 className="data-table-title">All Users</h3>
                    {showFilterButton && (
                        <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
                    )}
                    {(filterType === 'firstName' || filterType === 'id') && (
                        <div className="filter-container">
                            {filterType === 'firstName' && (
                                <div className="filter">
                                    <input type="text" placeholder="Enter Characters" className="form-input" name={firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                            )}
                            {filterType === 'id' && (
                                <div className="filter">
                                    <input type="number" placeholder="Enter User Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
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
                        showPagination={showPagination}
                    />
                </div>
            </section>
            <ToastContainer position="bottom-right" />
        </>
    )
}
