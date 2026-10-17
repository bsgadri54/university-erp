package com.erp.universityerp.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/razorpay")
@CrossOrigin(origins = "*")
public class RazorpayController {

    @Autowired
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String keySecret;


    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    @PostMapping("/create-order")
    public String createOrder(
            @RequestBody OrderRequest request) {

        try {

            if (request.getAmount() <= 0) {

                return """
                        {
                            "error": "Invalid payment amount"
                        }
                        """;
            }


            int amountInPaise =
                    (int) Math.round(
                            request.getAmount() * 100
                    );


            JSONObject orderRequest =
                    new JSONObject();

            orderRequest.put(
                    "amount",
                    amountInPaise
            );

            orderRequest.put(
                    "currency",
                    "INR"
            );

            orderRequest.put(
                    "receipt",
                    "fee_" +
                            System.currentTimeMillis()
            );


            Order order =
                    razorpayClient.orders.create(
                            orderRequest
                    );


            JSONObject response =
                    new JSONObject();

            response.put(
                    "id",
                    (Object) order.get("id")
            );

            response.put(
                    "amount",
                    (Object) order.get("amount")
            );

            response.put(
                    "currency",
                    (Object) order.get("currency")
            );


            return response.toString();


        } catch (Exception e) {

            e.printStackTrace();

            return """
                    {
                        "error":
                        "Unable to create Razorpay order"
                    }
                    """;
        }
    }


    // ==========================================
    // VERIFY RAZORPAY PAYMENT
    // ==========================================

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerificationRequest request) {

        try {

            /*
             * Razorpay requires:
             *
             * order_id + "|" + payment_id
             *
             * to be verified using the Key Secret.
             */

            JSONObject options =
                    new JSONObject();

            options.put(
                    "razorpay_order_id",
                    request.getRazorpayOrderId()
            );

            options.put(
                    "razorpay_payment_id",
                    request.getRazorpayPaymentId()
            );

            options.put(
                    "razorpay_signature",
                    request.getRazorpaySignature()
            );


            boolean verified =
                    Utils.verifyPaymentSignature(
                            options,
                            keySecret
                    );


            if (!verified) {

                return ResponseEntity
                        .status(
                                HttpStatus.BAD_REQUEST
                        )
                        .body(
                                new VerificationResponse(
                                        false,
                                        "Payment signature verification failed."
                                )
                        );
            }


            /*
             * Payment is genuine.
             *
             * DO NOT expose the Key Secret.
             */

            System.out.println(
                    "================================="
            );

            System.out.println(
                    "RAZORPAY PAYMENT VERIFIED"
            );

            System.out.println(
                    "Payment ID: " +
                            request.getRazorpayPaymentId()
            );

            System.out.println(
                    "Order ID: " +
                            request.getRazorpayOrderId()
            );

            System.out.println(
                    "Fee ID: " +
                            request.getFeeId()
            );

            System.out.println(
                    "================================="
            );


            return ResponseEntity.ok(
                    new VerificationResponse(
                            true,
                            "Payment verified successfully."
                    )
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            new VerificationResponse(
                                    false,
                                    "Payment verification error."
                            )
                    );
        }
    }


    // ==========================================
    // ORDER REQUEST
    // ==========================================

    public static class OrderRequest {

        private double amount;


        public double getAmount() {

            return amount;
        }


        public void setAmount(
                double amount) {

            this.amount = amount;
        }
    }


    // ==========================================
    // PAYMENT VERIFICATION REQUEST
    // ==========================================

    public static class PaymentVerificationRequest {

        private Long feeId;

        private String razorpayPaymentId;

        private String razorpayOrderId;

        private String razorpaySignature;


        public Long getFeeId() {

            return feeId;
        }


        public void setFeeId(
                Long feeId) {

            this.feeId = feeId;
        }


        public String getRazorpayPaymentId() {

            return razorpayPaymentId;
        }


        public void setRazorpayPaymentId(
                String razorpayPaymentId) {

            this.razorpayPaymentId =
                    razorpayPaymentId;
        }


        public String getRazorpayOrderId() {

            return razorpayOrderId;
        }


        public void setRazorpayOrderId(
                String razorpayOrderId) {

            this.razorpayOrderId =
                    razorpayOrderId;
        }


        public String getRazorpaySignature() {

            return razorpaySignature;
        }


        public void setRazorpaySignature(
                String razorpaySignature) {

            this.razorpaySignature =
                    razorpaySignature;
        }
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    public static class VerificationResponse {

        private boolean success;

        private String message;


        public VerificationResponse(
                boolean success,
                String message) {

            this.success = success;
            this.message = message;
        }


        public boolean isSuccess() {

            return success;
        }


        public String getMessage() {

            return message;
        }
    }

}