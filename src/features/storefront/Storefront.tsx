import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useConfig } from '../../context/ConfigContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { ProductCard } from '../../components/ProductCard';
import { OrderHistory } from './OrderHistory';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/common/Snackbar';
import type { ProductDto, AddressDto, OrderDto } from '../../../../mtse-shared/src/types';

export const Storefront: React.FC = () => {
  const { platformConfig, allProducts, categories, getStoreInfo, isLoading } = useConfig();
  const { customerEmail, isAuthenticated, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'newest'>('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([Math.max(), 200000]);

  // Cart & Checkout
  const [cart, setCart] = useState<{ product: ProductDto, quantity: number }[]>(() => {
    const saved = localStorage.getItem('mtse_cart');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('mtse_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    flatNo: '',
    floor: '',
    street: '',
    pinCode: '',
    phoneNo: ''
  });

  const handleAddToCart = (product: ProductDto) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    showSnackbar(`${product.name} added to cart!`, 'success');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !customerEmail) {
      showSnackbar("Please log in to checkout.", 'info');
      navigate('/login');
      return;
    }
    if (!checkoutForm.flatNo || !checkoutForm.street || !checkoutForm.pinCode || !checkoutForm.phoneNo) {
      showSnackbar("Please enter all mandatory address details.", 'warning');
      return;
    }

    const shippingAddress: AddressDto = {
      flatNo: checkoutForm.flatNo,
      floor: checkoutForm.floor,
      street: checkoutForm.street,
      pinCode: checkoutForm.pinCode,
      city: 'Mumbai', // Default for demo
      state: 'Maharashtra' // Default for demo
    };

    try {
      // Group orders by store (tenantId)
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
      setCart([]);
      setIsCartOpen(false);
      setCheckoutForm({ flatNo: '', floor: '', street: '', pinCode: '', phoneNo: '' });
      setShowHistory(true); // Show history after placing order
    } catch (err) {
      console.error("Checkout failed", err);
      showSnackbar("Checkout failed. Please try again.", 'error');
    }
  };


  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.reverse(); break;
      default: break;
    }

    return result;
  }, [allProducts, searchTerm, selectedCategory, sortBy, priceRange]);

  // Unique sellers count
  const sellerCount = new Set(allProducts.map(p => p.tenantId)).size;

  if (isLoading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>Loading marketplace...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', color: '#1a1a2e', fontFamily: "'Inter', sans-serif" }}>

      {/* ===== TOP BAR ===== */}
      <div style={{ background: '#1a1a2e', color: 'white', fontSize: '0.75rem', padding: '6px 5%', display: 'flex', justifyContent: 'space-between' }}>
        <span>🚚 Free shipping on orders above ₹500</span>
        <span>📞 24/7 Customer Support</span>
      </div>

      {/* ===== HEADER ===== */}
      <header style={{ background: 'white', padding: '0 5%', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '12px 0' }}>
          {/* Logo */}
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#ff6b35', whiteSpace: 'nowrap' }}>
            {platformConfig.platformName}
          </h1>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products, brands and more..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#ff6b35'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#eee'; }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', opacity: 0.4 }}>🔍</span>
          </div>

          {/* Auth + Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', whiteSpace: 'nowrap' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#999' }}>Welcome</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{customerEmail?.split('@')[0]}</div>
                </div>
                <button onClick={logout} style={{ background: 'none', border: '1px solid #ddd', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e' }}>
                <div style={{ fontSize: '0.7rem', color: '#999' }}>Hello, Sign in</div>
                <div>Account</div>
              </button>
            )}
            <button onClick={() => setIsCartOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', position: 'relative' }}>
              <span style={{ fontSize: '1.3rem' }}>🛒</span>
              <span>Cart</span>
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-10px', background: '#ff6b35', color: 'white', fontSize: '0.65rem', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Nav */}
        <nav style={{ borderTop: '1px solid #f0f0f0', padding: '8px 0', display: 'flex', gap: '0.5rem', overflowX: 'auto', alignItems: 'center' }}>
          <button
            onClick={() => { setSelectedCategory(null); setShowHistory(false); }}
            style={{
              padding: '6px 16px', borderRadius: '20px', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              background: !selectedCategory && !showHistory ? '#1a1a2e' : 'transparent',
              color: !selectedCategory && !showHistory ? 'white' : '#555',
              transition: 'all 0.2s'
            }}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowHistory(false); }}
              style={{
                padding: '6px 16px', borderRadius: '20px', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                background: selectedCategory === cat ? '#1a1a2e' : 'transparent',
                color: selectedCategory === cat ? 'white' : '#555',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => setShowHistory(true)}
              style={{
                padding: '6px 16px', borderRadius: '20px', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                background: showHistory ? '#ff6b35' : 'transparent',
                color: showHistory ? 'white' : '#555',
                transition: 'all 0.2s',
                marginLeft: 'auto'
              }}
            >
              📜 My Orders
            </button>
          )}
        </nav>
      </header>

      {/* ===== HERO BANNER ===== */}
      {!searchTerm && !selectedCategory && (
        <section style={{ margin: '1.5rem 5% 0', borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(135deg, #ff6b35 0%, #ff8a5c 50%, #ffd1b3 100%)', color: 'white', padding: '3rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: 800 }}>Shop from {sellerCount}+ verified sellers</h2>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', opacity: 0.9 }}>Discover unique products across fashion, tech, and home décor — all in one place.</p>
            <button style={{ background: 'white', color: '#ff6b35', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              Explore Now →
            </button>
          </div>
          <div style={{ fontSize: '6rem', opacity: 0.3 }}>🛍️</div>
        </section>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ display: 'flex', padding: '1.5rem 5% 3rem', gap: '2rem' }}>

        {showHistory ? (
          <main style={{ flex: 1 }}>
            <OrderHistory />
          </main>
        ) : (
          <>
            {/* Sidebar Filters */}
            <aside style={{ width: '240px', flexShrink: 0 }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'sticky', top: '130px' }}>
                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 700 }}>Filters</h3>

                {/* Price Range */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Range</label>
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                    style={{ width: '100%', accentColor: '#ff6b35' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                    <span>₹0</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Sort By */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #eee', borderRadius: '6px', fontSize: '0.85rem', background: 'white' }}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <main style={{ flex: 1 }}>
              {/* Results header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  <strong style={{ color: '#1a1a2e' }}>{filteredProducts.length}</strong> products found
                  {selectedCategory && <> in <strong>{selectedCategory}</strong></>}
                  {searchTerm && <> for "<strong>{searchTerm}</strong>"</>}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', color: '#999' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
                  <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters or search term</p>
                  <button onClick={() => { setSearchTerm(''); setSelectedCategory(null); setPriceRange([0, 5000]); }} style={{ marginTop: '1rem', padding: '10px 20px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Clear All Filters
                  </button>
                </div>
              )}
            </main>
          </>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#1a1a2e', color: 'white', padding: '3rem 5% 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ margin: '0 0 1rem', color: '#ff6b35' }}>{platformConfig.platformName}</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: 1.6 }}>{platformConfig.tagline}</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.85rem' }}>Quick Links</h4>
            {['About Us', 'Contact', 'FAQ', 'Shipping Policy'].map(link => (
              <a key={link} href="#" style={{ display: 'block', color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.8rem', marginBottom: '8px' }}>{link}</a>
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.85rem' }}>For Sellers</h4>
            {['Sell on MTSE', 'Seller Dashboard', 'Pricing', 'Seller Support'].map(link => (
              <a key={link} href="#" style={{ display: 'block', color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.8rem', marginBottom: '8px' }}>{link}</a>
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.85rem' }}>Connect</h4>
            {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(link => (
              <a key={link} href="#" style={{ display: 'block', color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '0.8rem', marginBottom: '8px' }}>{link}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.5 }}>
          © 2026 {platformConfig.platformName}. All rights reserved. Config-driven multi-tenant platform.
        </div>
      </footer>

      {/* Cart Modal */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '400px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>Your cart is empty.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                      <img src={item.product.images?.[0] || 'https://via.placeholder.com/60'} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>{item.product.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Store: {item.product.tenantId}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          <span>Qty: {item.quantity}</span>
                          <span>₹{item.product.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #eee', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span>₹{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}</span>
                </div>
                <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                      Flat / House No:
                      <input required value={checkoutForm.flatNo} onChange={e => setCheckoutForm({ ...checkoutForm, flatNo: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                    </label>
                    <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                      Floor (Optional):
                      <input value={checkoutForm.floor} onChange={e => setCheckoutForm({ ...checkoutForm, floor: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                    </label>
                  </div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Street / Area / Colony:
                    <textarea required value={checkoutForm.street} onChange={e => setCheckoutForm({ ...checkoutForm, street: e.target.value })} placeholder="Area, Street, Landmark" style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', minHeight: '60px', boxSizing: 'border-box' }} />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                      PIN Code:
                      <input required type="text" pattern="[0-9]{6}" value={checkoutForm.pinCode} onChange={e => setCheckoutForm({ ...checkoutForm, pinCode: e.target.value })} placeholder="6-digit PIN" style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                    </label>
                    <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                      Mobile Number:
                      <input required type="tel" pattern="[0-9]{10}" value={checkoutForm.phoneNo} onChange={e => setCheckoutForm({ ...checkoutForm, phoneNo: e.target.value })} placeholder="10-digit Mobile" style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
                    </label>
                  </div>
                  <button type="submit" style={{ background: '#ff6b35', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
                    Confirm & Place Order
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
