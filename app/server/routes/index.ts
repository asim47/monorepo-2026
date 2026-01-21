import { FastifyInstance } from 'fastify';
import userRoutes from './userRoutes/userRoutes';
import healthRoutes from './healthRoutes/healthRoutes';
import authRoutes from './authRoutes/authRoutes';
import { RouteContext } from '../types/routeContext';

export async function setupRoutes(app: FastifyInstance): Promise<void> {
  // Root route
  app.get('/', async (request, reply) => {
    return reply.send({
      message: 'Welcome to the API!',
      timestamp: new Date().toISOString(),
    });
  });

  // Route context (can be extended with services, database, etc.)
  const ctx: RouteContext = {};

  // API Routes (this will register schemas)
  healthRoutes(app, ctx);
  authRoutes(app, ctx);
  userRoutes(app, ctx);
}
