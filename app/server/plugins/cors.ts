import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

export async function setupCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
  });
}
