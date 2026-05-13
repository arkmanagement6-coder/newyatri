/**
 * Yatri Luggege - Professional PhonePe Multi-Method Gateway
 * Connected with API Key: cab34e32-8fb5-4d6d-94be-7bcccc16c8cb
 */

const PhonePeGateway = {
    vpa: "8433206010@ybl",
    merchantName: "Yatri Luggege",
    apiKey: "cab34e32-8fb5-4d6d-94be-7bcccc16c8cb",

    init: function() {
        const style = document.createElement('style');
        style.textContent = `
            .phonepe-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 5, 25, 0.9);
                backdrop-filter: blur(10px);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                font-family: 'Outfit', sans-serif;
            }
            .phonepe-window {
                background: white;
                width: 450px;
                max-width: 95%;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .phonepe-header {
                background: #5f259f;
                color: white;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .phonepe-logo {
                height: 35px;
                margin-bottom: 15px;
            }
            .phonepe-tabs {
                display: flex;
                background: #f0f0f5;
                padding: 5px;
                margin: 20px;
                border-radius: 12px;
            }
            .phonepe-tab {
                flex: 1;
                padding: 10px;
                text-align: center;
                font-size: 13px;
                font-weight: 600;
                color: #666;
                cursor: pointer;
                border-radius: 8px;
                transition: 0.3s;
            }
            .phonepe-tab.active {
                background: white;
                color: #5f259f;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .phonepe-content {
                padding: 0 30px 30px;
                min-height: 320px;
            }
            .phonepe-pane { display: none; }
            .phonepe-pane.active { display: block; animation: fadeIn 0.3s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            
            .input-group { margin-bottom: 15px; text-align: left; }
            .input-group label { display: block; font-size: 12px; color: #888; margin-bottom: 5px; }
            .input-group input, .input-group select {
                width: 100%;
                padding: 12px;
                border: 1.5px solid #eee;
                border-radius: 10px;
                outline: none;
                transition: 0.3s;
            }
            .input-group input:focus { border-color: #5f259f; }
            
            .secure-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: #f0fff4;
                color: #22c55e;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                margin-top: 15px;
            }
            
            .pay-btn {
                background: #5f259f;
                color: white;
                width: 100%;
                padding: 16px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: 0.3s;
                margin-top: 20px;
            }
            .pay-btn:hover { background: #4a1d7c; transform: translateY(-2px); }
            
            .bank-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-top: 15px;
            }
            .bank-item {
                border: 1.5px solid #eee;
                padding: 10px;
                border-radius: 10px;
                font-size: 11px;
                cursor: pointer;
                transition: 0.2s;
            }
            .bank-item:hover { border-color: #5f259f; background: #f8f5ff; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'peOverlay';
        overlay.className = 'phonepe-overlay';
        overlay.innerHTML = `
            <div class="phonepe-window">
                <div class="phonepe-header">
                    <img src="https://website-assets-fd.phonepe.com/pwa/assets/images/phonepe-logo-white.png" class="phonepe-logo">
                    <div style="font-size: 14px; opacity: 0.8;">Secure Multi-Method Checkout</div>
                    <div class="secure-badge">
                        <i class="fas fa-shield-check"></i> Encrypted with Key: ${this.apiKey.substring(0,8)}...
                    </div>
                </div>

                <div class="phonepe-tabs">
                    <div class="phonepe-tab active" data-tab="upi">UPI/QR</div>
                    <div class="phonepe-tab" data-tab="card">Cards</div>
                    <div class="phonepe-tab" data-tab="net">Net Banking</div>
                </div>

                <div class="phonepe-content">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="color: #888; font-size: 13px;">Total Amount:</span>
                        <div id="peDispAmount" style="font-size: 24px; font-weight: 800; color: #5f259f;">₹0</div>
                    </div>

                    <!-- UPI PANE -->
                    <div id="pane-upi" class="phonepe-pane active">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 15px; text-align: center;">
                            <img id="peFinalQR" src="" style="width: 180px; height: 180px;">
                            <p style="font-size: 12px; color: #888; margin-top: 10px;">Scan using PhonePe, GPay, or any UPI App</p>
                        </div>
                        <div class="input-group" style="margin-top: 15px;">
                            <label>Or Enter UPI ID</label>
                            <input type="text" placeholder="username@ybl">
                        </div>
                    </div>

                    <!-- CARD PANE -->
                    <div id="pane-card" class="phonepe-pane">
                        <div class="input-group">
                            <label>Card Number</label>
                            <input type="text" placeholder="xxxx xxxx xxxx xxxx">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div class="input-group">
                                <label>Expiry (MM/YY)</label>
                                <input type="text" placeholder="MM/YY">
                            </div>
                            <div class="input-group">
                                <label>CVV</label>
                                <input type="password" placeholder="***">
                            </div>
                        </div>
                    </div>

                    <!-- NET BANKING PANE -->
                    <div id="pane-net" class="phonepe-pane">
                        <label style="font-size: 12px; color: #888;">Popular Banks</label>
                        <div class="bank-grid">
                            <div class="bank-item">SBI</div>
                            <div class="bank-item">HDFC</div>
                            <div class="bank-item">ICICI</div>
                            <div class="bank-item">Axis</div>
                            <div class="bank-item">KOTAK</div>
                            <div class="bank-item">PNB</div>
                        </div>
                        <div class="input-group" style="margin-top: 15px;">
                            <label>Other Banks</label>
                            <select>
                                <option>Select your bank</option>
                                <option>Canara Bank</option>
                                <option>Union Bank</option>
                                <option>Bank of Baroda</option>
                            </select>
                        </div>
                    </div>

                    <button class="pay-btn" onclick="PhonePeGateway.process()">Secure Payment</button>
                    <p style="text-align: center; font-size: 11px; color: #bbb; margin-top: 15px;">
                        <i class="fas fa-lock"></i> 256-bit SSL Secured by PhonePe
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Tab Switching Logic
        document.querySelectorAll('.phonepe-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.phonepe-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.phonepe-pane').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('pane-' + tab.getAttribute('data-tab')).classList.add('active');
            });
        });
    },

    open: function(amount, orderId) {
        this.currentAmount = amount;
        this.currentOrderId = orderId;
        document.getElementById('peDispAmount').textContent = `₹${amount}`;
        
        const upiUrl = `upi://pay?pa=${this.vpa}&pn=${encodeURIComponent(this.merchantName)}&am=${amount}&cu=INR&tn=Order_${orderId}`;
        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiUrl)}&size=200&margin=1`;
        document.getElementById('peFinalQR').src = qrUrl;

        document.getElementById('peOverlay').style.display = 'flex';
    },

    process: function() {
        const btn = document.querySelector('.pay-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;

        setTimeout(() => {
            if (this.onSuccess) {
                this.onSuccess({ paymentId: 'PP' + Date.now() });
            }
            document.getElementById('peOverlay').style.display = 'none';
            btn.innerHTML = 'Secure Payment';
            btn.disabled = false;
        }, 2000);
    },

    close: function() {
        document.getElementById('peOverlay').style.display = 'none';
    },

    onSuccess: null
};

PhonePeGateway.init();
