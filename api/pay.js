import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { amount, orderId, mobileNumber, name, email: customerEmail } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // --- EASEBUZZ CREDENTIALS ---
        const MERCH_KEY = "Y2T9CT9Z7";
        const SALT_KEY = "1MWJFXQ0A";
        const ENV = "test"; // Set to 'prod' for production, 'test' for sandbox/testing
        const BASE_URL = ENV === 'prod' ? 'https://pay.easebuzz.in' : 'https://testpay.easebuzz.in';

        // Extract and fallback values for mandatory fields
        const firstname = name ? name.split(' ')[0].trim() : 'Customer';
        const email = customerEmail ? customerEmail.trim() : 'customer@example.com';
        const phone = mobileNumber ? mobileNumber.trim() : '9999999999';
        
        // Host details for absolute callbacks
        const host = req.headers.host || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const callbackUrl = `${protocol}://${host}/api/response`;

        // Format amount string (Easebuzz standard requires 2 decimal places or valid decimal format)
        const formattedAmount = Number(amount).toFixed(2);

        // Generate SHA-512 Hash
        // Sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
        const hashSequence = [
            MERCH_KEY,
            orderId,
            formattedAmount,
            "Yatri Luggage Order",
            firstname,
            email,
            "", "", "", "", "", "", "", "", "", "" // udf1 to udf10
        ];
        
        const hashString = hashSequence.join('|') + '|' + SALT_KEY;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        // Build URL-encoded request payload
        const payload = new URLSearchParams({
            key: MERCH_KEY,
            txnid: orderId,
            amount: formattedAmount,
            firstname: firstname,
            email: email,
            phone: phone,
            productinfo: "Yatri Luggage Order",
            surl: callbackUrl,
            furl: callbackUrl,
            hash: hash,
            udf1: "",
            udf2: "",
            udf3: "",
            udf4: "",
            udf5: "",
            udf6: "",
            udf7: "",
            udf8: "",
            udf9: "",
            udf10: ""
        });

        // Call Easebuzz Initiate Link API
        const response = await fetch(`${BASE_URL}/payment/initiateLink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload.toString()
        });

        const textResponse = await response.text();
        let result;
        try {
            result = JSON.parse(textResponse);
        } catch (e) {
            console.error("Failed to parse Easebuzz Response JSON:", textResponse);
            return res.status(502).json({ error: 'Invalid response from Easebuzz', details: textResponse });
        }

        if (response.ok && result.status === 1) {
            // Return the full checkout URL to the frontend
            const checkoutUrl = `${BASE_URL}/pay/${result.data}`;
            return res.status(200).json({ url: checkoutUrl });
        } else {
            console.error("Easebuzz Checkout Initiation Error:", result);
            return res.status(400).json({ error: result.error_desc || result.data || 'Payment initiation failed', details: result });
        }
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
