/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();

// Get Razorpay credentials from Firebase config
const razorpayConfig = functions.config().razorpay;
const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Test Razorpay connection
razorpay.payments.all()
  .then(data => {
    console.log('Razorpay connection test successful:', data);
  })
  .catch(error => {
    console.error('Razorpay connection test failed:', error);
  });

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries || error.error?.code !== 'SERVER_ERROR') {
        throw error;
      }
      const delay = initialDelay * Math.pow(2, retries);
      console.log(`Retrying after ${delay}ms (attempt ${retries + 1}/${maxRetries})`);
      await wait(delay);
      retries++;
    }
  }
}

// Create Razorpay order
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  console.log('=== Starting createRazorpayOrder function ===');
  console.log('Received data:', data);
  
  try {
    // Check authentication
    if (!context.auth) {
      console.log('No authentication context found');
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to create an order"
      );
    }
    console.log('Authentication context:', {
      uid: context.auth.uid,
      email: context.auth.token.email
    });

    // Validate amount
    const { amount } = data;
    console.log('Received amount:', amount, 'Type:', typeof amount);
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.log('Invalid amount:', amount);
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Amount must be a positive number"
      );
    }

    // Check Razorpay config
    if (!razorpayConfig || !razorpayConfig.key_id || !razorpayConfig.key_secret) {
      console.error('Razorpay configuration missing');
      throw new functions.https.HttpsError(
        "internal",
        "Razorpay configuration is missing"
      );
    }

    // Prepare order options
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: context.auth.uid,
        email: context.auth.token.email
      }
    };

    console.log('Creating order with options:', {
      ...options,
      amount_in_rupees: amount,
      amount_in_paise: options.amount
    });

    // Create order with retry mechanism
    const order = await retryWithBackoff(async () => {
      const result = await razorpay.orders.create(options);
      console.log('Order created successfully:', {
        id: result.id,
        amount: result.amount,
        currency: result.currency,
        receipt: result.receipt
      });
      return result;
    });

    console.log('=== Ending createRazorpayOrder function ===');
    return order;
  } catch (error) {
    console.error('Error creating order:', {
      error: error,
      error_message: error.message,
      error_description: error.error?.description,
      error_code: error.error?.code,
      error_reason: error.error?.reason,
      error_source: error.error?.source,
      error_step: error.error?.step,
      error_metadata: error.error?.metadata,
      status_code: error.statusCode,
      options_used: options
    });
    throw new functions.https.HttpsError('internal', 'Error creating order', error);
  }
});

// Verify Razorpay payment
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required payment verification parameters"
      );
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", razorpayConfig.key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    return {
      success: true,
      verified: generated_signature === razorpay_signature,
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Error verifying payment"
    );
  }
});
