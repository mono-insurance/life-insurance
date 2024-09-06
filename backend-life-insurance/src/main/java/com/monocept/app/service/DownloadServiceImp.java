package com.monocept.app.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

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
import com.monocept.app.repository.AuthRepository;
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
	
	public ByteArrayInputStream transactionsLoad() {
	    List<Transactions> transactions = transactionRepository.findAll();

	    ByteArrayInputStream in = CSVHelperForTransactionsCSV(transactions);
	    return in;
	  }

	private ByteArrayInputStream CSVHelperForTransactionsCSV(List<Transactions> transactions) {
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
                  (policyAccount.getCustomer().getFirstName()+" "+policyAccount.getCustomer().getLastName()),
                  (policyAccount.getAgent().getFirstName()+" "+policyAccount.getAgent().getLastName()), 
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
	                "Is Approved", "Address", "Credential Username"
	            ));
	    	
	      for (Customer customer : customers) {
	        List<String> data = Arrays.asList(
	        		String.valueOf(customer.getCustomerId()), 
                    customer.getFirstName(),           
                    customer.getLastName(),                      
                    String.valueOf(customer.getDateOfBirth()), 
                    String.valueOf(customer.getGender()), 
                    String.valueOf(customer.getIsActive()), 
                    customer.getNomineeName(),  
                    String.valueOf(customer.getNomineeRelation()),
                    String.valueOf(customer.getIsApproved()), 
                    customer.getAddress() != null ? customer.getAddress().toString() : "N/A",
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
        return CSVHelperForAgentsCSV(agents);
    }

    private ByteArrayInputStream CSVHelperForAgentsCSV(List<Agent> agents) {
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
                    agent.getAddress() != null ? agent.getAddress().toString() : "N/A",
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
        return CSVHelperForWithdrawalsCSV(withdrawalRequests);
    }

    private ByteArrayInputStream CSVHelperForWithdrawalsCSV(List<WithdrawalRequests> withdrawalRequests) {
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
                    request.getRequestType(),
                    String.valueOf(request.getAmount()), 
                    String.valueOf(request.getIsWithdraw()), 
                    String.valueOf(request.getIsApproved()), 
                    String.valueOf(request.getPolicyAccount().getPolicyAccountId()), 
                    String.valueOf(request.getAgent().getAgentId())
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

}
