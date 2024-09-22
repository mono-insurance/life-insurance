import React, { useState, useEffect, useRef } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  getAllDocuments, 
  getAllDisapprovedDocuments, 
  getAllDocumentsByAgentId, 
  getAllDocumentsByCustomerId,
  approveDocument
} from '../../../services/AdminServices';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import './documents.scss';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import { validateAgentId, validateCustomerId } from '../../../utils/validations/Validations';

export const Documents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);
  const { id: adminId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumentDetails, setSelectedDocumentDetails] = useState(null);

  const prevCurrentPageRef = useRef(currentPage);
  const prevItemsPerPageRef = useRef(itemsPerPage);

  const filterOptions = [
    { label: 'Disapproved Documents', value: 'disapprovedDocuments' },
    { label: 'By Customer ID', value: 'byCustomerId' },
    { label: 'By Agent ID', value: 'byAgentId' }
  ];

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleSearch = () => {
    resetPagination();
    if (['byCustomerId', 'byAgentId'].includes(filterType)) {
      setSearchParams({ filterType, id, currentPage, itemsPerPage });
    } else if(filterType === 'disapprovedDocuments') {
      setSearchParams({ filterType, currentPage, itemsPerPage });
    }
    setShowFilterButton(false);
  }

  const handleReset = () => {
    setFilterType('');
    setId('');
    setShowFilterButton(true);
    resetPagination();
    setShowPagination(true);
    setSearchParams({ currentPage: 1, itemsPerPage: 10 });
  };

  const handleActivateDocument = async (documentId) => {
    try {
        setLoading(true);
      await approveDocument(documentId);
      successToast("Document activated successfully!");
      fetchData(filterType, currentPage, itemsPerPage, id); // Refresh data after activation
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error activating document';
      errorToast(errorMessage);
    }finally{
        setLoading(false);
    }
  };

  const openDocumentModal = (doc) => {
    setSelectedDocumentDetails(doc);
    setIsModalOpen(true);
};

// Close document modal
const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocumentDetails(null);
};

  const fetchData = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams) => {
    try {
      let response = {};
      setLoading(true);
      switch (filterTypeFromParams) {
        case 'disapprovedDocuments':
          response = await getAllDisapprovedDocuments(currentPageFromParams, itemsPerPageFromParams);
          break;
        case 'byCustomerId':
          validateCustomerId(idFromParams);
          response = await getAllDocumentsByCustomerId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        case 'byAgentId':
          validateAgentId(idFromParams);
          response = await getAllDocumentsByAgentId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        default:
          response = await getAllDocuments(currentPageFromParams, itemsPerPageFromParams);
      }

      const transformedData = response.content.map((document, index) => {
        const isApproved = document.isApproved;

        // Activate column logic
        let activateColumnContent;
        if (!isApproved) {
          activateColumnContent = (
            <button 
              className="bg-indigo-500 text-white py-1 px-2 rounded-md hover:bg-gray-500" 
              onClick={() => handleActivateDocument(document.documentId)}
            >
              Activate
            </button>
          );
        }else {
            activateColumnContent = (<p className="text-gray-500 font-semibold">Approved</p>);
          }

        // Name column with modal logic
        const viewColumnContent = (
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => openDocumentModal(document)}
          >
            View
          </span>
        );

        return {
          ...document,
          action: activateColumnContent,
          view: viewColumnContent,
        };
      });

      setData({
        ...response,
        content: transformedData,
      });
      setKeysToBeIncluded([
        'documentId',
        'documentType',
        'customerId',
        'agentId',
        'isApproved',
        'action',
        'view'
      ]);
    } catch (error) {
      setData([]);
      const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterTypeFromParams = searchParams.get('filterType') || '';
    const currentPageFromParams = parseInt(searchParams.get('currentPage')) || 1;
    const itemsPerPageFromParams = parseInt(searchParams.get('itemsPerPage')) || 10;
    const idFromParams = searchParams.get('id') || '';

    if (filterTypeFromParams === 'byCustomerId' || filterTypeFromParams === 'byAgentId') {
        setFilterType(filterTypeFromParams);
        setShowFilterButton(false);
        setShowPagination(true);
        setId(idFromParams);
      } else if(filterTypeFromParams === 'disapprovedDocuments'){
        setFilterType(filterTypeFromParams);
        setShowFilterButton(false);
        setShowPagination(true);
      }
      else{
        setFilterType('');
        setShowFilterButton(true);
        setShowPagination(true);
      }
    if (currentPageFromParams !== prevCurrentPageRef.current || itemsPerPageFromParams !== prevItemsPerPageRef.current) {
      prevCurrentPageRef.current = currentPageFromParams;
      prevItemsPerPageRef.current = itemsPerPageFromParams;
      setCurrentPage(currentPageFromParams);
      setItemsPerPage(itemsPerPageFromParams);
    }

    fetchData(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams);

  }, [searchParams]);


  useEffect(() => {
    if (currentPage != prevCurrentPageRef.current || itemsPerPage != prevItemsPerPageRef.current) {
      prevCurrentPageRef.current = currentPage;
      prevItemsPerPageRef.current = itemsPerPage;
      setSearchParams({
        filterType: searchParams.get('filterType'),
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
      });
    }

  }, [currentPage, itemsPerPage, setSearchParams, searchParams]);

  return (
    <>
      <div className='content-area-documents'>
        {loading && <Loader />}
        <AreaTop pageTitle={"Get All Documents"} pagePath={"Documents"} pageLink={`/suraksha/admin/dashboard/${adminId}`}/>
        <section className="content-area-table-documents">
          <div className="data-table-information">
            <h3 className="data-table-title">Documents</h3>
              {showFilterButton && (
                <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
              )}
              {filterType && (
                <div className="filter-container">
                  {(filterType.includes('CustomerId') || filterType.includes('AgentId')) && (
                    <div className="filter">
                      <input type="number" placeholder={filterType.includes('AgentId') ? "Enter Agent Id" : "Enter Customer Id"} className="form-input" value={id} onChange={(e) => setId(e.target.value)}/>
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
              currentPage={currentPage}
              pageSize={itemsPerPage}
              setPage={setCurrentPage}
              setPageSize={setItemsPerPage}
            />
          </div>
          {isModalOpen && selectedDocumentDetails && (
            <div className="fixed z-50 right-20 inset-y-0 flex items-center justify-center overflow-auto">
                {/* Modal backdrop */}
                <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div> 

                {/* Modal content */}
                <div className="relative bg-white p-6 rounded-lg shadow-lg max-h-screen max-w-screen-lg overflow-auto z-60">
                {/* Close button */}
                <button 
                    className="absolute top-2 right-2 text-xl cursor-pointer" 
                    onClick={closeModal}
                >
                    &times; {/* Close icon */}
                </button>

                {/* Image content */}
                <img 
                    src={`data:image/jpeg;base64,${selectedDocumentDetails.imageBase64}`} 
                    alt="Document" 
                    className="max-w-full h-auto" 
                />
                </div>
            </div>
            )}


        </section>
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
};
