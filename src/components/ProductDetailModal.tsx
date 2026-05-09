import React, { useState, useMemo } from 'react';
import type { ProductDto } from '../../../mtse-shared/src/types';

interface ProductDetailModalProps {
  product: ProductDto;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || 'https://via.placeholder.com/400?text=No+Image');
  
  // Extract options from variants
  // Assuming attributes in variant looks like {"Size":"M", "Color":"Red"}
  const options = useMemo(() => {
    const opts: Record<string, Set<string>> = {};
    product.variants?.forEach(v => {
      if (v.attributes) {
        Object.entries(v.attributes).forEach(([key, value]) => {
          if (!opts[key]) opts[key] = new Set();
          opts[key].add(String(value));
        });
      }
    });
    
    // Convert sets to arrays
    const result: Record<string, string[]> = {};
    Object.entries(opts).forEach(([key, set]) => {
      result[key] = Array.from(set);
    });
    return result;
  }, [product.variants]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Select first available value for each option
    const defaults: Record<string, string> = {};
    Object.entries(options).forEach(([key, values]) => {
      if (values.length > 0) defaults[key] = values[0];
    });
    return defaults;
  });

  // Find selected variant
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    
    return product.variants.find(v => {
      if (!v.attributes) return false;
      return Object.entries(selectedOptions).every(([key, value]) => v.attributes[key] === value);
    }) || product.variants[0]; // Fallback to first if not found
  }, [product.variants, selectedOptions]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddClick = () => {
    if (selectedVariant) {
      const cartProduct = {
        ...product,
        id: selectedVariant.id, // Use variant ID as product ID in cart
        name: `${product.name} (${selectedVariant.name})`,
        price: Number(selectedVariant.price),
      };
      onAddToCart(cartProduct);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : product.price;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '2rem' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>✕</button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {/* Left: Images */}
          <div>
            <div style={{ width: '100%', paddingTop: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#f9f9f9' }}>
              <img src={selectedImage} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', overflowX: 'auto' }}>
              {product.images?.map((img, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedImage(img)} 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid #ff6b35' : '1px solid #eee'
                  }}
                >
                  <img src={img} alt={`${product.name} ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#ff6b35', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                {product.tenantId?.replace('_', ' ')}
              </div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', fontWeight: 800, color: '#1a1a2e' }}>{product.name}</h2>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff6b35' }}>₹{currentPrice}</span>
                {selectedVariant?.comparePrice && (
                  <span style={{ fontSize: '1rem', color: '#999', textDecoration: 'line-through' }}>₹{Number(selectedVariant.comparePrice)}</span>
                )}
              </div>

              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.description || 'No description available for this premium product.'}
              </p>

              {/* Variant Selectors */}
              {Object.entries(options).map(([optionName, values]) => (
                <div key={optionName} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#333' }}>{optionName}</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {values.map(val => (
                      <button
                        key={val}
                        onClick={() => handleOptionChange(optionName, val)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: selectedOptions[optionName] === val ? '2px solid #ff6b35' : '1px solid #ddd',
                          background: selectedOptions[optionName] === val ? '#fff5f0' : 'white',
                          color: selectedOptions[optionName] === val ? '#ff6b35' : '#333',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddClick}
              style={{
                width: '100%',
                background: '#1a1a2e',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
                marginTop: '1rem'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#ff6b35'}
              onMouseOut={e => e.currentTarget.style.background = '#1a1a2e'}
            >
              Add to Cart - ₹{currentPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
