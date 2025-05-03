import React from 'react';
import './MyOrders.css';

const dummyOrders = [
  {
    id: 'ORD123456',
    date: '2024-05-03',
    status: 'Paid',
    total: 4299.00,
    items: [
      {
        name: 'Handblocked Botanical Dream Quilted Bedding Set',
        qty: 1,
        price: 4299.00,
        image: 'https://images.unsplash.com/photo-1540638349517-3abd5afc5847?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'ORD123457',
    date: '2024-04-28',
    status: 'Delivered',
    total: 2999.00,
    items: [
      {
        name: 'Minimalist Cushion Set',
        qty: 2,
        price: 1499.50,
        image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
];

const MyOrders = () => {
  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      {dummyOrders.length === 0 ? (
        <div className="no-orders">You have not placed any orders yet.</div>
      ) : (
        <div className="orders-list">
          {dummyOrders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <span><strong>Order ID:</strong> {order.id}</span>
                <span><strong>Date:</strong> {order.date}</span>
                <span><strong>Status:</strong> {order.status}</span>
                <span><strong>Total:</strong> ₹{order.total.toFixed(2)}</span>
              </div>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div className="order-item" key={idx}>
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-qty">Qty: {item.qty}</div>
                      <div className="order-item-price">₹{item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders; 