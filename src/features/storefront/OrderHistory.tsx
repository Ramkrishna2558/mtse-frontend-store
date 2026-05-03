import React, { useState, useEffect } from 'react';
import { axiosClient as axios } from '../../lib/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import type { OrderDto } from '../../../../mtse-shared/src/types';

export const OrderHistory: React.FC = () => {
  const { customerEmail, isAuthenticated } = useCustomerAuth();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && customerEmail) {
      axios.get<OrderDto[]>(`/orders?customerEmail=${customerEmail}`)
        .then(res => {
          const data = res.data;
          const items = Array.isArray(data) ? data : data.items || [];
          // Sort by date descending
          const sorted = [...items].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sorted);
        })
        .catch(err => console.error("Failed to fetch orders", err))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, customerEmail]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fff7e6', text: '#d46b08', border: '#ffd591' };
      case 'packing': return { bg: '#e6f7ff', text: '#1890ff', border: '#91d5ff' };
      case 'packed': return { bg: '#f9f0ff', text: '#722ed1', border: '#d3adf7' };
      case 'shipped': return { bg: '#e6fffb', text: '#13c2c2', border: '#87e8de' };
      case 'delivered': return { bg: '#f6ffed', text: '#52c41a', border: '#b7eb8f' };
      case 'cancelled': return { bg: '#fff1f0', text: '#f5222d', border: '#ffa39e' };
      default: return { bg: '#f5f5f5', text: '#8c8c8c', border: '#d9d9d9' };
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>📦</span> My Order History
      </h2>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h3 style={{ margin: '0 0 10px 0' }}>No orders found</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>You haven't placed any orders yet. Start shopping!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => {
            const statusStyle = getStatusColor(order.status);
            return (
              <div key={order.id} style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}>ORDER ID</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{order.id.split('_')[1] || order.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px', textAlign: 'right' }}>DATE</div>
                    <div style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.border}`,
                      textTransform: 'uppercase'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: '300px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '10px' }}>ITEMS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span style={{ color: '#555' }}>{item.productName || 'Product'} x {item.quantity}</span>
                          <span style={{ fontWeight: 600 }}>₹{item.total || (item.unitPrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                      <span>Total Amount</span>
                      <span style={{ color: '#ff6b35' }}>₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '200px', borderLeft: '1px solid #f0f0f0', paddingLeft: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '10px' }}>SHIPPING TO</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6 }}>
                      {order.shippingAddress ? (
                        <>
                          {order.shippingAddress.flatNo}, {order.shippingAddress.floor && `${order.shippingAddress.floor} Floor, `}
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                          <strong>PIN: {order.shippingAddress.pinCode}</strong><br />
                          Ph: {order.phone}
                        </>
                      ) : (
                        <span>Address details unavailable</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
