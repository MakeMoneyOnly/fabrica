// FlexPay JavaScript SDK Example

// Initialize the FlexPay client
const flexpay = new FlexPay({
  apiKey: 'your_api_key',
  environment: 'production', // or 'sandbox' for testing
});

// Create a new transaction
async function createTransaction() {
  try {
    const transaction = await flexpay.transactions.create({
      amount: 1000,
      currency: 'ETB',
      customer: {
        phoneNumber: '+251912345678',
        email: 'customer@example.com',
      },
      items: [
        {
          name: 'Product Name',
          price: 1000,
          quantity: 1,
          description: 'Product description',
          imageUrl: 'https://example.com/product.jpg',
        },
      ],
      redirectUrl: 'https://your-store.com/checkout/complete',
      metadata: {
        orderId: '12345',
      },
    });

    console.log('Transaction created:', transaction);

    // Redirect the customer to the payment URL
    window.location.href = transaction.paymentUrl;
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
}

// Get transaction details
async function getTransaction(transactionId) {
  try {
    const transaction = await flexpay.transactions.get(transactionId);
    console.log('Transaction details:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error getting transaction:', error);
  }
}

// List transactions
async function listTransactions(options = {}) {
  try {
    const transactions = await flexpay.transactions.list({
      page: options.page || 1,
      limit: options.limit || 10,
      status: options.status,
      startDate: options.startDate,
      endDate: options.endDate,
    });
    console.log('Transactions:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error listing transactions:', error);
  }
}

// Example: Create a transaction when the checkout button is clicked
document.getElementById('checkout-button').addEventListener('click', function(event) {
  event.preventDefault();
  createTransaction();
});

// Example: Verify a transaction when the page loads (e.g., on the redirect page)
document.addEventListener('DOMContentLoaded', function() {
  // Get transaction ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get('transaction_id');
  
  if (transactionId) {
    getTransaction(transactionId)
      .then(transaction => {
        if (transaction.status === 'COMPLETED') {
          // Show success message
          document.getElementById('transaction-status').textContent = 'Payment successful!';
        } else if (transaction.status === 'PENDING') {
          // Show pending message
          document.getElementById('transaction-status').textContent = 'Payment is being processed...';
        } else {
          // Show error message
          document.getElementById('transaction-status').textContent = 'Payment failed or cancelled.';
        }
      });
  }
});

// Example: Implementing a webhook handler (server-side code)
// This would be implemented in your backend
/*
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhooks/flexpay', (req, res) => {
  const event = req.body;
  
  // Verify webhook signature (recommended for security)
  const signature = req.headers['x-flexpay-signature'];
  const isValid = flexpay.webhooks.verifySignature(signature, req.body);
  
  if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
  
  // Handle different event types
  switch (event.event) {
    case 'transaction.created':
      console.log('Transaction created:', event.data);
      // Update order status in your database
      break;
    case 'transaction.approved':
      console.log('Transaction approved:', event.data);
      // Update order status in your database
      break;
    case 'transaction.completed':
      console.log('Transaction completed:', event.data);
      // Fulfill the order
      break;
    case 'transaction.rejected':
      console.log('Transaction rejected:', event.data);
      // Handle rejection
      break;
    case 'transaction.cancelled':
      console.log('Transaction cancelled:', event.data);
      // Handle cancellation
      break;
    default:
      console.log('Unknown event type:', event.event);
  }
  
  // Acknowledge receipt of the webhook
  res.status(200).send('Webhook received');
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
*/
