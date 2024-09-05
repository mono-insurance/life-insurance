package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.NomineeRelation;
import com.monocept.app.utils.PageResult;
import com.monocept.app.utils.PagedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AgentServiceImp implements AgentService {
    private final DtoService dtoService;
    private final AccessConService accessConService;
    private final AgentRepository agentRepository;
    private final CityRepository cityRepository;
    private final StateRepository stateRepository;
    private final AuthRepository authRepository;
    private final AddressRepository addressRepository;
    private final RoleRepository roleRepository;
    
    @Autowired
	private PasswordEncoder passwordEncoder;

    public AgentServiceImp(DtoService dtoService, AccessConService accessConService, AgentRepository agentRepository,
                           CityRepository cityRepository, StateRepository stateRepository, AuthRepository authRepository,
                           AddressRepository addressRepository, RoleRepository roleRepository) {
        this.dtoService = dtoService;
        this.accessConService = accessConService;
        this.agentRepository = agentRepository;
        this.cityRepository = cityRepository;
        this.stateRepository = stateRepository;
        this.authRepository = authRepository;
        this.addressRepository = addressRepository;
        this.roleRepository = roleRepository;
    }


    
    
	@Override
	public Long agentRegisterRequest(RegistrationDTO registrationDTO) {
		Agent agent = new Agent();
		agent.setFirstName(registrationDTO.getFirstName());
		agent.setLastName(registrationDTO.getLastName());
		agent.setDateOfBirth(registrationDTO.getDateOfBirth());
		agent.setIsActive(true);
		agent.setIsApproved(false);
        
        Address address = new Address();
        address.setFirstStreet(registrationDTO.getFirstStreet());
        address.setLastStreet(registrationDTO.getLastStreet());
        address.setPincode(registrationDTO.getPincode());
        
        State state = stateRepository.findById(registrationDTO.getStateId())
            .orElseThrow(() -> new UserException("State not found"));
        if (!state.getIsActive()) {
            throw new UserException("Selected state is inactive");
        }

        City city = cityRepository.findById(registrationDTO.getCityId())
            .orElseThrow(() -> new UserException("City not found"));
        if (!city.getIsActive()) {
            throw new UserException("Selected city is inactive");
        }
        
        address.setState(state);
        address.setCity(city);
        
        address = addressRepository.save(address);
        agent.setAddress(address);
        
        Credentials credentials = new Credentials();
        credentials.setUsername(registrationDTO.getUsername());
        credentials.setEmail(registrationDTO.getEmail());
        credentials.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        credentials.setMobileNumber(registrationDTO.getMobileNumber());
        credentials.setAgent(agent);
        
        Role role = roleRepository.findByName("ROLE_AGENT")
                .orElseThrow(() -> new RuntimeException("Role admin not found"));
    	credentials.setRole(role);
        
    	agent.setCredentials(credentials);
        credentials = authRepository.save(credentials);
        
        return credentials.getCustomer().getCustomerId();
	}

    @Override
    public AgentDTO updateAgent(AgentDTO agentDTO) {
        accessConService.checkSameUserOrRole(agentDTO.getAgentId());
        Agent agent = findAgent(agentDTO.getAgentId());
        agent = updatethisAgent(agent, agentDTO);
        agent = agentRepository.save(agent);
        return dtoService.convertAgentToAgentDto(agent);
    }

    private Agent findAgent(Long agentId) {
        return agentRepository.findById(agentId).
                orElseThrow(() -> new NoSuchElementException("agent not found"));
    }

    private Agent updatethisAgent(Agent agent, AgentDTO agentDTO) {
        Address address = dtoService.convertDtoToAddress(agentDTO.getAddress());
        agent.setAddress(address);
        agent.setFirstName(agentDTO.getFirstName());
        agent.setLastName(agentDTO.getLastName());
        agent.setDateOfBirth(agentDTO.getDateOfBirth());
        agent.setIsApproved(false);
        Credentials credentials = dtoService.convertCredentialResponseDtoToCredentials(agent.getCredentials(), agentDTO.getCredentials());
        authRepository.save(credentials);
        return agent;
    }

    private Address updateAgentAddress(Address agentAddress, AddressDTO address) {
        agentAddress.setFirstStreet(address.getFirstStreet());
        agentAddress.setLastStreet(address.getLastStreet());
//        state and city
        dtoService.updateCityAndState(agentAddress, address);

        agentAddress.setPincode(address.getPincode());
        return addressRepository.save(agentAddress);

    }


    @Override
    public AgentDTO viewProfile(Long agentId) {
        Agent agent = findAgent(agentId);
        return dtoService.convertAgentToAgentDto(agent);
    }

    @Override
    public PagedResponse<PolicyAccountDTO> getAllCustomerAccounts(int pageNo, int size, String sort,
                                                                 String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<PolicyAccount> policyAccounts = agent.getPolicyAccounts();
        PageResult pageResult = dtoService.convertToPage(policyAccounts, pageNo, sort, sortBy, sortDirection, size);
        List policyAccountDTOS = dtoService.convertPolicyAccountsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                policyAccountDTOS,
                pageNo,
                size,
                policyAccounts.size(),
                (policyAccounts.size() + size - 1) / size,
                end == policyAccounts.size()
        );
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAgentCommission(int pageNo, int size, String sort,
                                                                   String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<WithdrawalRequests> withdrawalRequests = agent.getWithdrawalRequests();
        PageResult pageResult = dtoService.convertWithdrawalsToPage(withdrawalRequests, pageNo, sort, sortBy, sortDirection, size);
        List withDrawalDTO = dtoService.convertWithdrawalsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                withDrawalDTO,
                pageNo,
                size,
                withdrawalRequests.size(),
                (withdrawalRequests.size() + size - 1) / size,
                end == withdrawalRequests.size()
        );
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getWithdrawalCommission(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<WithdrawalRequests> withdrawalRequests = agent.getWithdrawalRequests()
                .stream()
                .filter(WithdrawalRequests::getIsApproved)
                .collect(Collectors.toList());
        PageResult pageResult = dtoService.convertWithdrawalsToPage(withdrawalRequests, pageNo, sort, sortBy, sortDirection, size);
        List withDrawalDTO = dtoService.convertWithdrawalsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                withDrawalDTO,
                pageNo,
                size,
                withdrawalRequests.size(),
                (withdrawalRequests.size() + size - 1) / size,
                end == withdrawalRequests.size()
        );
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaims(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<PolicyAccount> policyAccounts=agent.getPolicyAccounts();
        List<WithdrawalRequests> withdrawalRequests=new ArrayList<>();
        for(PolicyAccount policyAccount:policyAccounts){
            withdrawalRequests.addAll(policyAccount.getWithdrawalRequests());
        }
        PageResult pageResult = dtoService.convertWithdrawalsToPage(withdrawalRequests, pageNo, sort, sortBy, sortDirection, size);
        List withDrawalDTO = dtoService.convertWithdrawalsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                withDrawalDTO,
                pageNo,
                size,
                withdrawalRequests.size(),
                (withdrawalRequests.size() + size - 1) / size,
                end == withdrawalRequests.size()
        );
    }

    @Override
    public PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<PolicyAccount> policyAccounts=agent.getPolicyAccounts();
        List<Customer> customerList=new ArrayList<>();
        for(PolicyAccount policyAccount:policyAccounts){
            customerList.add(policyAccount.getCustomer());
        }
        PageResult pageResult = dtoService.convertCustomersToPage(customerList, pageNo, sort, sortBy, sortDirection, size);
        List<CustomerDTO> customerDto = dtoService.convertCustomersToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                customerDto,
                pageNo,
                size,
                customerList.size(),
                (customerList.size() + size - 1) / size,
                end == customerList.size()
        );
    }
    
    
    @Override
    public PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Agent> agentPage = agentRepository.findAll(pageable);
        List<Agent> agents = agentPage.getContent();
        List<AgentDTO> agentDTOS=dtoService.convertAgentsToDto(agents);
        return new PagedResponse<>(agentDTOS, agentPage.getNumber(),
                agentPage.getSize(), agentPage.getTotalElements(), agentPage.getTotalPages(),
                agentPage.isLast());
    }

    @Override
    public Boolean deleteAgent(Long agentId) {
        Agent agent=findAgentById(agentId);
        if(!agent.getIsActive()){
            throw new NoSuchElementException("agent is already deleted");
        }
        agent.setIsActive(false);
        agentRepository.save(agent);
        return true;
    }

    private Agent findAgentById(Long agentId) {
        return agentRepository.findById(agentId).orElseThrow(()->new NoSuchElementException("agent not found"));
    }

    @Override
    public Boolean activateAgent(Long agentId) {
        Agent agent=findAgentById(agentId);
        if(agent.getIsActive()) throw new NoSuchElementException("agent is already activated");
        agent.setIsActive(true);
        agentRepository.save(agent);
        return true;
    }
    
    
    
	@Override
	public Boolean approveAgent(Long agentId) {
		Agent agent=findAgentById(agentId);
		agent.setIsApproved(true);
		agentRepository.save(agent);
//		send email to agent
		return true;
	}
	
	
	
	
	
	
//    @Override
//    public Long agentRegisterRequest(RegistrationDTO registrationDTO) {
////        first set credentials
//        CredentialsResponseDTO credentialsResponseDTO = registrationDTO.getCredentials();
//        Credentials credentials = new Credentials();
//        Role role = roleRepository.findByName("ROLE_AGENT").get();
//        credentials.setRole(role);
//        credentials.setMobileNumber(credentialsResponseDTO.getMobileNumber());
//        credentials.setEmail(credentialsResponseDTO.getEmail());
//        credentials.setUsername(credentialsResponseDTO.getUsername());
//        credentials = authRepository.save(credentials);
//        role.getCredentials().add(credentials);
//        roleRepository.save(role);
//
//        Agent agent = new Agent();
//        agent.setCredentials(credentials);
//        AddressDTO addressDTO = registrationDTO.getAddress();
//        Address address = dtoService.convertDtoToAddress(addressDTO);
//        agent.setAddress(address);
//        agent.setIsActive(false);
//        agent.setIsApproved(false);
//        agent.setFirstName(registrationDTO.getFirstName());
//        agent.setLastName(registrationDTO.getLastName());
//        agent = agentRepository.save(agent);
//        return agent.getAgentId();
//    }

}
