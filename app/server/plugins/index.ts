import { FastifyInstance } from 'fastify';
import { setupCors } from './cors';
import { setupSecurity } from './security';
import { setupRateLimit } from './rateLimit';
import { setupSwagger } from './swagger';
import { setupMultipart } from './multipart';

export async function setupPlugins(app: FastifyInstance): Promise<void> {
  // Swagger (should be registered early)
  await setupSwagger(app);

  // Security
  await setupSecurity(app);

  // CORS
  await setupCors(app);

  // Rate limiting
  await setupRateLimit(app);

  // Multipart (file upload)
  await setupMultipart(app);
}
