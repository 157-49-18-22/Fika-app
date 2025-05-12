import React, { useState } from 'react';
import './ReturnsExchange.css';

const mockOrder = {
  id: 'FIKA12345',
  date: '2025-05-10',
  items: [
    {
      name: 'Handcrafted Cushion',
      image: 'https://images.unsplash.com/photo-1540638349517-3abd5afc5847?auto=format&fit=crop&w=400&q=80',
      price: '₹899',
      qty: 1,
    },
    {
      name: 'Artisan Throw Blanket',
      image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=400&q=80',
      price: '₹1,299',
      qty: 1,
    },
  ],
};

const faqs = [
  {
    q: 'How long do returns/exchanges take?',
    a: 'Returns/exchanges are processed within 5-7 business days after we receive your item.'
  },
  {
    q: 'Can I return a used item?',
    a: 'Items must be unused, unwashed, and in original packaging to be eligible.'
  },
  {
    q: 'How do I track my return status?',
    a: 'You will receive email updates at each stage, and can check status on your account.'
  },
  {
    q: 'Are shipping charges refunded?',
    a: 'Original shipping charges are non-refundable unless the return is due to our error.'
  },
];

const steps = [
  'Order Lookup',
  'Order Summary',
  'Request Details',
  'Review & Submit',
];

const refundMethods = [
  { value: 'store', label: 'Store Credit' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'original', label: 'Original Payment Method' },
];

