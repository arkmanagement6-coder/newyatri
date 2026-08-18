import crypto from 'crypto';

export default async function handler(req, res) {
    // Easebuzz posts form data to surl/furl
    const data = req.body || req.query || {};
    const { txnid, status, amount, email, firstname, productinfo, hash } = data;

    const KEY = "Y2T9CT9Z7";
    const SALT = "1MWJFXQ0A";

    const orderId = txnid || 'unknown';

    try {
        if (hash && status) {
            // Verify Response Hash
            // Sequence: salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
            const uEmail = (email || '').trim();
            const uFirstname = (firstname || '').trim();
            const uProductinfo = (productinfo || '').trim();
            const uAmount = parseFloat(amount || 0).toFixed(2);

            const hashSequence = `${SALT}|${status}|||||||||||${uEmail}|${uFirstname}|${uProductinfo}|${uAmount}|${orderId}|${KEY}`;
            const expectedHash = crypto.createHash('sha512').update(hashSequence).digest('hex');

            if (hash.toLowerCase() !== expectedHash.toLowerCase()) {
                console.warn(`Easebuzz Hash mismatch! Expected: ${expectedHash}, Received: ${hash}`);
            } else {
                console.log(`Easebuzz Response Hash verified successfully for transaction: ${orderId}`);
            }
        }
    } catch (err) {
        console.error("Error verifying Easebuzz response hash:", err);
    }

    // Perform HTTP 302 Redirect to order-success.html
    return res.redirect(302, `/order-success.html?id=${encodeURIComponent(orderId)}`);
}
