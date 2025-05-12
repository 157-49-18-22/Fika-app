import React, { useState } from 'react';

const TermsAndConditions = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState('return');
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-tabs">
          <button className={activeTab === 'return' ? 'active' : ''} onClick={() => setActiveTab('return')}>Return & Exchange Policy</button>
          <button className={activeTab === 'shipping' ? 'active' : ''} onClick={() => setActiveTab('shipping')}>Shipping Policy</button>
        </div>
        <div className="modal-body">
          {activeTab === 'return' ? (
            <div className="modal-policy-content">
              <h2>Return & Exchange Policy</h2>
              <p>We have 2 DAYS RETURN POLICY only on fresh articles. In case of defected/damaged product, complaint should be raised within 24 hours of delivery of product.</p>
              <p>If the customer is unsatisfied with the product delivered then he/she needs to mail us at email@rdesiigninc.in within 2 days from the date of receiving the parcel or register a return pickup from the tab "exchange & return" on the home page. FIKA will arrange a pick-up from your place (reverse pick-up may not be available on selected pin -codes). We have two options for processing such returns :-</p>
              <ol>
                <li><b>Store Credit</b> - We add amount equal to the product value to your 'FIKA Account'. Store Credit will be issued only after we receive back the product and validate the return. Store credit once issued cannot be refunded back in Bank/Card/Wallet etc. *One side shipping charges are deducted*</li>
                <li><b>Bank Refund</b> - We refund the amount minus Rs. 100/-(adjusted towards re-stocking charges) per product in your bank account and we also deduct the one side shipping charges. We need following bank details - Name, A/c no., IFSC Code, Bank,Branch to process the refund.</li>
              </ol>
              <p><b>DISCOUNTED PRODUCT:</b> Discounted product can only be exchanged and refund cannot be done for the same. New and fresh products can be purchased from the store credit available from the return of discounted product. If discounted bill value is below 2999 then there will a shipping charge of 150/- which the customer has to bear while exchanging the product. However coupon codes which are offered by us does not fall under the discounted category and hence are eligible for refunds.</p>
              <p><b>OTHER CASES</b><br/>If the return is due to an error on our part (incorrect item sent, damaged/defective product), we will replace the product or reimburse the full invoice value as per customer demand. Refund process (if customer requests for refund) will start only after we receive back the product and validate the return. *Shipping charges are non refundable.*</p>
              <p>Post receipt of the return package, we will proceed to inspect the same. In case a reverse pick-up is not done for any reason(due to any reason owing to customer or the courier company's mistake), responsibility lies on the customer to contact Fika to arrange for the pick-up again. Failure to contact Fika timely to arrange the reverse pick-up again may lead to rejection for exchange/return request. Return requests will only be entertained if the customer has accepted untampered package. If the package is tampered customer should not accept the package and should return the package to the delivery person then and there.</p>
              <p>Once approved as an eligible return, we will issue your refund or store credit (as the case may be) of the appropriate amount within 10 days. If however the return is found not eligible for refund, we will courier the same back to you. In either scenario your return issue will be closed within 7 days of our receiving of the return package from you. Fika will not be liable for any damage that happens during return shipping.</p>
              <p>The customer agrees not to dispute the decision made by Fika and accept decision regarding the return validation that is - if the product is valid to be accepted as return or not. Non-Valid return will be sent back to the customer. For repeated return of products from a customer i.e. more than 50% of the delivered products, the customer will be intimated that future orders on non-cancellation and non-return basis. Afterwards, all future orders will be processed on mentioned conditions.</p>
              <p>Items to be returned must be unused, unworn, unwashed and undamaged. Return items will only be accepted in their original packaging, including: hangers, polyester bags, hang tags on garments, shoe boxes or dust bags. Any items that have been damaged, soiled or altered will not be accepted and will be sent back to the customer. No returns, refunds or exchanges will be accepted for the following items:</p>
              <ul>
                <li>On the products with which it is specifically mentioned that it is not eligible for return/exchange.</li>
                <li>If the product was altered on customers preference and then was sent to him/her.</li>
              </ul>
              <p><b>Refunds are made as follows:</b></p>
              <ol>
                <li>If the payment was made in cash then the refund is made in the form of a bank transfer.</li>
                <li>If the payment is made using a credit/debit card (or any form of net banking) then the amount is credited back to the same account/card from which the payment was made or bank transfer as per the situation.</li>
              </ol>
            </div>
          ) : (
            <div className="modal-policy-content">
              <h2>Shipping Policy</h2>
              <ol>
                <li>Shipping within India for orders above Rs. 2,999/- is free.</li>
                <li>For orders below Rs.2999/-, flat shipping of Rs.150/- is chargeable.</li>
                <li>Once your order is ready and dispatched it is usually delivered within 3-7 days. We partner with reputed courier services, so that your products reach you on time.</li>
                <li>As soon as we ship your product, the tracking information is sent to you via an email or sms.</li>
                <li>Heavily discounted products i.e. above 30% discount, carry a shipping charge of rs. 100/- per order.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 