/**
 * Simplified marketplace fee table used for profit estimations.
 */
export const feeTables = {
  amazon: {
    referralFeePct: 0.15,
    closingFee: 20,
    shippingEstimate: 45,
  },
  flipkart: {
    referralFeePct: 0.13,
    closingFee: 18,
    shippingEstimate: 40,
  },
  meesho: {
    referralFeePct: 0.12,
    closingFee: 15,
    shippingEstimate: 35,
  },
};

/**
 * Estimate the seller's net revenue after marketplace fees.
 *
 * @param {number} price
 * @param {'amazon' | 'flipkart' | 'meesho'} marketplace
 */
export function estimateNetRevenue(price, marketplace) {
  const table = feeTables[marketplace];
  const referralFee = price * table.referralFeePct;
  return price - referralFee - table.closingFee - table.shippingEstimate;
}

