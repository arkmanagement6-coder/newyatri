import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const body = req.body || {};

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ error: 'Missing response payload' });
        }

        // --- EASEBUZZ PRODUCTION CREDENTIALS ---
        const SALT_KEY = "1MWJFXQ0A";

        // Reverse hash verification:
        // salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        const sequence = [
            'status', 'udf10', 'udf9', 'udf8', 'udf7', 'udf6', 'udf5', 'udf4', 'udf3', 'udf2', 'udf1',
            'email', 'firstname', 'productinfo', 'amount', 'txnid', 'key'
        ];
        
        let hashString = SALT_KEY + '|' + sequence.map(key => (body[key] || '').toString().trim()).join('|');
        const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

        const receivedHash = (body.hash || '').toLowerCase();
        const isValid = calculatedHash.toLowerCase() === receivedHash;

        if (!isValid) {
            console.warn("Easebuzz Webhook Signature Verification Failed! Calculated:", calculatedHash, "Received:", receivedHash);
            return res.status(401).json({ error: 'Signature verification failed' });
        }

        console.log("Verified Easebuzz Webhook Payload:", body);

        // Extract relevant fields
        const { status, txnid, amount, easepayid } = body;

        if (status === 'success') {
            console.log(`Payment SUCCESS via Webhook for Order: ${txnid}, Easebuzz ID: ${easepayid}, Amount: ${amount} INR`);
            // Custom business logic here (e.g. update order status to Paid in database)
        } else {
            console.log(`Payment FAILED/CANCELLED via Webhook for Order: ${txnid}, Status: ${status}`);
        }

        // Return 200 OK acknowledgment strictly required by Easebuzz to prevent retries
        return res.status(200).json({ success: true, message: 'Callback received and verified successfully' });

    } catch (error) {
        console.error("Easebuzz Webhook Verification Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
