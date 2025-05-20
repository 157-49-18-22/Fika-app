import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, 'us-central1'); // Add your region here
const db = getFirestore(app);

// Create Razorpay order
export const createRazorpayOrder = async (amount) => {
  try {
    const createOrder = httpsCallable(functions, 'createRazorpayOrder');
    const result = await createOrder({ amount });
    
    // Store order in Firestore
    await addDoc(collection(db, 'orders'), {
      orderId: result.data.id,
      amount: amount,
      currency: 'INR',
      status: 'created',
      createdAt: new Date()
    });

    return result.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const verifyPaymentFunction = httpsCallable(functions, 'verifyRazorpayPayment');
    const result = await verifyPaymentFunction(paymentData);

    if (result.data.verified) {
      // Update order status in Firestore
      const orderRef = doc(db, 'orders', paymentData.razorpay_order_id);
      await updateDoc(orderRef, {
        status: 'completed',
        paymentId: paymentData.razorpay_payment_id,
        completedAt: new Date()
      });
    }

    return result.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 