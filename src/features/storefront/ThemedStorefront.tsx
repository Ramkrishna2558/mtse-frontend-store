import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStorefront, type StorefrontData } from '../../services/storefront.service';
import { resolveTheme } from './theme';
import { SectionRenderer, type SectionContext } from './sections';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif:wght@400;600;700&display=swap';

function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONTS_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
  }, []);
}

export const ThemedStorefront: React.FC = () => {
  const { slug = '' } = useParams();
  // Remount per slug so each store loads from a clean `loading` state without
  // synchronously resetting state inside an effect.
  return <StorefrontView key={slug} slug={slug} />;
};

const StorefrontView: React.FC<{ slug: string }> = ({ slug }) => {
  useGoogleFonts();

  const [data, setData] = useState<StorefrontData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    fetchStorefront(slug)
      .then((d) => {
        if (!active) return;
        setData(d);
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Failed to load storefront', err);
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const ctx: SectionContext | null = useMemo(() => {
    if (!data) return null;
    const theme = resolveTheme(data.config.templateId, data.config.branding.accentColor);
    const categories = [...new Set(data.products.map((p) => p.category).filter(Boolean))];
    return {
      theme,
      branding: data.config.branding,
      products: data.products,
      categories,
      currency: data.currency,
    };
  }, [data]);

  if (status === 'loading') {
    return <Centered>Loading store…</Centered>;
  }

  if (status === 'error' || !data || !ctx) {
    return (
      <Centered>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛒</div>
        <h1 style={{ margin: 0, fontWeight: 700 }}>Store not found</h1>
        <p style={{ color: '#777' }}>We couldn't find a store at “/store/{slug}”.</p>
      </Centered>
    );
  }

  const { theme } = ctx;

  return (
    <div style={{ background: theme.background, color: theme.onBackground, fontFamily: theme.bodyFont, minHeight: '100vh' }}>
      {data.config.sections
        .filter((s) => s.enabled)
        .map((section) => (
          <SectionRenderer key={section.type} section={section} ctx={ctx} />
        ))}
    </div>
  );
};

const Centered: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", textAlign: 'center', padding: 24 }}>
    {children}
  </div>
);
