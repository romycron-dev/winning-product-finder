/**
 * Remove near-duplicate products by marketplace, normalized title, and rounded price.
 * @param {Array<import('../adapters/types.js').NormalizedProduct>} products
 */
export function dedupeProducts(products) {
  const seen = new Map();

  for (const product of products) {
    const key = `${product.marketplace}:${normalizeKey(product.title)}:${Math.round(product.price)}`;
    if (!seen.has(key)) {
      seen.set(key, product);
    }
  }

  return Array.from(seen.values());
}

function normalizeKey(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Apply numeric filters to product results.
 * @param {Array<import('../adapters/types.js').NormalizedProduct>} products
 * @param {{minPrice?: number, maxPrice?: number, minRating?: number}} filters
 */
export function applyFilters(products, filters) {
  return products.filter((product) => {
    if (filters.minPrice != null && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice != null && product.price > filters.maxPrice) {
      return false;
    }
    if (
      filters.minRating != null &&
      (product.rating ?? 0) < filters.minRating
    ) {
      return false;
    }
    return true;
  });
}

