import { estimateNetRevenue } from '../config/fees.js';

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate marketplace opportunity scores for a list of products.
 *
 * @param {Array<import('../adapters/types.js').NormalizedProduct>} products
 * @param {{ cogs?: number }} options
 */
export function scoreProducts(products, { cogs } = {}) {
  return products.map((product) => {
    const reviewScore = product.reviews
      ? Math.min(product.reviews / 500, 1)
      : 0.3;
    const ratingScore = product.rating ? product.rating / 5 : 0.5;
    const demandScore = clamp((reviewScore * 70 + ratingScore * 30) * 100);

    const sellerPenalty = product.sellersCount
      ? Math.min(product.sellersCount / 10, 1)
      : 0.4;
    const bsrFactor = product.bestSellerRank
      ? Math.max(1 - product.bestSellerRank / 1000, 0)
      : 0.5;
    const competitionScore = clamp(
      (sellerPenalty * 60 + (1 - bsrFactor) * 40) * 100,
    );

    const netRevenue = estimateNetRevenue(product.price, product.marketplace);
    const profitEstimate = Math.max(netRevenue - (cogs ?? netRevenue * 0.4), 0);
    const profitMarginPct =
      product.price > 0 ? clamp((profitEstimate / product.price) * 100) : 0;

    const opportunityScore = clamp(
      0.45 * demandScore +
        0.35 * (100 - competitionScore) +
        0.2 * profitMarginPct,
    );

    return {
      ...product,
      demandScore,
      competitionScore,
      profitEstimate,
      profitMarginPct,
      opportunityScore,
    };
  });
}

