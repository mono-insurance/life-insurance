package com.monocept.app.service;

import java.time.LocalDate;
import java.util.Map;

import com.monocept.app.dto.StripeChargeDTO;
import com.monocept.app.dto.StripeTokenDTO;
import com.stripe.model.checkout.Session;

public interface StripeService {

	StripeTokenDTO createCardToken(StripeTokenDTO model);

	StripeChargeDTO charge(StripeChargeDTO chargeRequest);

	Session generateSession(Map<String, Object> requestBody);

	Double paymentToPay(LocalDate paymentToBeMade, Double amount);

	Session generateInstallmentSession(Map<String, Object> requestData);

}
