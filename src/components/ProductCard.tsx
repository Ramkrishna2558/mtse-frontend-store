import React from 'react';
import type { ProductDto } from '../../../mtse-shared/src/types';

interface ProductCardProps {
  product: ProductDto;
  onAddToCart: (product: ProductDto) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card" style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid #f0f0f0'
    }}>
      {/* Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', background: '#f9f9f9' }}>
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300?text=No+Image'} 
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255,255,255,0.9)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#666',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.75rem', color: '#ff6b35', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
          {product.tenantId.replace('_', ' ')}
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <p style={{ 
          margin: '0 0 1.25rem 0', 
          fontSize: '0.85rem', 
          color: '#666', 
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {product.description || 'No description available for this premium product.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'line-through' }}>
              ₹{Math.round(product.price * 1.2)}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a1a2e' }}>
              ₹{product.price}
            </span>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            style={{
              background: '#1a1a2e',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#ff6b35'}
            onMouseOut={e => e.currentTarget.style.background = '#1a1a2e'}
          >
            <span>Add</span>
            <span style={{ fontSize: '1rem' }}>+</span>
          </button>
        </div>
      </div>
    </div>
  );
};