export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Missing order ID' });
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
            console.error("PhonePe Token Error in Status check:", tokenData);
            return res.status(401).json({ error: 'Failed to authenticate with PhonePe', details: tokenData });
        }

        const accessToken = tokenData.access_token;

        // Step 2: Query Order Status from PhonePe V2 Checkout API
        const statusResponse = await fetch(`https://api.phonepe.com/apis/pg/checkout/v2/order/${id}/status?details=false&errorContext=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${accessToken}`
            }
        });

        const statusData = await statusResponse.json();

        if (statusResponse.ok) {
            console.log(`PhonePe Order Status for ${id}:`, statusData);
            // Returns statusData which contains state (e.g. "COMPLETED", "FAILED", "PENDING", etc.)
            return res.status(200).json(statusData);
        } else {
            console.error(`PhonePe Status API Error for ${id}:`, statusData);
            return res.status(statusResponse.status).json({ error: 'Failed to fetch status from PhonePe', details: statusData });
        }
    } catch (error) {
        console.error("Status Endpoint Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
