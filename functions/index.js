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
const razorpayConfig = functions.config().razorpay || {};
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || razorpayConfig.key_id;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || razorpayConfig.key_secret;

// Create Razorpay instance with fallback to hardcoded test keys if config is missing
const razorpay = new Razorpay({
  key_id: razorpayKeyId || "rzp_test_05BxV9TnB6Qc7g",  // Fallback to test key
  key_secret: razorpayKeySecret || "J6wyqGXN02nsAAZm8w9Ivzjm",  // Fallback to test key
});

// Test Razorpay connection
exports.testRazorpayConnection = functions.https.onCall(async (data, context) => {
  console.log('=== Testing Razorpay connection ===');
  try {
    // Log key information without exposing full values
    console.log('Razorpay keys info:', {
      key_id: razorpay.key_id.substring(0, 5) + '...',
      key_secret: razorpay.key_secret ? '****' + razorpay.key_secret.substring(razorpay.key_secret.length - 4) : 'undefined',
      key_id_from_config: razorpayConfig?.key_id ? 'exists' : 'missing',
      key_secret_from_config: razorpayConfig?.key_secret ? 'exists' : 'missing',
      key_id_from_env: process.env.RAZORPAY_KEY_ID ? 'exists' : 'missing',
      key_secret_from_env: process.env.RAZORPAY_KEY_SECRET ? 'exists' : 'missing'
    });
    
    const result = await razorpay.payments.all({count: 1});
    console.log('Razorpay connection successful:', result);
    return {
      success: true,
      message: 'Connection successful',
      data: result
    };
  } catch (error) {
    console.error('Razorpay connection test failed:', error);
    return {
      success: false,
      message: 'Connection failed',
      error: {
        message: error.message,
        code: error.error?.code,
        description: error.error?.description
      }
    };
  }
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
  
  // Declare options outside try block so it's available in catch
  let options;
  
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
    
    if (!amount || isNaN(amount) || amount <= 0) {
      console.log('Invalid amount:', amount);
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Amount must be a positive number"
      );
    }

    // Check Razorpay keys - log first few characters only to protect secrets
    console.log('Using Razorpay keys:', {
      key_id: razorpay.key_id.substring(0, 5) + '...',
      key_secret: razorpay.key_secret ? '****' + razorpay.key_secret.substring(razorpay.key_secret.length - 4) : 'undefined',
    });
    
    if (!razorpay.key_id || !razorpay.key_secret) {
      console.error('Razorpay configuration missing');
      throw new functions.https.HttpsError(
        "internal",
        "Razorpay configuration is missing"
      );
    }

    // Prepare order options - ensure amount is an integer in paise
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    
    // Simplified options with only essential fields
    options = {
      amount: amountInPaise,
      currency: "INR"
      // Optional fields removed
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

    // Verify signature using Razorpay key secret
    const generated_signature = crypto
      .createHmac("sha256", razorpay.key_secret)
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

// Create test order with fixed amount
exports.createTestOrder = functions.https.onCall(async (data, context) => {
  console.log('=== Starting createTestOrder function ===');
  
  try {
    // Using a fixed small amount for testing
    const testAmount = 10000; // 100 INR in paise
    
    console.log('Test Razorpay keys:', {
      key_id: razorpay.key_id ? 'Present' : 'Missing',
      key_secret: razorpay.key_secret ? 'Present' : 'Missing',
    });
    
    console.log('Creating test order with amount:', testAmount);
    
    const options = {
      amount: testAmount,
      currency: "INR",
      receipt: `test_${Date.now()}`,
      notes: {
        test: true
      }
    };
    
    // Direct API call without retry
    try {
      const result = await razorpay.orders.create(options);
      console.log('Test order created successfully:', {
        id: result.id,
        amount: result.amount,
        currency: result.currency
      });
      return result;
    } catch (error) {
      console.error('Test order creation error:', {
        error_message: error.message,
        error_description: error.error?.description,
        statusCode: error.statusCode
      });
      throw error;
    }
  } catch (error) {
    console.error('Overall test error:', error);
    throw new functions.https.HttpsError('internal', 'Error creating test order', error);
  }
});

// HTTP endpoint for payment verification via callback URL
exports.verifyPaymentCallback = functions.https.onRequest(async (req, res) => {
  console.log('=== Payment callback received ===');
  console.log('Request body:', req.body);
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment verification parameters');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing payment verification parameters' 
      });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    
    const isVerified = generated_signature === razorpay_signature;
    
    if (isVerified) {
      console.log('Payment verified successfully');
      // Redirect to success page
      res.redirect(302, `${req.headers.origin || '/'}/payment-success?order_id=${razorpay_order_id}`);
    } else {
      console.error('Payment verification failed');
      res.redirect(302, `${req.headers.origin || '/'}/payment-failed`);
    }
  } catch (error) {
    console.error('Error in payment callback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing payment verification' 
    });
  }
});
