/**
 * @typedef {'amazon' | 'flipkart' | 'meesho'} Marketplace
 */

/**
 * Default marketplaces supported by the platform.
 * @type {Marketplace[]}
 */
export const DEFAULT_MARKETPLACES = ['amazon', 'flipkart', 'meesho'];

/**
 * @typedef {Object} SearchFilters
 * @property {Marketplace[]} marketplaces
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {number} [minRating]
 * @property {number} [cogs]
 */

/**
 * @typedef {Object} KeywordRequestPayload
 * @property {'en' | 'hi'} language
 * @property {string} productTitle
 * @property {Marketplace} marketplace
 */

/**
 * @typedef {Object} KeywordSuggestionResponse
 * @property {string} seoTitle
 * @property {string[]} keywords
 * @property {string[]} bullets
 */

