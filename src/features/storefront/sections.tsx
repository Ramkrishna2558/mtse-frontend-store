import React from 'react';
import type { SectionInstance } from 'mtse-shared/storefront';
import type { StorefrontProduct } from '../../services/storefront.service';
import { type ResolvedTheme, primaryButton, labelCaps } from './theme';

export interface SectionContext {
  theme: ResolvedTheme;
  branding: { name: string; tagline: string; logoUrl: string; bannerUrl: string; accentColor: string };
  products: StorefrontProduct[];
  categories: string[];
  currency: string;
}

const fmt = (currency: string, value: number) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
};

const CONTAINER = 1280;

// ─── Header ─────────────────────────────────────────────────────────────────
const Header: React.FC<{ ctx: SectionContext; props: Record<string, unknown> }> = ({ ctx, props }) => {
  const { theme: t, branding } = ctx;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, background: t.background, borderBottom: `1px solid ${t.outline}` }}>
      <div style={{ maxWidth: CONTAINER, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.name} style={{ height: 28, width: 28, objectFit: 'cover', borderRadius: t.radius }} />
          ) : null}
          <span style={{ fontFamily: t.headingFont, fontSize: '1.25rem', color: t.onBackground }}>{branding.name}</span>
        </div>
        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['Shop', 'Collections', 'About'].map((l) => (
            <a key={l} href="#" style={{ ...labelCaps, color: t.muted, textDecoration: 'none' }}>{l}</a>
          ))}
          {props.showSearch ? <span style={{ color: t.onBackground, cursor: 'pointer' }}>⌕</span> : null}
          {props.showWishlist ? <span style={{ color: t.onBackground, cursor: 'pointer' }}>♡</span> : null}
          <span style={{ color: t.onBackground, cursor: 'pointer' }}>🛍</span>
        </nav>
      </div>
    </header>
  );
};

// ─── Promo banner ─────────────────────────────────────────────────────────────
const PromoBanner: React.FC<{ ctx: SectionContext; props: Record<string, unknown> }> = ({ ctx, props }) => {
  const { theme: t } = ctx;
  return (
    <div style={{ background: t.accent, color: t.onPrimary, textAlign: 'center', padding: '10px 16px', ...labelCaps, fontSize: '0.72rem' }}>
      {String(props.text ?? '')}
      {props.ctaLabel ? <a href={String(props.ctaHref || '#')} style={{ color: t.onPrimary, marginLeft: 12, textDecoration: 'underline' }}>{String(props.ctaLabel)}</a> : null}
    </div>
  );
};