const ReturnsExchange = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    orderId: '',
    email: '',
    phone: '',
    type: 'return',
    reason: '',
    details: '',
    file: null,
    product: '',
    size: '',
    color: '',
    pickupAddress: '',
    refundMethod: 'store',
    bankAccount: '',
    ifsc: '',
    accountHolder: '',
    invoice: null,
    agree: false,
  });
  const [order, setOrder] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Stepper
  const Stepper = () => (
    <div className="returns-stepper">
      {steps.map((label, idx) => (
        <div key={label} className={`stepper-step${step === idx ? ' active' : ''}${step > idx ? ' done' : ''}`}> 
          <div className="stepper-circle">{idx + 1}</div>
          <div className="stepper-label">{label}</div>
        </div>
      ))}
    </div>
  );

  // Handlers
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : (type === 'checkbox' ? checked : value) }));
  };

  const handleOrderLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLookupError('');
    // Simulate API delay
    await new Promise(res => setTimeout(res, 1200));
    // TEMP: Always succeed for flow testing
    setOrder(mockOrder);
    const firstProduct = mockOrder.items[0];
    setForm((prev) => ({
      ...prev,
      product: firstProduct?.name || '',
      size: firstProduct?.size || '',
      color: firstProduct?.color || '',
      pickupAddress: '123, Your Street, City, State, 123456',
    }));
    setLoading(false);
    setStep(1);
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation for required fields
    if (!form.agree) {
      setErrors({ agree: 'You must agree to the return policy.' });
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  // FAQ
  const toggleFaq = (idx) => setFaqOpen(faqOpen === idx ? null : idx);

  return (
    <div className="returns-exchange-page">
      <div className="returns-hero">
        <h1>Returns & Exchange</h1>
        <p>We want you to love your Fika purchase! If something isn't right, our advanced returns and exchange process is here to help.</p>
      </div>
      <div className="returns-content advanced">
        <div className="returns-main">
          <Stepper />
          {/* Step 0: Order Lookup */}
          {step === 0 && (
            <form className="returns-form" onSubmit={handleOrderLookup}>
              <div className="form-group">
                <label htmlFor="orderId">Order ID</label>
                <input type="text" id="orderId" name="orderId" value={form.orderId} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required pattern="[0-9]{10}" placeholder="10-digit mobile number" />
              </div>
              {lookupError && <div className="error-message" style={{color:'red',marginBottom:'10px'}}>{lookupError}</div>}
              <button type="submit" className="returns-btn" disabled={loading}>
                {loading ? <span className="spinner" style={{display:'inline-block',width:'18px',height:'18px',border:'3px solid #fff',borderTop:'3px solid #7c3aed',borderRadius:'50%',animation:'spin 1s linear infinite',verticalAlign:'middle'}}></span> : 'Lookup Order'}
              </button>
            </form>
          )}
          {/* Step 1: Order Summary */}
          {step === 1 && order && (
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-info">
                <div><b>Order ID:</b> {order.id}</div>
                <div><b>Date:</b> {order.date}</div>
              </div>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div className="order-item" key={idx}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-meta">{item.qty} x {item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="returns-btn" onClick={handleNext}>Continue</button>
              <button className="returns-btn secondary" onClick={handleBack}>Back</button>
            </div>
          )}
          {/* Step 2: Request Details */}
          {step === 2 && order && (
            <form className="returns-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              <div className="form-group">
                <label htmlFor="product">Select Product</label>
                <select name="product" id="product" value={form.product} onChange={e => {
                  const selected = order.items.find(i => i.name === e.target.value);
                  setForm(prev => ({
                    ...prev,
                    product: selected.name,
                    size: selected.size,
                    color: selected.color
                  }));
                }} required>
                  {order.items.map((item, idx) => (
                    <option key={idx} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="size">Product Size</label>
                <input type="text" id="size" name="size" value={form.size} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="color">Product Color</label>
                <input type="text" id="color" name="color" value={form.color} readOnly />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="return">Return</option>
                  <option value="exchange">Exchange</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <input type="text" id="reason" name="reason" value={form.reason} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="details">Details (optional)</label>
                <textarea id="details" name="details" value={form.details} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="pickupAddress">Pickup Address</label>
                <textarea id="pickupAddress" name="pickupAddress" value={form.pickupAddress} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="refundMethod">Preferred Refund Method</label>
                <select name="refundMethod" id="refundMethod" value={form.refundMethod} onChange={handleChange} required>
                  {refundMethods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              {form.refundMethod === 'bank' && (
                <>
                  <div className="form-group">
                    <label htmlFor="bankAccount">Bank Account Number</label>
                    <input type="text" id="bankAccount" name="bankAccount" value={form.bankAccount} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ifsc">IFSC Code</label>
                    <input type="text" id="ifsc" name="ifsc" value={form.ifsc} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="accountHolder">Account Holder Name</label>
                    <input type="text" id="accountHolder" name="accountHolder" value={form.accountHolder} onChange={handleChange} required />
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="file">Upload Product Image (optional)</label>
                <input type="file" id="file" name="file" accept="image/*" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="invoice">Upload Invoice (optional)</label>
                <input type="file" id="invoice" name="invoice" accept="application/pdf,image/*" onChange={handleChange} />
              </div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <input type="checkbox" id="agree" name="agree" checked={form.agree} onChange={handleChange} required />
                <label htmlFor="agree" style={{margin:0}}>I agree to the <a href="#" target="_blank" rel="noopener noreferrer">return policy</a></label>
                {errors.agree && <span className="error-message">{errors.agree}</span>}
              </div>
              <button className="returns-btn" type="submit">Continue</button>
              <button className="returns-btn secondary" type="button" onClick={handleBack}>Back</button>
            </form>
          )}
          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <form className="returns-form" onSubmit={handleSubmit}>
              <h2>Review Your Request</h2>
              <div className="review-block">
                <b>Order ID:</b> {form.orderId}<br />
                <b>Email:</b> {form.email}<br />
                <b>Phone:</b> {form.phone}<br />
                <b>Product:</b> {form.product}<br />
                <b>Type:</b> {form.type}<br />
                <b>Reason:</b> {form.reason}<br />
                {form.details && (<><b>Details:</b> {form.details}<br /></>)}
                <b>Pickup Address:</b> {form.pickupAddress}<br />
                <b>Refund Method:</b> {refundMethods.find(m => m.value === form.refundMethod)?.label}<br />
                {form.refundMethod === 'bank' && (
                  <>
                    <b>Bank Account:</b> {form.bankAccount}<br />
                    <b>IFSC:</b> {form.ifsc}<br />
                    <b>Account Holder:</b> {form.accountHolder}<br />
                  </>
                )}
                {form.file && (
                  <div style={{marginTop: '10px'}}>
                    <b>Uploaded Product Image:</b><br />
                    <img src={URL.createObjectURL(form.file)} alt="Uploaded" style={{maxWidth: '120px', borderRadius: '8px'}} />
                  </div>
                )}
                {form.invoice && (
                  <div style={{marginTop: '10px'}}>
                    <b>Uploaded Invoice:</b><br />
                    {form.invoice.type.startsWith('image') ? (
                      <img src={URL.createObjectURL(form.invoice)} alt="Invoice" style={{maxWidth: '120px', borderRadius: '8px'}} />
                    ) : (
                      <a href={URL.createObjectURL(form.invoice)} target="_blank" rel="noopener noreferrer">View Invoice</a>
                    )}
                  </div>
                )}
                <b>Agreed to Policy:</b> {form.agree ? 'Yes' : 'No'}<br />
              </div>
              <button className="returns-btn" type="submit">Submit Request</button>
              <button className="returns-btn secondary" type="button" onClick={handleBack}>Back</button>
            </form>
          )}
          {/* Success */}
          {submitted && (
            <div className="returns-success">
              <h3>Thank you!</h3>
              <p>Your request has been submitted. Our team will contact you soon.</p>
              <div className="returns-status-tracker">
                <div className="status-step active">Submitted</div>
                <div className="status-step">Processing</div>
                <div className="status-step">Pickup/Return</div>
                <div className="status-step">Refund/Exchange</div>
              </div>
            </div>
          )}
        </div>
        {/* FAQ Section */}
        <div className="returns-faq">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <div className="faq-q" onClick={() => toggleFaq(idx)}>
                {faq.q}
                <span className="faq-toggle">{faqOpen === idx ? '-' : '+'}</span>
              </div>
              {faqOpen === idx && <div className="faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchange; 