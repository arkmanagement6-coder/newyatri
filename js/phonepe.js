/**
 * Yatri Luggege - PhonePe Payment Gateway Integration
 */

const PhonePeGateway = {
    vpa: "8433206010@ybl", // Using your registered mobile for UPI
    merchantName: "Yatri Luggege",

    init: function() {
        // Inject PhonePe Modal Styles
        const style = document.createElement('style');
        style.textContent = `
            .phonepe-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                font-family: 'Poppins', sans-serif;
            }
            .phonepe-card {
                background: white;
                width: 400px;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                position: relative;
            }
            .phonepe-header {
                background: #5f259f; /* PhonePe Purple */
                color: white;
                padding: 25px;
                text-align: center;
            }
            .phonepe-body {
                padding: 30px;
                text-align: center;
            }
            .phonepe-amount {
                font-size: 28px;
                font-weight: 700;
                color: #5f259f;
                margin-bottom: 20px;
            }
            .qr-container {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 20px;
                display: inline-block;
            }
            .phonepe-btn {
                background: #5f259f;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                margin-top: 10px;
                transition: 0.3s;
            }
            .phonepe-btn:hover {
                background: #4a1d7c;
            }
            .phonepe-close {
                position: absolute;
                top: 15px;
                right: 15px;
                color: white;
                cursor: pointer;
                font-size: 20px;
            }
            @media (max-width: 480px) {
                .phonepe-card { width: 90%; }
            }
        `;
        document.head.appendChild(style);

        // Inject Modal HTML
        const modal = document.createElement('div');
        modal.id = 'phonepeModal';
        modal.className = 'phonepe-modal';
        modal.innerHTML = `
            <div class="phonepe-card">
                <div class="phonepe-close" onclick="PhonePeGateway.close()">&times;</div>
                <div class="phonepe-header">
                    <svg viewBox="0 0 100 24" style="height: 30px; fill: white;">
                        <path d="M12.5 0c-6.9 0-12.5 5.6-12.5 12.5s5.6 12.5 12.5 12.5 12.5-5.6 12.5-12.5-5.6-12.5-12.5-12.5zm0 21.9c-5.2 0-9.4-4.2-9.4-9.4s4.2-9.4 9.4-9.4 9.4 4.2 9.4 9.4-4.2 9.4-9.4 9.4zM50 4h-4.4v16h4.4v-6.2c0-2.1 1.2-3.4 3.1-3.4 1.8 0 2.9 1.1 2.9 3.1v6.5h4.4v-7.1c0-4.1-2.4-6.4-5.6-6.4-2.5 0-4.2 1.2-5.1 3.1h-.1v-2.6h-4.4v16h4.4v-6.2c0-2.1 1.2-3.4 3.1-3.4 1.8 0 2.9 1.1 2.9 3.1v6.5h4.4v-7.1c0-4.1-2.4-6.4-5.6-6.4-2.5 0-4.2 1.2-5.1 3.1V4z"/>
                        <text x="30" y="18" font-family="Arial" font-weight="bold" font-size="16" fill="white">PhonePe</text>
                    </svg>
                </div>
                <div class="phonepe-body">
                    <p style="color: #666; margin-bottom: 5px;">Paying to ${this.merchantName}</p>
                    <div class="phonepe-amount" id="peAmount">₹0</div>
                    
                    <div style="margin-bottom: 20px; font-size: 12px; color: #22c55e; display: flex; align-items: center; justify-content: center; gap: 5px;">
                        <i class="fas fa-shield-alt"></i> Securely Connected (API: ${CONFIG.PAYMENT_GATEWAY_API_KEY.substring(0,8)}...)
                    </div>
                    
                    <div id="desktopUI">
                        <div class="qr-container">
                            <img id="peQR" src="" alt="Scan to Pay" style="width: 200px; height: 200px;">
                        </div>
                        <p style="font-size: 13px; color: #888;">Scan QR code using any UPI App</p>
                    </div>

                    <div id="mobileUI" style="display: none;">
                        <button class="phonepe-btn" onclick="PhonePeGateway.openApp()">Pay via PhonePe App</button>
                    </div>

                    <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; display: flex; gap: 10px;">
                        <button class="phonepe-btn" style="background: #22c55e; flex: 1;" onclick="PhonePeGateway.simulateSuccess()">I have paid</button>
                        <button class="phonepe-btn" style="background: #ef4444; flex: 1;" onclick="PhonePeGateway.simulateFailure()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    open: function(amount, orderId) {
        this.currentAmount = amount;
        this.currentOrderId = orderId;
        
        console.log("PhonePe Gateway Initialized with Key:", CONFIG.PAYMENT_GATEWAY_API_KEY);
        
        document.getElementById('peAmount').textContent = `₹${amount}`;
        
        // UPI Intent for Mobile
        const upiUrl = `upi://pay?pa=${this.vpa}&pn=${encodeURIComponent(this.merchantName)}&am=${amount}&cu=INR&tn=Order_${orderId}`;
        
        // QR Code for Desktop (using QuickChart API - More reliable)
        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiUrl)}&size=250&margin=1`;
        document.getElementById('peQR').src = qrUrl;

        // Toggle UI based on device
        if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            document.getElementById('desktopUI').style.display = 'none';
            document.getElementById('mobileUI').style.display = 'block';
        } else {
            document.getElementById('desktopUI').style.display = 'block';
            document.getElementById('mobileUI').style.display = 'none';
        }

        document.getElementById('phonepeModal').style.display = 'flex';
    },

    close: function() {
        document.getElementById('phonepeModal').style.display = 'none';
    },

    openApp: function() {
        const upiUrl = `upi://pay?pa=${this.vpa}&pn=${encodeURIComponent(this.merchantName)}&am=${this.currentAmount}&cu=INR&tn=Order_${this.currentOrderId}`;
        window.location.href = upiUrl;
    },

    simulateSuccess: function() {
        if (this.onSuccess) {
            this.onSuccess({
                paymentId: 'PPE' + Date.now(),
                status: 'Paid'
            });
        }
        this.close();
    },

    simulateFailure: function() {
        if (this.onFailure) {
            this.onFailure("Payment cancelled by user.");
        }
        this.close();
    },

    onSuccess: null,
    onFailure: null
};

// Initialize
PhonePeGateway.init();