// ─── Hero ──────────────────────────────────────────────────────────────────────
const Hero: React.FC<{ ctx: SectionContext; props: Record<string, unknown> }> = ({ ctx, props }) => {
  const { theme: t } = ctx;
  const image = String(props.image ?? '');
  const onImage = !!image;
  return (
    <section
      style={{
        position: 'relative',
        background: onImage ? `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), url(${image}) center/cover` : t.surface,
        borderBottom: `1px solid ${t.outline}`,
      }}
    >
      <div style={{ maxWidth: CONTAINER, margin: '0 auto', padding: '120px 32px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: t.headingFont, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, margin: '0 0 18px', color: onImage ? '#fff' : t.onBackground }}>
          {String(props.heading ?? '')}
        </h1>
        <p style={{ fontFamily: t.bodyFont, fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 32px', color: onImage ? 'rgba(255,255,255,0.9)' : t.muted }}>
          {String(props.subheading ?? '')}
        </p>
        {props.ctaLabel ? (
          <a href={String(props.ctaHref || '#')} style={{ textDecoration: 'none' }}>
            <button style={primaryButton(t)}>{String(props.ctaLabel)}</button>
          </a>
        ) : null}
      </div>
    </section>
  );
};

// ─── Product card + Featured products ────────────────────────────────────────
const ProductCard: React.FC<{ ctx: SectionContext; product: StorefrontProduct }> = ({ ctx, product }) => {
  const { theme: t, currency } = ctx;
  return (
    <div>
      <div style={{ aspectRatio: '3/4', background: t.surface, border: `1px solid ${t.outline}`, borderRadius: t.radius, overflow: 'hidden', marginBottom: 14 }}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>
      <div style={{ fontFamily: t.bodyFont, fontSize: '0.95rem', color: t.onBackground }}>{product.name}</div>
      <div style={{ ...labelCaps, color: t.muted, marginTop: 4 }}>{fmt(currency, product.price)}</div>
    </div>
  );
};

const FeaturedProducts: React.FC<{ ctx: SectionContext; props: Record<string, unknown> }> = ({ ctx, props }) => {
  const { theme: t, products } = ctx;
  const limit = Number(props.limit ?? 8) || 8;
  const featured = products.filter((p) => p.isFeatured);
  const list = (featured.length ? featured : products).slice(0, limit);
  return (
    <section id="featured" style={{ maxWidth: CONTAINER, margin: '0 auto', padding: '96px 32px' }}>
      <h2 style={{ fontFamily: t.headingFont, fontSize: '2rem', textAlign: 'center', margin: '0 0 48px', color: t.onBackground }}>
        {String(props.heading ?? 'Featured')}
      </h2>
      {list.length === 0 ? (
        <p style={{ textAlign: 'center', color: t.muted }}>No products yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 32 }}>
          {list.map((p) => <ProductCard key={p.id} ctx={ctx} product={p} />)}
        </div>
      )}
    </section>
  );
};

// ─── Category grid ────────────────────────────────────────────────────────────
const CategoryGrid: React.FC<{ ctx: SectionContext; props: Record<string, unknown> }> = ({ ctx, props }) => {
  const { theme: t, categories } = ctx;
  if (categories.length === 0) return null;
  return (
    <section style={{ maxWidth: CONTAINER, margin: '0 auto', padding: '0 32px 96px' }}>
      <h2 style={{ fontFamily: t.headingFont, fontSize: '2rem', textAlign: 'center', margin: '0 0 48px', color: t.onBackground }}>
        {String(props.heading ?? 'Shop by Category')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: 24 }}>
        {categories.map((c) => (
          <div key={c} style={{ height: 180, background: t.surface, border: `1px solid ${t.outline}`, borderRadius: t.radius, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: t.headingFont, fontSize: '1.4rem', color: t.onBackground }}>{c}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Newsletter ───────────────────────────────────────────────────────────────
const Newsletter: React.FC<{ ctx: SectionContext; props: Record<string, unknown> }> = ({ ctx, props }) => {
  const { theme: t } = ctx;
  return (
    <section style={{ background: t.surface, borderTop: `1px solid ${t.outline}` }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '88px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: t.headingFont, fontSize: '2rem', margin: '0 0 10px', color: t.onBackground }}>{String(props.heading ?? '')}</h2>
        <p style={{ fontFamily: t.bodyFont, color: t.muted, margin: '0 0 28px' }}>{String(props.subheading ?? '')}</p>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="you@email.com"
            style={{ flex: '1 1 260px', maxWidth: 320, padding: '13px 16px', background: t.background, border: `1px solid ${t.outline}`, borderRadius: t.buttonRadius, fontFamily: t.bodyFont, color: t.onBackground }}
          />
          <button type="submit" style={primaryButton(t)}>Subscribe</button>
        </form>
      </div>
    </section>
  );
};

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer: React.FC<{ ctx: SectionContext; props: Record<string, unknown> }> = ({ ctx, props }) => {
  const { theme: t, branding } = ctx;
  return (
    <footer style={{ background: t.background, borderTop: `1px solid ${t.outline}` }}>
      <div style={{ maxWidth: CONTAINER, margin: '0 auto', padding: '64px 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40 }}>
        <div>
          <div style={{ fontFamily: t.headingFont, fontSize: '1.3rem', color: t.onBackground, marginBottom: 8 }}>{branding.name}</div>
          <p style={{ fontFamily: t.bodyFont, fontSize: '0.85rem', color: t.muted, maxWidth: 240 }}>{String(props.tagline || branding.tagline || '')}</p>
        </div>
        {[
          { h: 'Shop', links: ['All Products', 'New In', 'Best Sellers'] },
          { h: 'Help', links: ['Shipping', 'Returns', 'Contact'] },
          { h: 'Company', links: ['About', 'Stories', 'Careers'] },
        ].map((col) => (
          <div key={col.h}>
            <div style={{ ...labelCaps, color: t.onBackground, marginBottom: 16 }}>{col.h}</div>
            {col.links.map((l) => (
              <a key={l} href="#" style={{ display: 'block', fontFamily: t.bodyFont, fontSize: '0.85rem', color: t.muted, textDecoration: 'none', marginBottom: 10 }}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: CONTAINER, margin: '0 auto', padding: '20px 32px', borderTop: `1px solid ${t.outline}`, ...labelCaps, fontSize: '0.65rem', color: t.muted, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span>© {new Date().getFullYear()} {branding.name}</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
};

// ─── Renderer ────────────────────────────────────────────────────────────────
export const SectionRenderer: React.FC<{ section: SectionInstance; ctx: SectionContext }> = ({ section, ctx }) => {
  const props = section.props ?? {};
  switch (section.type) {
    case 'header': return <Header ctx={ctx} props={props} />;
    case 'promo-banner': return <PromoBanner ctx={ctx} props={props} />;
    case 'hero': return <Hero ctx={ctx} props={props} />;
    case 'featured-products': return <FeaturedProducts ctx={ctx} props={props} />;
    case 'category-grid': return <CategoryGrid ctx={ctx} props={props} />;
    case 'newsletter': return <Newsletter ctx={ctx} props={props} />;
    case 'footer': return <Footer ctx={ctx} props={props} />;
    default: return null;
  }
};
