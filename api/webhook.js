import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = req.body || {};
        const { txnid, status, amount, email, firstname, productinfo, hash } = data;

        if (!txnid || !hash) {
            return res.status(400).json({ error: 'Missing required webhook payload' });
        }

        // --- EASEBUZZ LIVE PRODUCTION CREDENTIALS ---
        const KEY = process.env.EASEBUZZ_KEY || "KF3N4LF6E5";
        const SALT = process.env.EASEBUZZ_SALT || "A4RWRB1HMF";

        // Verify Easebuzz Hash
        // Sequence: salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        const uEmail = (email || '').trim();
        const uFirstname = (firstname || '').trim();
        const uProductinfo = (productinfo || '').trim();
        const uAmount = parseFloat(amount || 0).toFixed(2);

        const hashArray = [
            SALT.trim(),
            status.trim(),
            '', '', '', '', '', '', '', '', '', '', // 10 empty UDFs (udf10 down to udf1)
            uEmail,
            uFirstname,
            uProductinfo,
            uAmount,
            String(txnid).trim(),
            KEY.trim()
        ];

        const expectedHash = crypto.createHash('sha512').update(hashArray.join('|')).digest('hex').toLowerCase();

        if (hash.toLowerCase() !== expectedHash) {
            console.warn(`Easebuzz Webhook Signature Verification Failed! Expected: ${expectedHash}, Received: ${hash}`);
            return res.status(401).json({ error: 'Signature verification failed' });
        }

        console.log(`Easebuzz Webhook Verified for Transaction: ${txnid}, Status: ${status}`);

        if (status === 'success') {
            console.log(`Payment SUCCESS for Order: ${txnid}, Amount: ${amount} INR`);
        } else {
            console.log(`Payment ${status.toUpperCase()} for Order: ${txnid}`);
        }

        return res.status(200).json({ success: true, message: 'Easebuzz Webhook received and verified successfully' });

    } catch (error) {
        console.error("Easebuzz Webhook Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
