export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { amount, orderId, mobileNumber } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // --- PHONEPE V2 PRODUCTION CREDENTIALS ---
        const CLIENT_ID = "SU2605131450590093051231";
        const CLIENT_SECRET = "cab34e32-8fb5-4d6d-94be-7bcccc16c8cb";
        
        // Step 1: Get OAuth Token
        const tokenParams = new URLSearchParams();
        tokenParams.append('client_id', CLIENT_ID);
        tokenParams.append('client_secret', CLIENT_SECRET);
        tokenParams.append('client_version', '1');
        tokenParams.append('grant_type', 'client_credentials');

        const tokenResponse = await fetch("https://api.phonepe.com/apis/identity-manager/v1/oauth/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: tokenParams.toString()
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error("PhonePe Token Error:", tokenData);
            return res.status(401).json({ error: 'Failed to authenticate with PhonePe', details: tokenData });
        }

        const accessToken = tokenData.access_token;

        // Step 2: Initialize Payment Session
        const host = req.headers.host || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const redirectUrl = `${protocol}://${host}/order-success.html?id=${orderId}`;

        // PhonePe V2 Checkout Payload
        const payload = {
            merchantOrderId: orderId,
            amount: Math.round(amount * 100), // paise
            paymentFlow: {
                type: "PG_CHECKOUT",
                merchantUrls: {
                    redirectUrl: redirectUrl
                }
            }
        };

        const checkoutResponse = await fetch("https://api.phonepe.com/apis/pg/checkout/v2/pay", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutResponse.ok && checkoutData.redirectUrl) {
            // Return the redirect URL to the frontend
            return res.status(200).json({ url: checkoutData.redirectUrl });
        } else {
            console.error("PhonePe Checkout Error:", checkoutData);
            return res.status(400).json({ error: checkoutData.message || 'Payment initiation failed', details: checkoutData });
        }
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
