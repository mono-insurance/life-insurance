package com.monocept.app.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.EmailDTO;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;
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
    private final String BASE_URL = "http://localhost:3000/";
    private final TransactionsRepository transactionsRepository;
    private final AgentRepository agentRepository;
    private final EmailService emailService;
    private final AccessConService accessConService;

    public PaymentService(TransactionsRepository transactionsRepository, AgentRepository agentRepository,
                          EmailService emailService, AccessConService accessConService) {
        this.transactionsRepository = transactionsRepository;
        this.agentRepository = agentRepository;
        this.emailService = emailService;
        this.accessConService = accessConService;
    }

    public Payment createPayment(Long transactionId, PaymentOrder order) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency("USD");
        Transactions transactions1=findTransaction(transactionId);
        if(transactions1.getStatus().equals("Done")){
            throw new UserException("your transaction is already completed");
        }
        Double total = transactions1.getAmount();
        total = new BigDecimal(total).setScale(2, RoundingMode.HALF_UP).doubleValue();
        amount.setTotal(String.format("%.2f", total));

        Transaction transaction = new Transaction();
        transaction.setDescription(order.getDescription());
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        Payment payment = new Payment();
        payment.setIntent(order.getIntent().toString());
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        RedirectUrls redirectUrls = new RedirectUrls();
        CustomUserDetails customUserDetails=accessConService.checkUserAccess();
        String cancel_url="customer/"+customUserDetails.getId()+"/perform-transaction/"+transactionId+"/failed";
        Transactions mytransactions=transactionsRepository.findById(transactionId).
                orElseThrow(()->new UserException("transaction not found"));
        String success_url = "customer/policy-account/"+customUserDetails.getId()+"/view/"+mytransactions.getPolicyAccount().getPolicyAccountId();
        redirectUrls.setCancelUrl(BASE_URL + cancel_url);
        redirectUrls.setReturnUrl(BASE_URL + success_url);
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
            Double commission=transactions.getAgentCommission();
            if(transactions.getSerialNo()==1) commission+=transactions.getPolicyAccount().getAgentCommissionForRegistration();
            agentRepository.updateAgentCommission(agentId,commission);
        }
        EmailDTO emailDTO=new EmailDTO();
        emailDTO.setEmailId(transactions.getPolicyAccount().getCustomer().getCredentials().getEmail());
        emailDTO.setTitle("Congrats!, Transaction Success");
        emailDTO.setBody("Congrats!! your transaction of Policy account number "+transactions.getPolicyAccount().getPolicyAccountId() +" has been completed successfully.\n" +
                "here are some details:\n transaction amount: "+transactions.getAmount()+"\ndate"+ LocalDate.now());
        emailService.sendAccountCreationEmail(emailDTO);
        return payment;
    }

    private Transactions findTransaction(Long transactionId) {
        return transactionsRepository.findById(transactionId).
                orElseThrow(() -> new NoSuchElementException("transaction not found"));
    }

}
