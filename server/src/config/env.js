import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  OPENAI_API_KEY: z.string().min(1),
  AMAZON_PAAPI_ACCESS_KEY: z.string().optional(),
  AMAZON_PAAPI_SECRET_KEY: z.string().optional(),
  AMAZON_PAAPI_PARTNER_TAG: z.string().optional(),
  AMAZON_PAAPI_HOST: z.string().default('webservices.amazon.in'),
  AMAZON_PAAPI_REGION: z.string().default('eu-west-1'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment configuration',
    parsed.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;

