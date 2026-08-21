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
        const firstname = (name || 'Customer').trim().split(' ')[0] || 'Customer';
        const customerEmail = (email || 'customer@yatriluggage.com').trim();
        const customerPhone = (mobileNumber || '9999999999').trim();
        const itemInfo = (productInfo || 'Yatri Luggage Order').trim();
        const cleanOrderId = String(orderId).trim();

        const surl = `${protocol}://${host}/api/response`;
        const furl = `${protocol}://${host}/api/response`;

        // Easebuzz Hash Sequence for Initiate Payment (17 elements joined by 16 pipes):
        // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
        const hashArray = [
            KEY.trim(),
            cleanOrderId,
            formattedAmount,
            itemInfo,
            firstname,
            customerEmail,
            '', '', '', '', '', '', '', '', '', '', // 10 empty UDF fields (udf1 through udf10)
            SALT.trim()
        ];
        
        const hashString = hashArray.join('|');
        const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();

        const params = new URLSearchParams();
        params.append('key', KEY.trim());
        params.append('txnid', cleanOrderId);
        params.append('amount', formattedAmount);
        params.append('productinfo', itemInfo);
        params.append('firstname', firstname);
        params.append('phone', customerPhone);
        params.append('email', customerEmail);
        params.append('surl', surl);
        params.append('furl', furl);
        params.append('hash', hash);
        params.append('udf1', '');
        params.append('udf2', '');
        params.append('udf3', '');
        params.append('udf4', '');
        params.append('udf5', '');
        params.append('udf6', '');
        params.append('udf7', '');
        params.append('udf8', '');
        params.append('udf9', '');
        params.append('udf10', '');

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
            // Correct Hosted Checkout URL: https://testpay.easebuzz.in/pay/<access_key>
            const redirectUrl = `${EASEBUZZ_BASE_URL}/pay/${initiateData.data}`;
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
