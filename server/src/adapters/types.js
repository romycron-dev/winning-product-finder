/**
 * @typedef {Object} NormalizedProduct
 * @property {string} id
 * @property {'amazon' | 'flipkart' | 'meesho'} marketplace
 * @property {string} title
 * @property {string} [imageUrl]
 * @property {number} price
 * @property {number|null} [rating]
 * @property {number|null} [reviews]
 * @property {string[]} [categoryPath]
 * @property {number|null} [bestSellerRank]
 * @property {number|null} [sellersCount]
 */

/**
 * @typedef {Object} MarketplaceAdapter
 * @property {(query: string) => Promise<NormalizedProduct[]>} searchProducts
 */

export {};
