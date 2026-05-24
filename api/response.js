import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }

    try {
        const body = req.body || {};
        
        // Easebuzz Salt
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

        const host = req.headers.host || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';

        if (!isValid) {
            console.warn("Easebuzz Signature Verification Failed! Calculated:", calculatedHash, "Received:", receivedHash);
            res.writeHead(302, { Location: `${protocol}://${host}/checkout.html?status=failed&id=${body.txnid || 'unknown'}&error=signature_failed` });
            return res.end();
        }

        if (body.status === 'success') {
            console.log(`Easebuzz Redirect: Payment SUCCESS for Order: ${body.txnid}, Amount: ${body.amount}`);
            res.writeHead(302, { Location: `${protocol}://${host}/order-success.html?id=${body.txnid}` });
            return res.end();
        } else {
            console.log(`Easebuzz Redirect: Payment FAILED/CANCELLED for Order: ${body.txnid}, Status: ${body.status}`);
            res.writeHead(302, { Location: `${protocol}://${host}/checkout.html?status=failed&id=${body.txnid}` });
            return res.end();
        }
    } catch (error) {
        console.error("Easebuzz Response Redirection Handler Error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
    }
}
