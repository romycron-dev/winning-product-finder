import { healthRoutes } from './health.js';
import { keywordRoutes } from './keywords.js';
import { searchRoutes } from './search.js';

export async function registerRoutes(fastify) {
  await healthRoutes(fastify);
  await searchRoutes(fastify);
  await keywordRoutes(fastify);
}

