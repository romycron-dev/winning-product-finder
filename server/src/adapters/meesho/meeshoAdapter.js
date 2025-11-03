import axios from 'axios';
import Bottleneck from 'bottleneck';
import * as cheerio from 'cheerio';

import { logger } from '../../utils/logger.js';

const limiter = new Bottleneck({
  minTime: 5000,
});

const TRENDING_URL = 'https://www.meesho.com/trending';

async function fetchTrending() {
  try {
    const response = await axios.get(TRENDING_URL, {
      headers: {
        'User-Agent': 'WinningProductFinderBot/1.0 (+https://example.com/bot)',
      },
      timeout: 15_000,
    });

    const $ = cheerio.load(response.data);
    const productCards = $('[data-testid="product"]');
    if (!productCards.length) {
      return [];
    }

    const items = [];

    productCards.slice(0, 10).each((_, element) => {
      const anchor = $('a', element).first();
      const title = anchor.attr('title') || anchor.text().trim();
      const priceText = $('[data-testid="product-price"]', element)
        .first()
        .text()
        .replace(/[^0-9.]/g, '');
      const price = Number(priceText);

      if (!title || Number.isNaN(price)) {
        return;
      }

      const imageUrl = $('img', element).attr('src');

      items.push({
        id: anchor.attr('href') ?? `${title}-${price}`,
        marketplace: 'meesho',
        title,
        imageUrl,
        price,
        rating: null,
        reviews: null,
        categoryPath: undefined,
        bestSellerRank: null,
        sellersCount: null,
      });
    });

    return items;
  } catch (error) {
    logger.warn({
      msg: 'Failed to scrape Meesho trending page, returning empty list',
      error: error instanceof Error ? error.message : error,
    });
    return [];
  }
}

export class MeeshoAdapter {
  async searchProducts() {
    return limiter.schedule(fetchTrending);
  }
}

export const meeshoAdapter = new MeeshoAdapter();

