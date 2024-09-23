package com.monocept.app.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.entity.*;
import com.monocept.app.exception.RoleAccessException;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.QuoteMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamSource;
import org.springframework.stereotype.Service;

import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Transactions;
import com.monocept.app.entity.WithdrawalRequests;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AgentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.PolicyAccountRepository;
import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.repository.WithdrawalRequestsRepository;

@Service
public class DownloadServiceImp implements DownloadService{
	
	@Autowired
	TransactionsRepository transactionRepository;
	
	@Autowired
	PolicyAccountRepository policyAccountRepository;
	
	@Autowired
	CustomerRepository customerRepository;
	
	@Autowired
	AgentRepository agentRepository;
	
	@Autowired
	WithdrawalRequestsRepository withdrawalRequestsRepository;

	@Autowired
	private  AccessConService accessConService;
	
	public ByteArrayInputStream transactionsLoad(int page, int size, String sortBy, String direction) {
		List<Transactions> transactions = getAllTransactions(page,size,sortBy,direction);

	    ByteArrayInputStream in = CSVHelperForTransactionsCSV(transactions);
	    return in;
	  }

	private Customer findCustomer(Long id) {
		return customerRepository.findById(id).orElseThrow(()->new UserException("customer not found"));
	}

	private Agent findAgent(Long id) {
		return agentRepository.findById(id).orElseThrow(()->new UserException("agent not found"));
	}
	private ByteArrayInputStream CSVHelperForTransactionsCSV(List<Transactions> transactions) {
		final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

	    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
	        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
			csvPrinter.printRecord(Arrays.asList(
					"Transaction ID", "Amount", "Agent Commission", "Date"
			));
	      for (Transactions transaction : transactions) {
	        List<String> data = Arrays.asList(
	              String.valueOf(transaction.getTransactionId()),
	              String.valueOf(transaction.getAmount()),  
	              String.valueOf(transaction.getAgentCommission()),
	              String.valueOf(transaction.getTransactionDate())
	            );
	        csvPrinter.printRecord(data);
	      }

	      csvPrinter.flush();
	      return new ByteArrayInputStream(out.toByteArray());
	    } catch (IOException e) {
	      throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
	    }
	}

	

	public ByteArrayInputStream policyAccountLoad(int page, int size, String sortBy, String direction, Boolean isActive) {
		List<PolicyAccount>policyAccounts=getPolicyAccountsInPDF(page,size,sortBy,direction,isActive);
	    ByteArrayInputStream in = CSVHelperForPolicyAccountCSV(policyAccounts);
	    return in;
	  }

	private ByteArrayInputStream CSVHelperForPolicyAccountCSV(List<PolicyAccount> policyAccounts) {
		final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

	    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
	        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
	    	
	    	csvPrinter.printRecord(Arrays.asList(
	                "Policy Account ID", "Created Date", "Matured Date", "Is Active", 
	                "Policy Term", "Payment Time in Months", "Timely Balance", 
	                "Investment Amount", "Total Amount Paid", "Claim Amount", 

	                "Agent Commission", "Customer Name", "Policy ID"

	            ));
	    	
	      for (PolicyAccount policyAccount : policyAccounts) {
	        List<String> data = Arrays.asList(
                  String.valueOf(policyAccount.getPolicyAccountId()),
                  String.valueOf(policyAccount.getCreatedDate()),
                  String.valueOf(policyAccount.getMaturedDate()),
                  String.valueOf(policyAccount.getIsActive()),
                  String.valueOf(policyAccount.getPolicyTerm()),
                  String.valueOf(policyAccount.getPaymentTimeInMonths()),
                  String.valueOf(policyAccount.getTimelyBalance()),
                  String.valueOf(policyAccount.getInvestmentAmount()),
                  String.valueOf(policyAccount.getTotalAmountPaid()),
                  String.valueOf(policyAccount.getClaimAmount()),
                  String.valueOf(policyAccount.getAgentCommissionForRegistration()),
                  (policyAccount.getCustomer().getFirstName()+" "+policyAccount.getCustomer().getLastName()),
					String.valueOf(policyAccount.getPolicy().getPolicyId())
	            );

	        csvPrinter.printRecord(data);
	      }

	      csvPrinter.flush();
	      return new ByteArrayInputStream(out.toByteArray());
	    } catch (IOException e) {
	      throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
	    }
	}


	public ByteArrayInputStream customerLoad(int page, int size, String sortBy, String direction, Boolean isActive) {

		List<Customer> customers =getAllCustomersInPdf( page, size, sortBy, direction, isActive);

	    ByteArrayInputStream in = CSVHelperForCustomersCSV(customers);
	    return in;
	  }

	private ByteArrayInputStream CSVHelperForCustomersCSV(List<Customer> customers) {
		final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

	    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
	        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
	    	
	    	csvPrinter.printRecord(Arrays.asList(
	                "Customer ID", "First Name", "Last Name", "Date of Birth", 
	                "Gender", "Is Active", "Nominee Name", "Nominee Relation", 

	                "Is Approved",  "Credential Username"
	            ));
	    	
	      for (Customer customer : customers) {
	        List<String> data = Arrays.asList(
	        		String.valueOf(customer.getCustomerId()), 
                    customer.getFirstName(),           
                    customer.getLastName() != null ? customer.getLastName() : "",                      
                    String.valueOf(customer.getDateOfBirth()), 
                    String.valueOf(customer.getGender()), 
                    String.valueOf(customer.getIsActive()), 
                    customer.getNomineeName(),  
                    String.valueOf(customer.getNomineeRelation()),

                    String.valueOf(customer.getIsApproved()),

                    customer.getCredentials() != null ? customer.getCredentials().getUsername() : "N/A"
	            );

	        csvPrinter.printRecord(data);
	      }

	      csvPrinter.flush();
	      return new ByteArrayInputStream(out.toByteArray());
	    } catch (IOException e) {
	      throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
	    }
	}

    public ByteArrayInputStream agentLoad(int page, int size, String sortBy, String direction, Boolean isActive) {

		List<Agent> agents = getAllAgentsInPdf(page,size,sortBy,direction,isActive);
        return CSVHelperForAgentsCSV(agents);
    }

    private ByteArrayInputStream CSVHelperForAgentsCSV(List<Agent> agents) {
        final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format)) {

            csvPrinter.printRecord(Arrays.asList(
                "Agent ID", "First Name", "Last Name", "Date of Birth",

                "Qualification", "Is Active", "Is Approved",
                "Credential Username"
            ));

            for (Agent agent : agents) {
                List<String> data = Arrays.asList(
                    String.valueOf(agent.getAgentId()), 
                    agent.getFirstName(),
                    agent.getLastName(),
                    String.valueOf(agent.getDateOfBirth()), 
                    agent.getQualification(),
                    String.valueOf(agent.getIsActive()), 

                    String.valueOf(agent.getIsApproved()),
                    agent.getCredentials() != null ? agent.getCredentials().getUsername() : "N/A"
                );
                csvPrinter.printRecord(data);
            }

            csvPrinter.flush();
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Failed to export agent data to CSV: " + e.getMessage());
        }
    }

    public ByteArrayInputStream withdrawalLoad(int page, int size, String sortBy, String direction, Boolean isActive) {

		List<WithdrawalRequests> withdrawalRequests = getWithdrawals(page,size,sortBy,direction,isActive);

        return CSVHelperForWithdrawalsCSV(withdrawalRequests);
    }

    private ByteArrayInputStream CSVHelperForWithdrawalsCSV(List<WithdrawalRequests> withdrawalRequests) {
        final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format)) {

            csvPrinter.printRecord(Arrays.asList(
                "Withdrawal Request ID", "Request Type", "Amount", 


                "Is Withdraw", "Is Approved"
            ));

            for (WithdrawalRequests request : withdrawalRequests) {
                List<String> data = Arrays.asList(
                    String.valueOf(request.getWithdrawalRequestsId()),
                    request.getRequestType(),
                    String.valueOf(request.getAmount()), 
                    String.valueOf(request.getIsWithdraw()), 
                    String.valueOf(request.getIsApproved())
                );
                csvPrinter.printRecord(data);
            }
            csvPrinter.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export withdrawal request data to CSV: " + e.getMessage());
        }
    }


	public List<Transactions> getAllTransactions(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		Page<Transactions> pages;
		String role= accessConService.getUserRole();
		if(role.equals("AGENT")){
			CustomUserDetails userDetails=accessConService.checkUserAccess();
			Agent agent=findAgent(userDetails.getId());
			List<PolicyAccount> agentAccounts=agent.getPolicyAccounts();
			pages=transactionRepository.findAllByPolicyAccountInAndStatus(agentAccounts,pageable,"Done");
		}
		else if (role.equals("CUSTOMER")){
			CustomUserDetails userDetails=accessConService.checkUserAccess();
			Customer customer=findCustomer(userDetails.getId());

			pages=transactionRepository.findAllByPolicyAccountInAndStatus(customer.getPolicyAccounts(),pageable,"Done");
		}
		else pages = transactionRepository.findAllByStatus(pageable,"Done");

		return pages.getContent();
	}

	@Override
	public List<Transactions> getTransactionByAccountNumber(Long policyId, int page, int size, String sortBy, String direction, Boolean isActive) {
		PolicyAccount policyAccount = policyAccountRepository.findById(policyId).orElseThrow(()->new UserException("Policy Account not found"));

		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

		Page<Transactions> pages = transactionRepository.findAllByPolicyAccountAndStatus(policyAccount,pageable,"Done");
		return pages.getContent();
	}

	@Override
	public List<WithdrawalRequests> getWithdrawals(int page, int size, String sortBy, String direction, Boolean isActive) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		String role=accessConService.getUserRole();
		Page<WithdrawalRequests> pages;
		if(role.equals("AGENT")){
			CustomUserDetails userDetails=accessConService.checkUserAccess();
			Agent agent=findAgent(userDetails.getId());
			if(isActive) pages=withdrawalRequestsRepository.findAllByAgentAndIsApprovedTrue(agent,pageable);
			else pages=withdrawalRequestsRepository.findAllByAgentAndIsApprovedFalse(agent,pageable);
		}
		else if (role.equals("CUSTOMER")){
			CustomUserDetails userDetails=accessConService.checkUserAccess();
			Customer customer=findCustomer(userDetails.getId());
			if(isActive) pages=withdrawalRequestsRepository.findAllByCustomerAndIsApprovedTrue(customer,pageable);
			else pages=withdrawalRequestsRepository.findAllByCustomerAndIsApprovedFalse(customer,pageable);
		}
		else pages = withdrawalRequestsRepository.findAll(pageable);
		return pages.getContent();
	}

	@Override
	public Transactions getTransaction(Long id, int page, int size, String sortBy, String direction) {

		return transactionRepository.findById(id).orElseThrow(()->new UserException("Transaction not found"));
	}

	@Override
	public List<PolicyAccount> getPolicyAccountsInPDF(int page, int size, String sortBy, String direction, Boolean isActive) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		String role=accessConService.getUserRole();
		Page<PolicyAccount> pages;
		if(role.equals("AGENT")){
			CustomUserDetails userDetails=accessConService.checkUserAccess();
			Agent agent=findAgent(userDetails.getId());
			if(isActive) pages=policyAccountRepository.findAllByAgentAndIsActiveTrue(pageable,agent);
			else pages=policyAccountRepository.findAllByAgentAndIsActiveFalse(pageable,agent);
		}
		else if (role.equals("CUSTOMER")){
			CustomUserDetails userDetails=accessConService.checkUserAccess();
			Customer customer=findCustomer(userDetails.getId());
			if(isActive) pages=policyAccountRepository.findByCustomerAndIsActiveTrue(pageable,customer);
			else pages=policyAccountRepository.findByCustomerAndIsActiveFalse(pageable,customer);
		}
		else pages = policyAccountRepository.findAll(pageable);
		return pages.getContent();

	}

	@Override
	public List<Customer> getAllCustomersInPdf(int page, int size, String sortBy, String direction, Boolean isActive) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		String role=accessConService.getUserRole();
		if(role.equals("CUSTOMER")){
			throw new RoleAccessException("not allowed");
		}
		Page<Customer> pages;
		if(role.equals("AGENT")){
			CustomUserDetails userDetails=accessConService.checkUserAccess();
			Agent agent=findAgent(userDetails.getId());
			List<PolicyAccount>policyAccounts=agent.getPolicyAccounts();
			pages=customerRepository.findAllByPolicyAccountsIn(pageable,policyAccounts);
		}
		else pages = customerRepository.findAllByIsApprovedTrue(pageable);
		return pages.getContent();
	}
	

	@Override
	public List<Agent> getAllAgentsInPdf(int page, int size, String sortBy, String direction, Boolean isActive) {
		accessConService.checkEmployeeAccess();
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		Page<Agent> pages;
		if(isActive)  pages = agentRepository.findAllByIsActiveTrue(pageable);
		else  pages = agentRepository.findAllByIsApprovedTrueAndIsActiveFalse(pageable);
		return pages.getContent();
	}
	
		
		public ByteArrayInputStream transactionsLoad() {
		    List<Transactions> transactions = transactionRepository.findAll();

		    ByteArrayInputStream in = CSVHelperForTransactionsAdminCSV(transactions);
		    return in;
		  }

		private ByteArrayInputStream CSVHelperForTransactionsAdminCSV(List<Transactions> transactions) {
			final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

		    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
		        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
		      for (Transactions transaction : transactions) {
		        List<String> data = Arrays.asList(
		              String.valueOf(transaction.getTransactionId()),
		              String.valueOf(transaction.getAmount()),  
		              String.valueOf(transaction.getAgentCommission()),
		              String.valueOf(transaction.getTransactionDate())
		            );

		        csvPrinter.printRecord(data);
		      }

		      csvPrinter.flush();
		      return new ByteArrayInputStream(out.toByteArray());
		    } catch (IOException e) {
		      throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
		    }
		}

		
		public ByteArrayInputStream policyAccountLoad() {
		    List<PolicyAccount> policyAccounts = policyAccountRepository.findAll();

		    ByteArrayInputStream in = CSVHelperForPolicyAccountAdminCSV(policyAccounts);
		    return in;
		  }

		private ByteArrayInputStream CSVHelperForPolicyAccountAdminCSV(List<PolicyAccount> policyAccounts) {
			final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

		    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
		        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
		    	
		    	csvPrinter.printRecord(Arrays.asList(
		                "Policy Account ID", "Created Date", "Matured Date", "Is Active", 
		                "Policy Term", "Payment Time in Months", "Timely Balance", 
		                "Investment Amount", "Total Amount Paid", "Claim Amount", 
		                "Agent Commission", "Customer Name", "Agent Name", "Policy ID"
		            ));
		    	
		      for (PolicyAccount policyAccount : policyAccounts) {
		        List<String> data = Arrays.asList(
		        		String.valueOf(policyAccount.getPolicyAccountId()),
		        		String.valueOf(policyAccount.getCreatedDate()),
		        		String.valueOf(policyAccount.getMaturedDate()),
		        		String.valueOf(policyAccount.getIsActive()),
		        		String.valueOf(policyAccount.getPolicyTerm()),
		        		String.valueOf(policyAccount.getPaymentTimeInMonths()),
		        		String.valueOf(policyAccount.getTimelyBalance()),
		        		String.valueOf(policyAccount.getInvestmentAmount()),
		        		String.valueOf(policyAccount.getTotalAmountPaid()),
		        		String.valueOf(policyAccount.getClaimAmount()),
		        		String.valueOf(policyAccount.getAgentCommissionForRegistration()),
		        		(policyAccount.getCustomer().getFirstName() + " " + policyAccount.getCustomer().getLastName()),
		        		(policyAccount.getAgent() != null ? 
		        		    (policyAccount.getAgent().getFirstName() + " " + policyAccount.getAgent().getLastName()) : " "), 
		        		String.valueOf(policyAccount.getPolicy().getPolicyId())

		            );

		        csvPrinter.printRecord(data);
		      }

		      csvPrinter.flush();
		      return new ByteArrayInputStream(out.toByteArray());
		    } catch (IOException e) {
		      throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
		    }
		}
		
		
		public ByteArrayInputStream customerLoad() {
		    List<Customer> customers = customerRepository.findAll();

		    ByteArrayInputStream in = CSVHelperForCustomersAdminCSV(customers);
		    return in;
		  }

		private ByteArrayInputStream CSVHelperForCustomersAdminCSV(List<Customer> customers) {
			final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

		    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
		        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
		    	
		    	csvPrinter.printRecord(Arrays.asList(
		                "Customer ID", "First Name", "Last Name", "Date of Birth", 
		                "Gender", "Is Active", "Nominee Name", "Nominee Relation", 
		                "Is Approved", "Address", "Credential Username"
		            ));
		    	
		      for (Customer customer : customers) {
		        List<String> data = Arrays.asList(
		        		String.valueOf(customer.getCustomerId()), 
	                    customer.getFirstName(),           
	                    customer.getLastName() != null ? customer.getLastName() : "",                      
	                    String.valueOf(customer.getDateOfBirth()), 
	                    String.valueOf(customer.getGender()), 
	                    String.valueOf(customer.getIsActive()), 
	                    customer.getNomineeName(),  
	                    String.valueOf(customer.getNomineeRelation()),
	                    String.valueOf(customer.getIsApproved()), 
	                    customer.getAddress() != null ? customer.getAddress().getPincode() : "N/A",
	                    customer.getCredentials() != null ? customer.getCredentials().getUsername() : "N/A"
		            );

		        csvPrinter.printRecord(data);
		      }

		      csvPrinter.flush();
		      return new ByteArrayInputStream(out.toByteArray());
		    } catch (IOException e) {
		      throw new RuntimeException("fail to import data to CSV file: " + e.getMessage());
		    }
		}

	    public ByteArrayInputStream agentLoad() {
	        List<Agent> agents = agentRepository.findAll();
	        return CSVHelperForAgentsAdminCSV(agents);
	    }

	    private ByteArrayInputStream CSVHelperForAgentsAdminCSV(List<Agent> agents) {
	        final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);
	        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
	             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format)) {

	            csvPrinter.printRecord(Arrays.asList(
	                "Agent ID", "First Name", "Last Name", "Date of Birth",
	                "Qualification", "Is Active", "Is Approved", "Address", 
	                "Credential Username"
	            ));

	            for (Agent agent : agents) {
	                List<String> data = Arrays.asList(
	                    String.valueOf(agent.getAgentId()), 
	                    agent.getFirstName(),
	                    agent.getLastName(),
	                    String.valueOf(agent.getDateOfBirth()), 
	                    agent.getQualification(),
	                    String.valueOf(agent.getIsActive()), 
	                    String.valueOf(agent.getIsApproved()), 
	                    agent.getAddress() != null ? agent.getAddress().getPincode() : "N/A",
	                    agent.getCredentials() != null ? agent.getCredentials().getUsername() : "N/A"
	                );
	                csvPrinter.printRecord(data);
	            }

	            csvPrinter.flush();
	            return new ByteArrayInputStream(out.toByteArray());

	        } catch (IOException e) {
	            throw new RuntimeException("Failed to export agent data to CSV: " + e.getMessage());
	        }
	    }

	    public ByteArrayInputStream withdrawalLoad() {
	        List<WithdrawalRequests> withdrawalRequests = withdrawalRequestsRepository.findAll();
	        return CSVHelperForWithdrawalsAdminCSV(withdrawalRequests);
	    }

	    private ByteArrayInputStream CSVHelperForWithdrawalsAdminCSV(List<WithdrawalRequests> withdrawalRequests) {
	        final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);
	        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
	             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format)) {

	            csvPrinter.printRecord(Arrays.asList(
	                "Withdrawal Request ID", "Request Type", "Amount", 
	                "Is Withdraw", "Is Approved", "Policy Account ID", 
	                "Agent ID"
	            ));

	            for (WithdrawalRequests request : withdrawalRequests) {
	                List<String> data = Arrays.asList(
	                    String.valueOf(request.getWithdrawalRequestsId()), 
	                    request.getRequestType() != null ? request.getRequestType() : "",  // Null check for requestType
	                    String.valueOf(request.getAmount()),
	                    String.valueOf(request.getIsWithdraw()),
	                    String.valueOf(request.getIsApproved()),

	                    // Null check for PolicyAccount and PolicyAccountId
	                    request.getPolicyAccount() != null && request.getPolicyAccount().getPolicyAccountId() != null ? 
	                        String.valueOf(request.getPolicyAccount().getPolicyAccountId()) : "",

	                    // Null check for Agent and AgentId
	                    request.getAgent() != null && request.getAgent().getAgentId() != null ? 
	                        String.valueOf(request.getAgent().getAgentId()) : ""
	                );
	                csvPrinter.printRecord(data);
	            }

	            csvPrinter.flush();
	            return new ByteArrayInputStream(out.toByteArray());

	        } catch (IOException e) {
	            throw new RuntimeException("Failed to export withdrawal request data to CSV: " + e.getMessage());
	        }
	    }

		@Override
		public List<Transactions> getAllTransactions() {
			return transactionRepository.findAll();
		}

		@Override
		public List<Transactions> getTransactionByAccountNumber(Long policyId) {
			PolicyAccount policyAccount = policyAccountRepository.findById(policyId).orElseThrow(()->new UserException("Policy Account not found"));
			return transactionRepository.findByPolicyAccount(policyAccount);
		}

		@Override
		public List<WithdrawalRequests> getWithdrawals() {
			
			return withdrawalRequestsRepository.findAll();
		}

		@Override
		public Transactions getTransaction(Long id) {
			 return transactionRepository.findById(id).orElseThrow(()->new UserException("Transaction not found"));
		}

	}

