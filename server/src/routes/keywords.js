import { z } from 'zod';

import { openaiClient } from '../services/openaiClient.js';
import { logger } from '../utils/logger.js';

const bodySchema = z.object({
  productTitle: z.string().min(2),
  marketplace: z.enum(['amazon', 'flipkart', 'meesho']),
  language: z.enum(['en', 'hi']).default('en'),
  price: z.number().optional(),
  rating: z.number().optional(),
});

export async function keywordRoutes(fastify) {
  fastify.post('/api/keywords', async (request, reply) => {
    const parsed = bodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { productTitle, marketplace, language, price, rating } = parsed.data;

    try {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content:
              'You are an e-commerce SEO assistant generating keyword-rich content for Indian marketplaces. Respond in valid JSON.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              productTitle,
              marketplace,
              language,
              price,
              rating,
            }),
          },
        ],
        response_format: { type: 'json_object' },
      });

      const rawContent = completion.choices[0]?.message?.content;
      if (!rawContent) {
        throw new Error('Empty OpenAI response');
      }

      const parsedContent = JSON.parse(rawContent);

      return {
        seoTitle: parsedContent.seoTitle,
        keywords: parsedContent.keywords,
        bullets: parsedContent.bullets,
      };
    } catch (error) {
      logger.error({
        msg: 'Failed to generate keywords',
        error: error instanceof Error ? error.message : error,
      });
      return reply.status(500).send({ error: 'Keyword generation failed' });
    }
  });
}

