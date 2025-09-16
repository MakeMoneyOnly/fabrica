export interface InitPaymentInput {
  orderId: string;
  amountInt: number;
  currency: string; // ETB
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentInitializationResult {
  provider: string;
  transactionId?: string;
  paymentUrl?: string;
  amount: number;
  currency: string;
  orderId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow for provider-specific fields
}

export interface PaymentVerificationResult {
  provider: string;
  status: string;
  verified: boolean;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow for provider-specific fields
}

export interface WebhookResult {
  provider: string;
  verified: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow for provider-specific fields
}

export interface PaymentProvider {
  initializePayment(input: InitPaymentInput): Promise<PaymentInitializationResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifyPayment?(payload: Record<string, any>): Promise<PaymentVerificationResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleWebhook(payload: Record<string, any>): Promise<WebhookResult>;
}
