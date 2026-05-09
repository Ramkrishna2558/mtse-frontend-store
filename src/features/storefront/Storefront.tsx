import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useConfig } from '../../context/ConfigContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { ProductCard } from '../../components/ProductCard';
import { OrderHistory } from './OrderHistory';
import { ProductDetailModal } from '../../components/ProductDetailModal';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/common/Snackbar';
import { useStore } from '../../stores/useStore';
import type { ProductDto, AddressDto, OrderDto } from '../../../../mtse-shared/src/types';

export const Storefront: React.FC = () => {
  const { platformConfig, allProducts, categories, isLoading } = useConfig();
  const { customerEmail, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // Use global store
  const {
    searchTerm,
    selectedCategory,
    setSelectedCategory,
    cart,
    addToCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    showHistory,
    setShowHistory
  } = useStore();

  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'newest'>('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductDto | null>(null);

  const [checkoutForm, setCheckoutForm] = useState({
    flatNo: '',
    floor: '',
    street: '',
    pinCode: '',
    phoneNo: ''
  });

  const handleAddToCart = (product: ProductDto) => {
    addToCart(product);
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
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onAddToCart={handleAddToCart} 
                    onViewDetails={(prod) => setSelectedProductForModal(prod)} 
                  />
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

      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          isOpen={true}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};
