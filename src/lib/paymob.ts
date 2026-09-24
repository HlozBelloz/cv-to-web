export interface PaymobOrderRequest {
  amountCents: number; // in piasters (e.g. 100 EGP = 10000 cents)
  currency: string;    // 'EGP'
  userEmail: string;
  userName: string;
  userPhone: string;
  planId: string;
  planName: string;
}

export interface PaymentInitResult {
  isMock: boolean;
  paymentUrl?: string;
  iframeId?: string;
  transactionId: string;
  message: string;
}

export const paymobService = {
  isConfigured(): boolean {
    return Boolean(process.env.PAYMOB_API_KEY && process.env.PAYMOB_INTEGRATION_ID);
  },

  async initiatePayment(req: PaymobOrderRequest): Promise<PaymentInitResult> {
    const isMock = !this.isConfigured() || process.env.PAYMOB_ENABLE_MOCK === 'true';

    // If running in Mock/Test Mode (Default for safe testing)
    if (isMock) {
      console.log(`[PAYMOB MOCK] Simulated payment of ${(req.amountCents / 100).toFixed(2)} EGP for ${req.userName} (${req.planName})`);
      const mockTxId = `MOCK-EGP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        isMock: true,
        transactionId: mockTxId,
        paymentUrl: `/checkout/success?txId=${mockTxId}&amount=${req.amountCents / 100}&plan=${encodeURIComponent(req.planId)}`,
        message: 'Sandbox / Mock Payment Mode active. No real credit card or wallet was charged.'
      };
    }

    // Live Paymob API Pipeline
    try {
      // 1. Authenticate with Paymob
      const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY })
      });
      const authData = await authRes.json();
      const authToken = authData.token;

      // 2. Order Registration
      const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: 'false',
          amount_cents: req.amountCents.toString(),
          currency: 'EGP',
          items: [{
            name: req.planName,
            amount_cents: req.amountCents.toString(),
            description: 'CVtoWeb Executive Website Hosting Plan',
            quantity: '1'
          }]
        })
      });
      const orderData = await orderRes.json();
      const orderId = orderData.id;

      // 3. Payment Key Request
      const names = req.userName.split(' ');
      const firstName = names[0] || 'Customer';
      const lastName = names.slice(1).join(' ') || 'Candidate';

      const keyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: req.amountCents.toString(),
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: 'NA',
            email: req.userEmail,
            floor: 'NA',
            first_name: firstName,
            street: 'NA',
            building: 'NA',
            phone_number: req.userPhone || '+201000000000',
            shipping_method: 'PKG',
            postal_code: 'NA',
            city: 'Cairo',
            country: 'EG',
            last_name: lastName,
            state: 'Cairo'
          },
          currency: 'EGP',
          integration_id: process.env.PAYMOB_INTEGRATION_ID
        })
      });
      const keyData = await keyRes.json();
      const paymentToken = keyData.token;
      const iframeId = process.env.PAYMOB_IFRAME_ID || '800000';

      return {
        isMock: false,
        iframeId,
        paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`,
        transactionId: orderId.toString(),
        message: 'Redirecting to secure Egyptian payment gateway...'
      };
    } catch (err: unknown) {
      console.error('Paymob Live Payment Error:', err);
      const message = err instanceof Error ? err.message : 'Unknown payment processing error';
      throw new Error(`Paymob connection failed: ${message}`);
    }
  }
};
