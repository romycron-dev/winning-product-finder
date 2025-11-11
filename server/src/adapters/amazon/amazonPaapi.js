import axios from 'axios';
import Bottleneck from 'bottleneck';
import aws4 from 'aws4';

import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

const limiter = new Bottleneck({
  minTime: 1000,
});

const endpoint = '/paapi5/searchitems';

async function signedRequest(payload) {
  if (
    !env.AMAZON_PAAPI_ACCESS_KEY ||
    !env.AMAZON_PAAPI_SECRET_KEY ||
    !env.AMAZON_PAAPI_PARTNER_TAG
  ) {
    logger.warn('Amazon PA-API credentials missing, skipping request');
    return null;
  }

  const body = JSON.stringify(payload);
  const request = {
    host: env.AMAZON_PAAPI_HOST,
    path: endpoint,
    service: 'ProductAdvertisingAPI',
    region: env.AMAZON_PAAPI_REGION,
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Content-Encoding': 'amz-1.0',
      'X-Amz-Target':
        'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
    },
  };

  const signed = aws4.sign(request, {
    accessKeyId: env.AMAZON_PAAPI_ACCESS_KEY,
    secretAccessKey: env.AMAZON_PAAPI_SECRET_KEY,
  });

  return axios.post(`https://${env.AMAZON_PAAPI_HOST}${endpoint}`, body, {
    headers: signed.headers,
    timeout: 10_000,
  });
}

function normalizeItems(items) {
  return items
    .map((item) => {
      const offers = item.Offers?.Listings?.[0];
      const price =
        offers?.Price?.Amount ?? item.ItemInfo?.ProductInfo?.Price?.Amount;
      if (!price) {
        return null;
      }

      return {
        id: item.ASIN ?? `${item.DetailPageURL}`,
        marketplace: 'amazon',
        title:
          item.ItemInfo?.Title?.DisplayValue ??
          item.DetailPageURL ??
          'Unknown Amazon Product',
        imageUrl: item.Images?.Primary?.Large?.URL,
        price,
        rating: item.ItemInfo?.CustomerReviews?.StarRating ?? null,
        reviews: item.ItemInfo?.CustomerReviews?.TotalReviewCount ?? null,
        categoryPath: item.BrowseNodeInfo?.BrowseNodes?.map(
          (node) => node.DisplayName,
        ).filter(Boolean),
        bestSellerRank:
          item.BrowseNodeInfo?.BrowseNodes?.[0]?.SalesRank ?? null,
        sellersCount: offers?.MerchantInfo?.Name ? 1 : null,
      };
    })
    .filter((item) => item !== null);
}

export class AmazonPaapiAdapter {
  async searchProducts(query) {
    return limiter.schedule(async () => {
      try {
        const payload = {
          Keywords: query,
          SearchIndex: 'All',
          ItemCount: 10,
          PartnerTag: env.AMAZON_PAAPI_PARTNER_TAG,
          PartnerType: 'Associates',
          Resources: [
            'BrowseNodeInfo.BrowseNodes',
            'BrowseNodeInfo.BrowseNodes.SalesRank',
            'Images.Primary.Large',
            'ItemInfo.Title',
            'ItemInfo.Features',
            'Offers.Listings.Price',
            'ItemInfo.ProductInfo',
            'ItemInfo.CustomerReviews',
          ],
        };

        const response = await signedRequest(payload);
        if (!response) {
          return [];
        }

        const items = response.data?.SearchResult?.Items ?? [];
        return normalizeItems(items);
      } catch (error) {
        logger.error({
          msg: 'Amazon PA-API search failed',
          error: error instanceof Error ? error.message : error,
        });
        return [];
      }
    });
  }
}

export const amazonPaapiAdapter = new AmazonPaapiAdapter();

