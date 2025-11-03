import { z } from 'zod';

import { DEFAULT_MARKETPLACES } from '@winning-product-finder/shared';

import { amazonPaapiAdapter } from '../adapters/amazon/amazonPaapi.js';
import { flipkartAdapter } from '../adapters/flipkart/flipkartAdapter.js';
import { meeshoAdapter } from '../adapters/meesho/meeshoAdapter.js';
import { scoreProducts } from '../services/scoring.js';
import { applyFilters, dedupeProducts } from '../utils/products.js';
import { logger } from '../utils/logger.js';

const adapterMap = {
  amazon: amazonPaapiAdapter,
  flipkart: flipkartAdapter,
  meesho: meeshoAdapter,
};

const querySchema = z.object({
  q: z.string().min(2),
  marketplaces: z
    .string()
    .optional()
    .transform((value) => {
      const requested = value
        ? value
            .split(',')
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean)
        : DEFAULT_MARKETPLACES;
      return requested.filter((marketplace) => marketplace in adapterMap);
    })
    .pipe(z.array(z.enum(['amazon', 'flipkart', 'meesho'])).min(1)),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  cogs: z.coerce.number().optional(),
});

async function safeInvoke(adapter, query, timeoutMs = 12_000) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve([]), timeoutMs);
    adapter
      .searchProducts(query)
      .then((products) => {
        clearTimeout(timeout);
        resolve(products);
      })
      .catch((error) => {
        clearTimeout(timeout);
        logger.error({
          msg: 'Adapter search failed',
          error: error instanceof Error ? error.message : error,
        });
        resolve([]);
      });
  });
}

export async function searchRoutes(fastify) {
  fastify.get('/api/search', async (request, reply) => {
    const parsed = querySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid search parameters',
        details: parsed.error.flatten(),
      });
    }

    const { q, marketplaces, minPrice, maxPrice, minRating, cogs } =
      parsed.data;

    const adapterPromises = marketplaces.map((marketplace) =>
      safeInvoke(adapterMap[marketplace], q),
    );

    const results = (await Promise.all(adapterPromises)).flat();
    const filtered = applyFilters(results, { minPrice, maxPrice, minRating });
    const deduped = dedupeProducts(filtered);
    const scored = scoreProducts(deduped, { cogs });

    const sorted = scored
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 50);

    try {
      const user = await fastify.prisma.user.upsert({
        where: { email: 'demo@winningproductfinder.com' },
        update: {},
        create: { email: 'demo@winningproductfinder.com' },
      });

      const search = await fastify.prisma.searchQuery.create({
        data: {
          userId: user.id,
          query: q,
          filtersJSON: { marketplaces, minPrice, maxPrice, minRating, cogs },
        },
      });

      if (sorted.length) {
        await fastify.prisma.productResult.createMany({
          data: sorted.map((product) => ({
            searchId: search.id,
            marketplace: product.marketplace,
            externalId: product.id,
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            rating: product.rating ?? null,
            reviews: product.reviews ?? null,
            categoryPathJSON: product.categoryPath ?? null,
            bsr: product.bestSellerRank ?? null,
            sellersCount: product.sellersCount ?? null,
            scoresJSON: {
              demandScore: product.demandScore,
              competitionScore: product.competitionScore,
              profitEstimate: product.profitEstimate,
              profitMarginPct: product.profitMarginPct,
              opportunityScore: product.opportunityScore,
            },
          })),
        });
      }
    } catch (error) {
      logger.error({
        msg: 'Failed to persist search results',
        error: error instanceof Error ? error.message : error,
      });
    }

    return {
      query: q,
      results: sorted,
    };
  });

  fastify.get('/api/saved', async () => {
    const searches = await fastify.prisma.searchQuery.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return searches.map((search) => ({
      id: search.id,
      query: search.query,
      createdAt: search.createdAt,
      filters: search.filtersJSON,
    }));
  });
}

