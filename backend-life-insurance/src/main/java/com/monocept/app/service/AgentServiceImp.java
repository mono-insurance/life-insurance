package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.repository.*;
import com.monocept.app.utils.PageResult;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AgentServiceImp implements AgentService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final DtoService dtoService;
    private final AccessConService accessConService;
    private final AgentRepository agentRepository;
    private final CityRepository cityRepository;
    private final StateRepository stateRepository;
    private final AuthRepository authRepository;
    private final AddressRepository addressRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final WithdrawalRequestsRepository withdrawalRequestsRepository;

    public AgentServiceImp(DtoService dtoService, AccessConService accessConService, AgentRepository agentRepository,
                           CityRepository cityRepository, StateRepository stateRepository, AuthRepository authRepository,
                           AddressRepository addressRepository, RoleRepository roleRepository, EmailService emailService,
                           WithdrawalRequestsRepository withdrawalRequestsRepository) {
        this.dtoService = dtoService;
        this.accessConService = accessConService;
        this.agentRepository = agentRepository;
        this.cityRepository = cityRepository;
        this.stateRepository = stateRepository;
        this.authRepository = authRepository;
        this.addressRepository = addressRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.withdrawalRequestsRepository = withdrawalRequestsRepository;
    }

    @Override
    public Long agentRegisterRequest(@Valid CredentialsDTO credentialsDTO) {
        Credentials credentials = dtoService.convertCredentialsDtoToCredentials(credentialsDTO);
        credentials.getAgent().setIsActive(false);

        Long id= authRepository.save(credentials).getId();
        EmailDTO emailDTO=new EmailDTO();
        emailDTO.setEmailId(credentialsDTO.getEmail());
        emailDTO.setTitle("Registration Success");
        emailDTO.setBody("Congrats!! you have registered with our company as an agent.\n" +
                " Now, your details will be verified by our company employees" +
                " and your account will be activated\n We will inform you once details verified" +
                "your username is "+credentialsDTO.getUsername());
        emailService.sendAccountCreationEmail(emailDTO);
        return id;
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
    public Boolean withdrawalRequest(Double agentCommission) {
        CustomUserDetails customUserDetails=accessConService.checkUserAccess();
        Long agentId=customUserDetails.getId();
        Agent agent=findAgent(agentId);
        if(agent.getBalance()<agentCommission){
            throw new NoSuchElementException("your balance is less than requested");
        }
        WithdrawalRequests withdrawalRequests=new WithdrawalRequests();
        withdrawalRequests.setAgent(agent);
        withdrawalRequests.setIsWithdraw(false);
        withdrawalRequests.setRequestType("Commission");
        withdrawalRequests.setIsApproved(false);
        withdrawalRequests.setAmount(agentCommission);
        withdrawalRequests=withdrawalRequestsRepository.save(withdrawalRequests);
        agent.getWithdrawalRequests().add(withdrawalRequests);
        agentRepository.save(agent);
        return true;
    }
}
