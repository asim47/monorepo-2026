import { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

export async function setupSecurity(app: FastifyInstance): Promise<void> {
  await app.register(helmet);
}
