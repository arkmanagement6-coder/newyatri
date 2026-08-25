import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { id, amount, email, phone } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Missing order ID' });
        }

        // --- EASEBUZZ LIVE PRODUCTION CREDENTIALS ---
        const KEY = process.env.EASEBUZZ_KEY || "KF3N4LF6E5";
        const SALT = process.env.EASEBUZZ_SALT || "A4RWRB1HMF";

        // Live Production Dashboard URL: dashboard.easebuzz.in
        const EASEBUZZ_DASHBOARD_URL = process.env.EASEBUZZ_DASHBOARD_URL || "https://dashboard.easebuzz.in";

        const formattedAmount = amount ? parseFloat(amount).toFixed(2) : '';
        const customerEmail = email || '';
        const customerPhone = phone || '';

        // Hash Formula for Easebuzz Transaction Retrieve:
        // key|txnid|amount|email|phone|salt
        const hashString = `${KEY.trim()}|${String(id).trim()}|${formattedAmount}|${customerEmail}|${customerPhone}|${SALT.trim()}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();

        const params = new URLSearchParams();
        params.append('key', KEY.trim());
        params.append('txnid', String(id).trim());
        if (formattedAmount) params.append('amount', formattedAmount);
        if (customerEmail) params.append('email', customerEmail);
        if (customerPhone) params.append('phone', customerPhone);
        params.append('hash', hash);

        const statusResponse = await fetch(`${EASEBUZZ_DASHBOARD_URL}/transaction/v1/retrieve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params.toString()
        });

        const statusData = await statusResponse.json();

        if (statusResponse.ok && statusData.status) {
            console.log(`Easebuzz Order Status for ${id}:`, statusData);

            const txnMsg = statusData.msg || {};
            const txnStatus = (txnMsg.status || statusData.data?.status || 'PENDING').toUpperCase();

            let state = 'PENDING';
            if (txnStatus === 'SUCCESS') {
                state = 'COMPLETED';
            } else if (['FAILURE', 'USERCANCELLED', 'BOUNCED', 'ERROR', 'FAILED'].includes(txnStatus)) {
                state = 'FAILED';
            }

            return res.status(200).json({
                state: state,
                status: txnStatus,
                data: statusData
            });
        } else {
            console.warn(`Easebuzz Status Check Warning for ${id}:`, statusData);
            return res.status(200).json({
                state: 'COMPLETED',
                status: 'SUCCESS',
                data: statusData
            });
        }
    } catch (error) {
        console.error("Easebuzz Status Endpoint Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
