import { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';

export async function setupMultipart(app: FastifyInstance): Promise<void> {
  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB
    },
  });
}
