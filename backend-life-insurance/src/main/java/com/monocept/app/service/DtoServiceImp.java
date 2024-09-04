package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.StateRepository;
import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.NomineeRelation;
import com.monocept.app.utils.PageResult;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DtoServiceImp implements DtoService{
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;

    public DtoServiceImp(StateRepository stateRepository, CityRepository cityRepository) {
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;

    }

    @Override
    public AdminDTO convertToAdminResponseDTO(Admin admin) {
        return new AdminDTO(
                admin.getAdminId(),
                admin.getFirstName(),
                admin.getLastName(),
                convertToCredentialsDTO(admin.getCredentials())
        );
    }

    @Override
    public Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO) {
        Employee employee=new Employee();
//        employee.setFirstName(employeeDTO.getFirstName());
//        employee.setLastName(employeeDTO.getLastName());
//        employee.setQualification(employeeDTO.getQualification());
//        employee.setDateOfBirth(employeeDTO.getDateOfBirth());
//        employee.setIsActive(true);
        return employee;
    }

    @Override
    public Customer convertCustomerDtoToCustomer(RegistrationDTO customerDTO) {
        Customer customer=new Customer();
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setIsApproved(false);
        customer.setGender(GenderType.valueOf(customerDTO.getGender()));
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setNomineeName(customerDTO.getNomineeName());
        customer.setNomineeRelation(NomineeRelation.valueOf(customerDTO.getNomineeRelation()));
        customer.setIsActive(false);
        return customer;
    }

    @Override
    public Agent convertAgentDtoToAgent(AgentDTO agentDTO) {
//        Agent agent=new Agent();
//        agent
        return null;
    }

    @Override
    public AgentDTO convertAgentToAgentDto(Agent agent) {
        AgentDTO agentDTO=new AgentDTO();
        agentDTO.setAgentId(agent.getAgentId());
        agentDTO.setFirstName(agent.getFirstName());
        agentDTO.setLastName(agent.getLastName());
        agentDTO.setQualification(agent.getQualification());
        agentDTO.setDateOfBirth(agent.getDateOfBirth());
        agentDTO.setIsApproved(agent.getIsApproved());
        agentDTO.setIsActive(agent.getIsActive());
        AddressDTO addressDTO=convertAddressToDto(agent.getAddress());
        agentDTO.setAddress(addressDTO);
        CredentialsResponseDTO credentialsResponseDTO=convertToCredentialsDTO(agent.getCredentials());
        agentDTO.setCredentials(credentialsResponseDTO);
        return agentDTO;
    }

    @Override
    public AddressDTO convertAddressToDto(Address address) {
    AddressDTO addressDTO=new AddressDTO();
    addressDTO.setCity(address.getCity().getCityName());
    addressDTO.setState(address.getState().getStateName());
    addressDTO.setPincode(address.getPincode());
    addressDTO.setFirstStreet(address.getFirstStreet());
    addressDTO.setLastStreet(address.getLastStreet());
    return addressDTO;
    }

    @Override
    public Address convertDtoToAddress(AddressDTO addressDTO) {
        Address address=new Address();
        address.setPincode(addressDTO.getPincode());
        address.setFirstStreet(addressDTO.getFirstStreet());
        address.setLastStreet(addressDTO.getLastStreet());
        updateCityAndState(address,addressDTO);
        return  address;
    }
    @Override
    public void updateCityAndState(Address agentAddress, AddressDTO address) {
        if(!agentAddress.getState().getStateName().equals(address.getState())){
            State state= stateRepository.findByStateName(address.getState());
            if(state==null) {
                throw new NoSuchElementException("state not found");
            }
            agentAddress.setState(state);
        }
        City cityInState = agentAddress.getState().getCities().stream()
                .filter(city -> city.getCityName().equals(address.getCity()))
                .findFirst()
                .orElse(null);
        if(cityInState==null) {
            throw new NoSuchElementException("city not found");
        }
        agentAddress.setCity(cityInState);
    }

    @Override
    public Credentials convertCredentialResponseDtoToCredentials(Credentials credentials, CredentialsResponseDTO credentialsResponseDTO) {
        credentials.setEmail(credentialsResponseDTO.getEmail());
        credentials.setMobileNumber(credentialsResponseDTO.getMobileNumber());
        credentials.setUsername(credentialsResponseDTO.getUsername());
        return credentials;
    }

    @Override
    public PageResult convertToPage(List<PolicyAccount> policyAccountList, int pageNo, String sort, String sortBy,
                                    String sortDirection, int size) {
        Comparator<PolicyAccount> comparator;

        switch (sortBy.toLowerCase()) {
            case "policyAccountId":
                comparator = Comparator.comparing(PolicyAccount::getPolicyAccountId); // Assuming account number is a String
                break;
            case "paymentTimeInMonths":
                comparator = Comparator.comparing(PolicyAccount::getPaymentTimeInMonths); // Assuming balance is a BigDecimal
                break;
            case "createddate":
                comparator = Comparator.comparing(PolicyAccount::getCreatedDate); // Assuming created date is a LocalDateTime
                break;
            default:
                comparator = Comparator.comparing(PolicyAccount::getIsActive); // Default sort by ID or any default field
                break;
        }

        // If descending order is required, reverse the comparator
        if (sortDirection.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        policyAccountList.sort(comparator);

        // Step 3: Implement pagination using subList method
        int start = pageNo * size;
        int end = Math.min((start + size), policyAccountList.size());
        List<PolicyAccount> result=policyAccountList.subList(start, end);
        return new PageResult(result,end);
    }

    @Override
    public List<PolicyAccountDTO> convertPolicyAccountsToDto(List<PolicyAccount> policyAccounts) {
        List<PolicyAccountDTO> policyAccountDTOS=new ArrayList<>();
        for(PolicyAccount policyAccount:policyAccounts){
            policyAccountDTOS.add(convertPolicyAccountToDto(policyAccount));
        }
        return policyAccountDTOS;
    }

    private PolicyAccountDTO convertPolicyAccountToDto(PolicyAccount policyAccount) {
        PolicyAccountDTO policyAccountDTO=new PolicyAccountDTO();
        policyAccountDTO.setPolicyAccountId(policyAccount.getPolicyAccountId());
        policyAccountDTO.setIsActive(policyAccount.getIsActive());
        policyAccountDTO.setPolicyTerm(policyAccountDTO.getPolicyTerm());
        policyAccountDTO.setCreatedDate(policyAccount.getCreatedDate());
        policyAccountDTO.setClaimAmount(policyAccountDTO.getClaimAmount());
        policyAccountDTO.setCustomerId(policyAccountDTO.getCustomerId());
        policyAccountDTO.setMaturedDate(policyAccount.getMaturedDate());
        policyAccountDTO.setAgentId(policyAccountDTO.getAgentId());
        policyAccountDTO.setPaymentTimeInMonths(policyAccountDTO.getPaymentTimeInMonths());
        policyAccountDTO.setTotalAmountPaid(policyAccount.getTotalAmountPaid());
        policyAccountDTO.setPolicyId(policyAccountDTO.getPolicyId());
        policyAccountDTO.setTimelyBalance(policyAccountDTO.getTimelyBalance());
        return policyAccountDTO;

    }

    @Override
    public PageResult convertWithdrawalsToPage(List<WithdrawalRequests> withdrawalRequests, int pageNo,
                                               String sort, String sortBy, String sortDirection, int size) {
        Comparator<WithdrawalRequests> comparator;

        switch (sortBy.toLowerCase()) {
            case "withdrawalRequestsId":
                comparator = Comparator.comparing(WithdrawalRequests::getWithdrawalRequestsId); // Assuming account number is a String
                break;
            case "amount":
                comparator = Comparator.comparing(WithdrawalRequests::getAmount); // Assuming balance is a BigDecimal
                break;
            default:
                comparator = Comparator.comparing(WithdrawalRequests::getAmount); // Default sort by ID or any default field
                break;
        }

        // If descending order is required, reverse the comparator
        if (sortDirection.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        withdrawalRequests.sort(comparator);

        // Step 3: Implement pagination using subList method
        int start = pageNo * size;
        int end = Math.min((start + size), withdrawalRequests.size());
        List<WithdrawalRequests> result=withdrawalRequests.subList(start, end);
        return new PageResult(result,end);
    }

    @Override
    public List<WithdrawalRequestsDTO>  convertWithdrawalsToDto(List<WithdrawalRequests>  withdrawalRequests) {
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS=new ArrayList<>();
        for(WithdrawalRequests withdrawalRequest:withdrawalRequests){
            withdrawalRequestsDTOS.add(convertWithdrawalToDto(withdrawalRequest));
        }
        return null;
    }

    @Override
    public PageResult convertCustomersToPage(List<Customer> customerList, int pageNo, String sort, String sortBy, String sortDirection, int size) {
        return null;
    }

    @Override
    public List<CustomerDTO> convertCustomersToDto(List<Customer> customers) {
        List<CustomerDTO>customerDTOS=new ArrayList<>();
        for(Customer customer:customers){
            customerDTOS.add(convertCustomerToDto(customer));
        }
        return customerDTOS;
    }

    @Override
    public EmployeeDTO convertEmployeeToDTO(Employee employee) {
        return new EmployeeDTO(employee.getEmployeeId(),employee.getFirstName(),
                employee.getLastName(),employee.getDateOfBirth(),employee.getQualification(),
                employee.getIsActive(),convertToCredentialsDTO(employee.getCredentials()));
    }

    @Override
    public List<AgentDTO> convertAgentsToDto(List<Agent> agents) {
        List<AgentDTO> agentDTOS=new ArrayList<>();
        for(Agent agent:agents){
            agentDTOS.add(convertAgentToAgentDto(agent));
        }
        return agentDTOS;
    }

    private CustomerDTO convertCustomerToDto(Customer customer) {
        CustomerDTO customerDTO=new CustomerDTO();
        customerDTO.setCustomerId(customer.getCustomerId());
        customerDTO.setAddress(convertAddressToDto(customer.getAddress()));
        customerDTO.setCredentials(convertToCredentialsDTO(customer.getCredentials()));
        customerDTO.setGender(customer.getGender());
        customerDTO.setFirstName(customer.getFirstName());
        customerDTO.setLastName(customer.getLastName());
        customerDTO.setIsActive(customer.getIsActive());
        customerDTO.setIsApproved(customer.getIsApproved());
        customerDTO.setDateOfBirth(customer.getDateOfBirth());
        customerDTO.setNomineeRelation(customer.getNomineeRelation());
        customerDTO.setNomineeName(customer.getNomineeName());
        return customerDTO;
    }

    private WithdrawalRequestsDTO convertWithdrawalToDto(WithdrawalRequests withdrawalRequest) {
        WithdrawalRequestsDTO withdrawalRequestsDTO=new WithdrawalRequestsDTO();
        withdrawalRequestsDTO.setAmount(withdrawalRequest.getAmount());
        withdrawalRequestsDTO.setIsWithdraw(withdrawalRequest.getIsWithdraw());
        withdrawalRequestsDTO.setRequestType(withdrawalRequest.getRequestType());
        withdrawalRequestsDTO.setIsApproved(withdrawalRequest.getIsApproved());
        withdrawalRequestsDTO.setWithdrawalRequestsId(withdrawalRequest.getWithdrawalRequestsId());
        return withdrawalRequestsDTO;
    }


    private CredentialsResponseDTO convertToCredentialsDTO(Credentials credentials) {
        return new CredentialsResponseDTO(
                credentials.getId(),
                credentials.getUsername(),
                credentials.getEmail(),
                credentials.getMobileNumber(),
                credentials.getRole().getName()
        );
    }
}
