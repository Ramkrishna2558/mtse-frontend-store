import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { createDefaultStorefrontConfig } from 'mtse-shared/storefront';
import type { StorefrontData } from '../../services/storefront.service';

// Mock the data service so the test never hits the network.
const sampleData = (): StorefrontData => {
  const config = createDefaultStorefrontConfig('soft-mono', { name: 'Ammajan' });
  const hero = config.sections.find((s) => s.type === 'hero');
  if (hero) hero.props = { ...hero.props, heading: 'Made by hand', subheading: 'Calm goods', ctaLabel: 'Shop', ctaHref: '#featured' };
  return {
    tenantId: 't1',
    slug: 'ammajan',
    currency: 'INR',
    config,
    products: [
      { id: 'p1', name: 'Handwoven Throw', slug: 'throw', description: '', price: 1899, image: '', category: 'Home & Living', isFeatured: true },
      { id: 'p2', name: 'Ceramic Vase', slug: 'vase', description: '', price: 1299, image: '', category: 'Home & Living', isFeatured: true },
    ],
  };
};

vi.mock('../../services/storefront.service', () => ({
  fetchStorefront: vi.fn(() => Promise.resolve(sampleData())),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/store/:slug" element={<ThemedStorefrontLazy />} />
      </Routes>
    </MemoryRouter>,
  );
}

// Imported after the mock is registered.
import { ThemedStorefront as ThemedStorefrontLazy } from './ThemedStorefront';

describe('ThemedStorefront', () => {
  it('renders the configured sections for a store', async () => {
    renderAt('/store/ammajan');

    // Branding (header + footer) renders the store name.
    await waitFor(() => expect(screen.getAllByText('Ammajan').length).toBeGreaterThan(0));

    // Hero content from the config.
    expect(screen.getByText('Made by hand')).toBeInTheDocument();

    // Featured products from the catalogue + their formatted price.
    expect(screen.getByText('Handwoven Throw')).toBeInTheDocument();
    expect(screen.getByText('Ceramic Vase')).toBeInTheDocument();
    expect(screen.getByText(/1,899/)).toBeInTheDocument();

    // Category grid derives categories from products.
    expect(screen.getAllByText('Home & Living').length).toBeGreaterThan(0);
  });
});
