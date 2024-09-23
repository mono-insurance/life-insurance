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
@RequestMapping("/suraksha/payment")
public class PaypalController {

    @Autowired
    PaymentService paymentService;

    @PostMapping("transaction/{tid}/pay")
    public ResponseEntity<String> payment(
            @PathVariable("tid") Long transactionId,
            @RequestBody @Valid PaymentOrder paymentOrder) {
        try {
            Payment payment = paymentService.createPayment(transactionId, paymentOrder);
            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {

                    return new ResponseEntity<>( link.getHref(), HttpStatus.OK);
                }
            }

        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>("http://localhost:3000/", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("status-failed/{tid}")
    public String cancelPay() {
        return "cancel";
    }

    @PostMapping("/status-success/{tid}")
    public String successPay(
            @PathVariable("tid") Long transactionId,
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = paymentService.executePayment(transactionId, paymentId, payerId);
            System.out.println("payment details are : " + payment.toJSON());
            if (payment.getState().equals("approved")) {
                return "success";
            }
        } catch (PayPalRESTException e) {
            System.out.println(e.getMessage());
        }
        return "redirect:/";
    }

}
