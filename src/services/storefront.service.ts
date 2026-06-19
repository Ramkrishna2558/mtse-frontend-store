import { axiosClient } from '../lib/api';
import { mergeStorefrontConfig, type StorefrontConfig } from 'mtse-shared/storefront';

/** Flattened product shape the themed storefront renders. */
export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
}

export interface StorefrontData {
  tenantId: string;
  slug: string;
  currency: string;
  config: StorefrontConfig;
  products: StorefrontProduct[];
}

interface RawImage { url: string; isPrimary?: boolean }
interface RawVariant { price?: number | string }
interface RawProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isFeatured?: boolean;
  price?: number | string;
  category?: string | { name?: string } | null;
  variants?: RawVariant[];
  images?: RawImage[];
}

function mapProduct(p: RawProduct): StorefrontProduct {
  const variantPrice = p.variants?.[0]?.price;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    price: Number(variantPrice ?? p.price ?? 0),
    image: p.images?.find((i) => i.isPrimary)?.url ?? p.images?.[0]?.url ?? '',
    category: typeof p.category === 'object' && p.category ? (p.category.name ?? '') : (p.category ?? ''),
    isFeatured: !!p.isFeatured,
  };
}

/**
 * Loads everything the themed storefront needs for a tenant slug:
 * the tenant record (whose `settings.storefront` holds the config) and its
 * active products — all from the real backend.
 */
export async function fetchStorefront(slug: string): Promise<StorefrontData> {
  const { data: tenant } = await axiosClient.get(`/tenants/slug/${slug}`);

  const config = mergeStorefrontConfig(tenant?.settings?.storefront);
  // Keep branding name in sync with the tenant record if the config is bare.
  config.branding.name = config.branding.name || tenant?.name || slug;

  const { data: productsRes } = await axiosClient.get('/products', {
    params: { tenantId: tenant.id, limit: 100 },
  });
  const items: RawProduct[] = Array.isArray(productsRes) ? productsRes : productsRes?.items ?? [];

  return {
    tenantId: tenant.id,
    slug: tenant.slug,
    currency: tenant.currency ?? 'INR',
    config,
    products: items.map(mapProduct),
  };
}
