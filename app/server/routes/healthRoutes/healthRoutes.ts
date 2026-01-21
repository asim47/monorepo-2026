import { FastifyInstance } from 'fastify';
import { getHealth } from './controllers/healthController';
import { RouteContext } from '../../types/routeContext';
import { z } from 'zod';
import { createFastifySchema, withOpenApiMetadata } from '../../utils/swaggerSchemas';

const healthResponseSchema = z.object({
  status: z.string(),
});

function healthRoutes(app: FastifyInstance, _ctx: RouteContext) {
  app.get(
    '/health',
    {
      schema: withOpenApiMetadata(
        createFastifySchema({
          response: {
            200: healthResponseSchema,
          },
        }),
        {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Check if the service is running',
        },
      ),
    },
    getHealth,
  );

  return app;
}

export default healthRoutes;
