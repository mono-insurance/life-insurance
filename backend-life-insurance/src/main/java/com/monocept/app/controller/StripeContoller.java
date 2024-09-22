package com.monocept.app.controller;

import java.time.LocalDate;
import java.util.Map;

import com.monocept.app.utils.NomineeRelation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.DocumentException;
import com.monocept.app.dto.InstallmentDTO;
import com.monocept.app.dto.PolicyAccountDTO;
import com.monocept.app.service.CustomerService;
import com.monocept.app.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/suraksha/payment")
public class StripeContoller {

	@Autowired
	private StripeService stripeService;
	
	@Autowired
	private CustomerService customerService;
	
	
	@PostMapping("/sessions")
	@Operation(description = "Initiate payment in stripe")
	public ResponseEntity<String> generateSession(@RequestBody Map<String, Object> requestData) {
	    try {
	    	
	        Session session = stripeService.generateSession(requestData);
	        return ResponseEntity.ok(session.getUrl());
	    } catch (Exception e) {
	    	System.out.println("coming here?");
	    	
	        return ResponseEntity.badRequest().body("Failed to create checkout session: " + e.getMessage());
	    }
	}
	
	
	
	@PostMapping("/installment/sessions")
	@Operation(description = "Initiate payment in stripe")
	public ResponseEntity<String> generateIstallmentSession(@RequestBody Map<String, Object> requestData) {
	    try {
	    	
	        Session session = stripeService.generateInstallmentSession(requestData);
	        return ResponseEntity.ok(session.getUrl());
	    } catch (Exception e) {
	    	System.out.println("coming here?");
	    	System.out.println(requestData);
	        return ResponseEntity.badRequest().body("Failed to create checkout session: " + e.getMessage());
	    }
	}
	
	
	
	
	@PostMapping("/verify")
	@Operation(description = "verifies payment for after procedure")
	public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> requestBody) throws DocumentException {
		String sessionId = requestBody.get("sessionId"); // Get the sessionId from the JSON object
	    System.out.println(sessionId);

		try {
			System.out.println(sessionId);
			Session session = Session.retrieve(sessionId);
			System.out.println("Session retrieved: " + session);

			if ("paid".equals(session.getPaymentStatus())) {
				System.out.println("Coming here");
				String paymentIntentId = session.getPaymentIntent();
				PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
				String chargeId = paymentIntent.getCharges().getData().get(0).getId();

				String paymentType = session.getMetadata().get("type");

				if ("policyPurchase".equals(paymentType)) {
					System.out.println("or here");
					String paymentTimeInMonths = session.getMetadata().get("paymentTimeInMonths");
					String investmentAmount = session.getMetadata().get("investmentAmount");
					String policyTerm = session.getMetadata().get("policyTerm");
					String nomineeName = session.getMetadata().get("nomineeName");
					String nomineeRelation = session.getMetadata().get("nomineeRelation");
					String customerId = session.getMetadata().get("customerId");
					String policyId = session.getMetadata().get("policyId");
					String installmentAmount = session.getMetadata().get("installmentAmount");
					String agentId = session.getMetadata().get("agentId");
					String paymentMade = session.getMetadata().get("paymentMade");
					
					PolicyAccountDTO policyAccountDTO = new PolicyAccountDTO();
					policyAccountDTO.setPaymentTimeInMonths(Integer.parseInt(paymentTimeInMonths));
					policyAccountDTO.setInvestmentAmount(Double.parseDouble(investmentAmount));
					policyAccountDTO.setPolicyTerm(Integer.parseInt(policyTerm));
					policyAccountDTO.setNomineeName(nomineeName);
					policyAccountDTO.setNomineeRelation(NomineeRelation.valueOf(nomineeRelation.toUpperCase()));
					policyAccountDTO.setCustomerId(Long.parseLong(customerId));
					policyAccountDTO.setPolicyId(Long.parseLong(policyId));
					policyAccountDTO.setTimelyBalance(Double.parseDouble(installmentAmount));
					policyAccountDTO.setTransactionId(chargeId);
					policyAccountDTO.setPaymentMade(Double.parseDouble(paymentMade));
					if(agentId != null) {
						policyAccountDTO.setAgentId(Long.parseLong(agentId));
					}

					customerService.createPolicyAccount(policyAccountDTO);

					return ResponseEntity.ok(Map.of("success", true, "policyId", policyId, "customerId", customerId,
							"paymentType", paymentType));

				} else if ("installmentPayment".equals(paymentType)) {
					System.out.println("and here");
					String transactionId = session.getMetadata().get("transactionId");
					String lateCharges = session.getMetadata().get("lateCharges");
					String paymentMade = session.getMetadata().get("paymentMade");
					
					InstallmentDTO installmentDTO = new InstallmentDTO();
					
					installmentDTO.setLateCharges(Boolean.parseBoolean(lateCharges));
					installmentDTO.setTotalAmountPaid(Double.parseDouble(paymentMade));
					installmentDTO.setTransactionId(Long.parseLong(transactionId));
					installmentDTO.setTransactionIdentification(chargeId);
					
					
					customerService.createInstallmentPayment(installmentDTO);
					return ResponseEntity
							.ok(Map.of("success", true, "message", "Installment payment processed successfully",
									"paymentType", paymentType));

				} else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST)
							.body(Map.of("success", false, "message", "Unrecognized payment type"));
				}

			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("success", false, "message", "Payment verification failed."));
			}

		} catch (StripeException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error verifying payment: " + e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
		}
	}
	
}
