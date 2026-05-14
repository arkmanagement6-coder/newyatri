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
        // IMPORTANT: The Sandbox environment MUST use the exact testing credentials below.
        // Your key (cab34e32-8fb5-4d6d-94be-7bcccc16c8cb) is likely a PRODUCTION key.
        // To use your key, you MUST use the Production API endpoint AND your Production Merchant ID.
        
        // --- PRODUCTION CREDENTIALS ---
        const SALT_KEY = "cab34e32-8fb5-4d6d-94be-7bcccc16c8cb"; // Your provided live key
        const SALT_INDEX = 1;
        // IMPORTANT: You MUST enter your exact PhonePe Merchant ID below.
        // It usually looks like a business name (e.g., YATRILUGGEGEONLINE).
        const MERCHANT_ID = "M23P2N630SNVS";
        const API_ENDPOINT = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

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
            // Send the actual PhonePe error message back to the frontend
            const phonepeErrorMsg = data.message || 'Payment initiation failed on PhonePe servers';
            return res.status(400).json({ error: phonepeErrorMsg, details: data });
        }
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
