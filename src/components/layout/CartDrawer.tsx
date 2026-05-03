import React, { useState } from 'react';
import axios from 'axios';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useSnackbar } from '../../components/common/Snackbar';
import { useStore } from '../../stores/useStore';
import { useNavigate } from 'react-router-dom';
import type { AddressDto } from '../../../../mtse-shared/src/types';

export function CartDrawer() {
  const { customerEmail, isAuthenticated } = useCustomerAuth();
  const { showSnackbar } = useSnackbar();
  const { cart, clearCart, isCartOpen, setIsCartOpen, setShowHistory } = useStore();
  const navigate = useNavigate();

  const [checkoutForm, setCheckoutForm] = useState({
    flatNo: '',
    floor: '',
    street: '',
    pinCode: '',
    phoneNo: ''
  });

  if (!isCartOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !customerEmail) {
      showSnackbar("Please log in to checkout.", 'info');
      navigate('/login');
      setIsCartOpen(false);
      return;
    }

    const shippingAddress: AddressDto = {
      flatNo: checkoutForm.flatNo,
      floor: checkoutForm.floor,
      street: checkoutForm.street,
      pinCode: checkoutForm.pinCode,
      city: 'Mumbai',
      state: 'Maharashtra'
    };

    try {
      const ordersByTenant: Record<string, any> = {};
      cart.forEach(item => {
        const tId = item.product.tenantId;
        if (!ordersByTenant[tId]) {
          ordersByTenant[tId] = {
            id: `ord_${Date.now()}_${tId}`,
            tenantId: tId,
            customerEmail,
            shippingAddress,
            phone: checkoutForm.phoneNo,
            items: [],
            totalAmount: 0,
            currency: 'INR',
            status: 'pending',
            createdAt: new Date().toISOString()
          };
        }
        ordersByTenant[tId].items.push({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images?.[0],
          quantity: item.quantity,
          unitPrice: item.product.price,
          total: item.product.price * item.quantity
        });
        ordersByTenant[tId].totalAmount += item.product.price * item.quantity;
      });

      for (const tenantId in ordersByTenant) {
        await axios.post('http://localhost:3000/orders', ordersByTenant[tenantId]);
      }

      showSnackbar("Order placed successfully! 🎉", 'success');
      clearCart();
      setIsCartOpen(false);
      setCheckoutForm({ flatNo: '', floor: '', street: '', pinCode: '', phoneNo: '' });
      setShowHistory(true);
      navigate('/');
    } catch (err) {
      console.error("Checkout failed", err);
      showSnackbar("Checkout failed. Please try again.", 'error');
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-black shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center">
          <h2 className="font-serif text-2xl font-light tracking-tight">Your Bag</h2>
          <button onClick={() => setIsCartOpen(false)} className="material-symbols-outlined hover:rotate-90 transition-transform">close</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
              <span className="material-symbols-outlined text-6xl">shopping_bag</span>
              <p className="text-sm uppercase tracking-widest">Your bag is empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b border-gray-50 dark:border-gray-900 pb-4">
                <img src={item.product.images?.[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-20 h-24 object-cover grayscale hover:grayscale-0 transition-all" />
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-medium">{item.product.name}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.product.tenantId}</p>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                    <span className="text-sm font-semibold">₹{item.product.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 space-y-4">
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm uppercase tracking-widest text-gray-500">Total</span>
              <span className="text-xl font-bold">₹{totalAmount}</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Flat / House No" value={checkoutForm.flatNo} onChange={e => setCheckoutForm({ ...checkoutForm, flatNo: e.target.value })} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                <input placeholder="Floor (Opt)" value={checkoutForm.floor} onChange={e => setCheckoutForm({ ...checkoutForm, floor: e.target.value })} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
              </div>
              <textarea required placeholder="Street / Area / Colony" value={checkoutForm.street} onChange={e => setCheckoutForm({ ...checkoutForm, street: e.target.value })} className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs h-20 resize-none focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
              <div className="grid grid-cols-2 gap-2">
                <input required pattern="[0-9]{6}" placeholder="PIN Code" value={checkoutForm.pinCode} onChange={e => setCheckoutForm({ ...checkoutForm, pinCode: e.target.value })} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                <input required pattern="[0-9]{10}" placeholder="Mobile No" value={checkoutForm.phoneNo} onChange={e => setCheckoutForm({ ...checkoutForm, phoneNo: e.target.value })} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-2 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
              </div>
              <button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black py-3 text-xs uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity">
                Place Order
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
