import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { env } from '../utils/env';

export async function setupRateLimit(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: env.NODE_ENV === 'production' ? 100 : 1000,
    timeWindow: '15 minutes',
  });
}
