import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { response } = req.body;

        if (!response) {
            return res.status(400).json({ error: 'Missing response payload' });
        }

        // --- PHONEPE PRODUCTION V2 CREDENTIALS ---
        const SALT_KEY = "cab34e32-8fb5-4d6d-94be-7bcccc16c8cb";
        const SALT_INDEX = 1;

        // Compute checksum: SHA256(Base64_Response + Salt_Key) + "###" + Salt_Index
        const dataToHash = response + SALT_KEY;
        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
        const expectedVerifyHeader = `${hash}###${SALT_INDEX}`;

        const receivedVerifyHeader = req.headers['x-verify'] || req.headers['X-VERIFY'];

        if (!receivedVerifyHeader) {
            console.warn("Missing X-VERIFY Header in callback");
            return res.status(400).json({ error: 'Missing X-VERIFY header' });
        }

        if (receivedVerifyHeader !== expectedVerifyHeader) {
            console.warn("Signature Verification Failed! Expected:", expectedVerifyHeader, "Received:", receivedVerifyHeader);
            return res.status(401).json({ error: 'Signature verification failed' });
        }

        // Decode Base64 Payload
        const decodedString = Buffer.from(response, 'base64').toString('utf-8');
        const decodedPayload = JSON.parse(decodedString);

        console.log("Verified Callback Payload:", decodedPayload);

        // Extract relevant fields
        const { success, code, data } = decodedPayload;

        if (success && code === 'PAYMENT_SUCCESS') {
            const { transactionId, merchantId, amount, paymentState } = data;
            console.log(`Payment SUCCESS for Order: ${transactionId}, Amount: ${amount / 100} INR`);
            // Standard acknowledgment. In a database setup, update order status to 'Paid' here.
        } else {
            console.log(`Payment FAILED/PENDING for Order: ${data?.transactionId || 'unknown'}`);
        }

        // Return 200 OK acknowledgement as strictly required by PhonePe to prevent retries
        return res.status(200).json({ success: true, message: 'Callback received and verified successfully' });

    } catch (error) {
        console.error("Webhook Verification Error:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
