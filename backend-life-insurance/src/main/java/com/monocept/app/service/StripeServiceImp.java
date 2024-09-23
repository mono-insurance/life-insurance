package com.monocept.app.service;

import com.monocept.app.dto.StripeChargeDTO;
import com.monocept.app.dto.StripeTokenDTO;
import com.monocept.app.entity.Settings;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.SettingsRepository;
import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.utils.GlobalSettings;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Token;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StripeServiceImp implements StripeService{
	
	@Value("${api.stripe.key}")
	private String stripeApiKey;
	
	
	@PostConstruct
	public void init() {
		Stripe.apiKey = stripeApiKey;
	}
	
	@Autowired
    private TransactionsRepository transactionsRepository;
	
	@Autowired
    private SettingsRepository settingsRepository;
	
	@Override
	public StripeTokenDTO createCardToken(StripeTokenDTO model) {
		
		try {
			
			Map<String, Object> card = new HashMap<>();
			card.put("number", model.getCardNumber());
			card.put("exp_month", Integer.parseInt(model.getExpMonth()));
			card.put("exp_year", Integer.parseInt(model.getExpYear()));
			card.put("cvc", model.getCvc());
			Map<String, Object>params = new HashMap<>();
			params.put("card", card);
			Token token = Token.create(params);
			if(token != null && token.getId() != null) {
				model.setSuccess(true);
				model.setToken(token.getId());
			}
			return model;
			
			
			
		}
		catch(StripeException e) {
			System.out.println(e.getMessage());
			throw new UserException("Error making card details");
		}
		
	}
	
	@Override
	public StripeChargeDTO charge(StripeChargeDTO chargeRequest) {
		
		try {
			chargeRequest.setSuccess(false);
			Map<String, Object> chargeParams = new HashMap<>();
			chargeParams.put("amount",(int) (chargeRequest.getAmount()*100));
			chargeParams.put("currency", "INR");
			chargeParams.put("description", "Payment for Id "+ chargeRequest.getAdditionalInfo().getOrDefault("ID_TAG", ""));
			chargeParams.put("source", chargeRequest.getStripeToken());
			Map<String, Object>metaData = new HashMap<>();
			metaData.put("id", chargeRequest.getChargeId());
			metaData.putAll(chargeRequest.getAdditionalInfo());
			chargeParams.put("metadata", metaData);
			Charge charge = Charge.create(chargeParams);
			chargeRequest.setMessage(charge.getOutcome().getSellerMessage());

			if(charge.getPaid()) {
				chargeRequest.setChargeId(charge.getId());
				chargeRequest.setSuccess(true);
			}
			return chargeRequest;
			
			
			
		}
		catch(StripeException e) {
			throw new UserException("Error while charge");
		}
		
	}

	@Override
	public Session generateSession(Map<String, Object> requestData) {
	    try {
	    	
			if (!requestData.containsKey("amount") || !requestData.containsKey("successUrl") || !requestData.containsKey("failureUrl")) {
		        throw new UserException("Details are missing");
		    }
			
			double amount = Double.parseDouble(requestData.get("amount").toString());
			amount = Double.valueOf(String.format("%.2f", amount));
		    String successUrl = requestData.get("successUrl").toString();
		    String cancelUrl = requestData.get("failureUrl").toString();
		    
		    double totalAmountToPay = paymentToPay(LocalDate.now(), amount);
		    
		    System.out.println("yaha aaya ki nahi");
		    
	        String modifiedSuccessUrl = successUrl + "?session_id={CHECKOUT_SESSION_ID}";

	        SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
	            .setMode(SessionCreateParams.Mode.PAYMENT)
	            .setSuccessUrl(modifiedSuccessUrl)
	            .setCancelUrl(cancelUrl)
	            .addLineItem(SessionCreateParams.LineItem.builder()
	                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
	                    .setCurrency("INR")
	                    .setUnitAmount((long) (totalAmountToPay * 100))  
	                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
	                        .setName("Policy Payment") 
	                        .build())
	                    .build())
	                .setQuantity(1L)
	                .build());

	        Map<String, String> metadata = new HashMap<>();
	        metadata.put("type", "policyPurchase");
	        metadata.put("paymentTimeInMonths", requestData.get("paymentTimeInMonths").toString());
	        metadata.put("investmentAmount", requestData.get("investmentAmount").toString());
	        metadata.put("policyTerm", requestData.get("policyTerm").toString());
	        metadata.put("nomineeName", requestData.get("nomineeName").toString());
	        metadata.put("nomineeRelation", requestData.get("nomineeRelation").toString());
	        metadata.put("customerId", requestData.get("customerId").toString());
	        metadata.put("policyId", requestData.get("policyId").toString());
	        metadata.put("installmentAmount", requestData.get("amount").toString());
	        metadata.put("paymentMade", String.valueOf(totalAmountToPay));
	        if(requestData.containsKey("agentId")) metadata.put("agentId", requestData.get("agentId").toString());
	        
	        System.out.println("aur yaha aaya ki nahi");
	        sessionBuilder.putAllMetadata(metadata);
	        System.out.println("aur yaha aaya ki nahi");
	        SessionCreateParams params = sessionBuilder.build();
	        System.out.println("aur yaha aaya ki nahi");
	        System.out.println(params);
	        return Session.create(params);
	        
	    } catch (StripeException e) {
	    	System.out.println("aur yaha aaya ki nahi");
	        throw new UserException("Stripe checkout session creation failed");
	    }
	}
	
	
	
	
    @Override
    public Double paymentToPay(LocalDate paymentToBeMade, Double amount) {
    	
        LocalDate currentDate = LocalDate.now();
        LocalDate gracePeriod = paymentToBeMade.plusDays(15);

        Settings taxChargesSetting = settingsRepository.findBySettingKey(GlobalSettings.TAX_CHARGES)
                .orElseThrow(() -> new UserException("Tax charges setting not found"));
        Settings penaltyChargesSetting = settingsRepository.findBySettingKey(GlobalSettings.PENALTY_CHARGES)
                .orElseThrow(() -> new UserException("Penalty charges setting not found"));

        boolean isLate = currentDate.isAfter(gracePeriod);
        Double penalty = 0.0;

        if (isLate) {
            penalty = amount * (penaltyChargesSetting.getSettingValue() / 100);
        }

        Double totalAmountToPay = amount + penalty;
        Double taxCharges = totalAmountToPay * (taxChargesSetting.getSettingValue() / 100);
        totalAmountToPay += taxCharges;

        return totalAmountToPay;
    }

	@Override
	public Session generateInstallmentSession(Map<String, Object> requestData) {
		 try {
			if (!requestData.containsKey("transactionId")) {
		        throw new UserException("Details are missing");
		    }
			
			Long id = Long.parseLong(requestData.get("transactionId").toString());
		    String successUrl = requestData.get("successUrl").toString();
		    String cancelUrl = requestData.get("failureUrl").toString();
		    
		    Transactions transaction = transactionsRepository.findById(id).orElseThrow(()->new UserException("No such transaction found"));
		    
		    double totalAmountToPay = paymentToPay(transaction.getTransactionDate(), transaction.getAmount());
		    
	        String modifiedSuccessUrl = successUrl + "?session_id={CHECKOUT_SESSION_ID}";
	        
	        SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
		            .setMode(SessionCreateParams.Mode.PAYMENT)
		            .setSuccessUrl(modifiedSuccessUrl)
		            .setCancelUrl(cancelUrl)
		            .addLineItem(SessionCreateParams.LineItem.builder()
		                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
		                    .setCurrency("INR")
		                    .setUnitAmount((long) (totalAmountToPay * 100))  
		                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
		                        .setName("Installement Payment") 
		                        .build())
		                    .build())
		                .setQuantity(1L)
		                .build());
	        
		        Map<String, String> metadata = new HashMap<>();
		        
		        
		        LocalDate currentDate = LocalDate.now();
		        LocalDate gracePeriod = transaction.getTransactionDate().plusDays(15);
		        boolean isLate = currentDate.isAfter(gracePeriod);
		        metadata.put("type", "installmentPayment");
		        metadata.put("transactionId", requestData.get("transactionId").toString());
		        metadata.put("lateCharges", String.valueOf(isLate));
		        metadata.put("paymentMade", String.valueOf(totalAmountToPay));
		        
		        sessionBuilder.putAllMetadata(metadata);
		
		        SessionCreateParams params = sessionBuilder.build();
		        return Session.create(params);
		        
		    } catch (StripeException e) {
		        throw new UserException("Stripe checkout session creation failed");
		    }
        
	}
}
