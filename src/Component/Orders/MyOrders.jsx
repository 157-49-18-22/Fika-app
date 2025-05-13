import React, { useEffect, useState } from 'react';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div>
              <b>Order ID:</b> {order.id} &nbsp;
              <b>Date:</b> {order.date} &nbsp;
              <b>Status:</b> {order.status} &nbsp;
              <b>Total:</b> ₹{order.total.toFixed(2)}
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                <div>
                  <div>{item.name}</div>
                  <div>Qty: {item.qty}</div>
                  <div>₹{item.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders; 