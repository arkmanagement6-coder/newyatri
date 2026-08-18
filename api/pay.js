import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { amount, orderId, mobileNumber, name, email, productInfo } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // --- EASEBUZZ CREDENTIALS ---
        const KEY = "Y2T9CT9Z7";
        const SALT = "1MWJFXQ0A";
        
        // Environment URL (Can switch between testpay.easebuzz.in and pay.easebuzz.in)
        const EASEBUZZ_BASE_URL = process.env.EASEBUZZ_BASE_URL || "https://testpay.easebuzz.in";

        const host = req.headers.host || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';

        const formattedAmount = parseFloat(amount).toFixed(2);
        const firstname = (name || 'Customer').trim().split(' ')[0];
        const customerEmail = (email || 'customer@yatriluggage.com').trim();
        const customerPhone = (mobileNumber || '9999999999').trim();
        const itemInfo = productInfo || 'Yatri Luggage Order';

        const surl = `${protocol}://${host}/api/response`;
        const furl = `${protocol}://${host}/api/response`;

        // Easebuzz Hash Sequence for Initiate Payment:
        // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
        const hashString = `${KEY}|${orderId}|${formattedAmount}|${itemInfo}|${firstname}|${customerEmail}||||||||||${SALT}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        const params = new URLSearchParams();
        params.append('key', KEY);
        params.append('txnid', orderId);
        params.append('amount', formattedAmount);
        params.append('productinfo', itemInfo);
        params.append('firstname', firstname);
        params.append('phone', customerPhone);
        params.append('email', customerEmail);
        params.append('surl', surl);
        params.append('furl', furl);
        params.append('hash', hash);

        const initiateResponse = await fetch(`${EASEBUZZ_BASE_URL}/payment/initiateLink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params.toString()
        });

        const initiateData = await initiateResponse.json();

        if (initiateResponse.ok && initiateData.status === 1 && initiateData.data) {
            const redirectUrl = `${EASEBUZZ_BASE_URL}/payment/pay/${initiateData.data}`;
            return res.status(200).json({ url: redirectUrl, access_key: initiateData.data });
        } else {
            console.error("Easebuzz Initiate Payment Error:", initiateData);
            return res.status(400).json({ 
                error: initiateData.error_desc || initiateData.data || 'Payment initiation failed', 
                details: initiateData 
            });
        }
    } catch (error) {
        console.error("Easebuzz Backend Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
