package com.monocept.app.controller;

import com.monocept.app.service.PaymentService;
import com.monocept.app.utils.PaymentOrder;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

@RestController
@RequestMapping("/api/transaction/payment")
public class PaypalController {

    @Autowired
    PaymentService paymentService;

    public static final String SUCCESS_URL = "pay/success";
    public static final String CANCEL_URL = "pay/cancel";

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @PostMapping("/pay")
    public ResponseEntity<String> payment(@RequestBody @Valid PaymentOrder paymentOrder) {
        try {
            Payment payment = paymentService.createPayment(paymentOrder);
            for(Links link:payment.getLinks()) {
                if(link.getRel().equals("approval_url")) {
                    return new ResponseEntity<>("redirect:"+link.getHref(), HttpStatus.BAD_REQUEST);
                }
            }

        } catch (PayPalRESTException e) {

            e.printStackTrace();
        }
        return new ResponseEntity<>("redirect:", HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = CANCEL_URL)
    public String cancelPay() {
        return "cancel";
    }

    @GetMapping(value = SUCCESS_URL)
    public String successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = paymentService.executePayment(paymentId, payerId);
            System.out.println(payment.toJSON());
            if (payment.getState().equals("approved")) {
                return "success";
            }
        } catch (PayPalRESTException e) {
            System.out.println(e.getMessage());
        }
        return "redirect:/";
    }

}