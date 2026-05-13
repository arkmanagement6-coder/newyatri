/**
 * Yatri Luggege - Real Payment Gateway Integration
 */

const PaymentGateway = {
    init: function() {
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            document.head.appendChild(script);
        }
    },

    processPayment: function(amount, customerInfo, onHold, onSuccess, onFailure) {
        if (!window.Razorpay) {
            alert("Payment Gateway is loading. Please try again in a moment.");
            return;
        }

        onHold(); // Show processing state in UI

        const options = {
            "key": CONFIG.PAYMENT_GATEWAY_API_KEY, // The UUID provided
            "amount": amount * 100, // Amount in paise
            "currency": "INR",
            "name": "Yatri Luggege",
            "description": "Purchase of Luggage Items",
            "image": "images/logo.png", // Ensure you have a logo
            "handler": function (response){
                // This will be called after successful payment
                onSuccess({
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature
                });
            },
            "prefill": {
                "name": customerInfo.name,
                "email": customerInfo.email,
                "contact": customerInfo.phone
            },
            "theme": {
                "color": "#ff7a00" // Matches secondary-color
            },
            "modal": {
                "ondismiss": function() {
                    onFailure("Payment cancelled by user.");
                }
            }
        };

        try {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response){
                onFailure(response.error.description);
            });
            rzp.open();
        } catch (error) {
            console.error("Razorpay Error:", error);
            onFailure("Could not open payment gateway. Please check your API key.");
        }
    }
};

// Initialize on load
PaymentGateway.init();
