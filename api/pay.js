const crypto = require('crypto');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { amount, orderId, mobileNumber } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Configuration
        const SALT_KEY = "cab34e32-8fb5-4d6d-94be-7bcccc16c8cb";
        const SALT_INDEX = 1;
        // Using PhonePe Sandbox environment and Merchant ID by default.
        // For production, change MERCHANT_ID to your actual Merchant ID and 
        // API_ENDPOINT to https://api.phonepe.com/apis/hermes/pg/v1/pay
        const MERCHANT_ID = "PGTESTPAYUAT"; 
        const API_ENDPOINT = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

        // Get the host for the redirect URL
        const host = req.headers.host || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const redirectUrl = `${protocol}://${host}/order-success.html?id=${orderId}`;

        // Construct Payload
        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: orderId,
            merchantUserId: "MUID" + Date.now(),
            amount: Math.round(amount * 100), // PhonePe expects amount in paise (integers)
            redirectUrl: redirectUrl,
            redirectMode: "REDIRECT",
            callbackUrl: redirectUrl,
            mobileNumber: mobileNumber || "9999999999",
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        // Encode payload
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

        // Calculate Checksum (SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex)
        const stringToSign = base64Payload + "/pg/v1/pay" + SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
        const checksum = sha256 + "###" + SALT_INDEX;

        // Make request to PhonePe
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'accept': 'application/json'
            },
            body: JSON.stringify({
                request: base64Payload
            })
        });

        const data = await response.json();

        if (data.success && data.data && data.data.instrumentResponse && data.data.instrumentResponse.redirectInfo) {
            return res.status(200).json({ url: data.data.instrumentResponse.redirectInfo.url });
        } else {
            console.error("PhonePe API Error:", data);
            return res.status(400).json({ error: 'Payment initiation failed. Please check if Merchant ID is valid.', details: data });
        }
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
