package com.monocept.app.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.entity.Transactions;
import com.monocept.app.entity.WithdrawalRequests;
import com.monocept.app.service.DownloadService;
import com.monocept.app.service.TransactionPdfExporter;
import com.monocept.app.service.WithdrawalsPdfExporter;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/suraksha/download")
public class DownloadController {
	
	@Autowired
	DownloadService downloadService;
	
	@Operation(summary = "By Admin: Download all transactions in CSV format")
	@GetMapping("/transaction/download/csv")
	public ResponseEntity<Resource> getTransactionsFile() {
	    String filename = "transactions.csv";
	    InputStreamResource file = new InputStreamResource(downloadService.transactionsLoad());
	
	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
	        .contentType(MediaType.parseMediaType("application/csv"))
	        .body(file);
	}
	
	@Operation(summary = "By Admin: Download all policy accounts in CSV format")
	@GetMapping("/policy/accounts/download/csv")
	public ResponseEntity<Resource> getPolicyAccountFile() {
	    String filename = "policyAccounts.csv";
	    InputStreamResource file = new InputStreamResource(downloadService.policyAccountLoad());
	
	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
	        .contentType(MediaType.parseMediaType("application/csv"))
	        .body(file);
	}
	
	@Operation(summary = "By Admin and Employee: Download all customers in CSV format")
	@GetMapping("/customer/download/csv")
	public ResponseEntity<Resource> getCustomerFile() {
	    String filename = "customers.csv";
	    InputStreamResource file = new InputStreamResource(downloadService.customerLoad());
	
	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
	        .contentType(MediaType.parseMediaType("application/csv"))
	        .body(file);
	}
	
	@Operation(summary = "By Admin and Employee: Download all agents in CSV format")
	@GetMapping("/agent/download/csv")
	public ResponseEntity<Resource> getAgentFile() {
	    String filename = "agents.csv";
	    InputStreamResource file = new InputStreamResource(downloadService.agentLoad());
	
	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
	        .contentType(MediaType.parseMediaType("application/csv"))
	        .body(file);
	}

	@Operation(summary = "By Admin: Download all withdrawal requests in CSV format")
	@GetMapping("/withdrawal/download/csv")
	public ResponseEntity<Resource> getWithdrawalFile() {
	    String filename = "agents.csv";
	    InputStreamResource file = new InputStreamResource(downloadService.withdrawalLoad());
	
	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
	        .contentType(MediaType.parseMediaType("application/csv"))
	        .body(file);
	}
	
	
	@Operation(summary = "By Admin: Download all transactions in PDF format")
	@GetMapping("/transaction/download/pdf")
	public ResponseEntity<String> exportTransactionToPDF(HttpServletResponse response) {

		response.setContentType("application/pdf");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
         
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=users_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);
	    
        List<Transactions> transactions = downloadService.getAllTransactions();
        
        TransactionPdfExporter exporter = new TransactionPdfExporter(transactions);
        exporter.export(response);

	    return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@Operation(summary = "By All: Download transactions for a specific policy account in PDF format")
	@GetMapping("/transactions/policy-account/{id}/download/pdf")
	public ResponseEntity<String> exportTransactionByPolicyAccountToPDF(HttpServletResponse response,
			@PathVariable(name ="id") Long policyId) {

		response.setContentType("application/pdf");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
         
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=users_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);
	    
        List<Transactions> transactions = downloadService.getTransactionByAccountNumber(policyId);
        
        TransactionPdfExporter exporter = new TransactionPdfExporter(transactions);
        exporter.export(response);

	    return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@Operation(summary = "By Admin: Download all withdrawal requests in PDF format")
	@GetMapping("/withdrawal/download/pdf")
	public ResponseEntity<String> exportWithdrawalsToPDF(HttpServletResponse response) {

		response.setContentType("application/pdf");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
         
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=users_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);
	    
        List<WithdrawalRequests> withdrawals = downloadService.getWithdrawals();
        
        WithdrawalsPdfExporter exporter = new WithdrawalsPdfExporter(withdrawals);
        exporter.export(response);

	    return new ResponseEntity<>(HttpStatus.OK);
	}
}
