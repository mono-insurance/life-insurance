package com.monocept.app.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Transactions;
import com.monocept.app.repository.AgentRepository;
import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.utils.PaymentOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Payer;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

@Service
public class PaymentService {

    @Autowired
    private APIContext apiContext;
    private final String BASE_URL = "http://localhost:8080/";
    private String CANCEL_URL = "status-failed";
    private String SUCCESS_URL = "status-success";
    private final TransactionsRepository transactionsRepository;
    private final AgentRepository agentRepository;

    public PaymentService(TransactionsRepository transactionsRepository, AgentRepository agentRepository) {
        this.transactionsRepository = transactionsRepository;
        this.agentRepository = agentRepository;
    }

    public Payment createPayment(Long transactionId, PaymentOrder order) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(order.getCurrency());
        Double total = order.getPrice();
        total = new BigDecimal(total).setScale(2, RoundingMode.HALF_UP).doubleValue();
        amount.setTotal(String.format("%.2f", total));

        Transaction transaction = new Transaction();
        transaction.setDescription(order.getDescription());
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(order.getMethod().toString());

        Payment payment = new Payment();
        payment.setIntent(order.getIntent().toString());
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        RedirectUrls redirectUrls = new RedirectUrls();
        CANCEL_URL += "?transaction=" + transactionId;
        SUCCESS_URL += "?transaction=" + transactionId;
        redirectUrls.setCancelUrl(BASE_URL + CANCEL_URL);
        redirectUrls.setReturnUrl(BASE_URL + SUCCESS_URL);
        payment.setRedirectUrls(redirectUrls);
        return payment.create(apiContext);
    }

    public Payment executePayment(Long transactionId, String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecute = new PaymentExecution();
        paymentExecute.setPayerId(payerId);
        payment = payment.execute(apiContext, paymentExecute);
        Transactions transactions = findTransaction(transactionId);
        transactions.setStatus("Completed");
        transactions=transactionsRepository.save(transactions);
        Long agentId=transactions.getPolicyAccount().getAgent().getAgentId();
        if(agentId!=null){
            agentRepository.updateAgentCommission(agentId,transactions.getAgentCommission());
        }
        return payment;
    }

    private Transactions findTransaction(Long transactionId) {
        return transactionsRepository.findById(transactionId).
                orElseThrow(() -> new NoSuchElementException("transaction not found"));
    }

}