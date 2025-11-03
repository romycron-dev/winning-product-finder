import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { registerRoutes } from './routes/index.js';
import prismaPlugin from './plugins/prisma.js';
import { logger } from './utils/logger.js';

async function buildServer() {
  const fastify = Fastify({
    logger,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
    hook: 'onSend',
  });

  await fastify.register(prismaPlugin);
  await registerRoutes(fastify);

  fastify.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error, url: request.url, method: request.method });
    reply
      .status(error.statusCode ?? 500)
      .send({ error: 'Internal Server Error' });
  });

  return fastify;
}

async function start() {
  const fastify = await buildServer();
  await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
}

const isDirectRun =
  process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  start().catch((error) => {
    logger.error({ err: error }, 'Server failed to start');
    process.exit(1);
  });
}

export { buildServer };

