import { FastifyInstance } from 'fastify';
import { getUsers } from './controllers/getUsers';
import { createUser } from './controllers/createUser';
import { RouteContext } from '../../types/routeContext';
import {
  createUserSchema,
  usersResponseSchema,
  createUserResponseSchema,
} from '../../schemas/userSchemas';
import { createFastifySchema, withOpenApiMetadata } from '../../utils/swaggerSchemas';
import { isAuthenticated } from '../../middleware/isAuthenticated';

function userRoutes(app: FastifyInstance, _ctx: RouteContext) {
  // GET /api/users (protected)
  app.get(
    '/api/users',
    {
      preHandler: [isAuthenticated],
      schema: withOpenApiMetadata(
        createFastifySchema({
          response: {
            200: usersResponseSchema,
          },
        }),
        {
          tags: ['Users'],
          summary: 'Get all users',
          description: 'Retrieve a list of all users (requires authentication)',
          security: [{ bearerAuth: [] }],
        },
      ),
    },
    getUsers,
  );

  // POST /api/users (protected)
  app.post(
    '/api/users',
    {
      preHandler: [isAuthenticated],
      schema: withOpenApiMetadata(
        createFastifySchema({
          body: createUserSchema,
          response: {
            201: createUserResponseSchema,
          },
        }),
        {
          tags: ['Users'],
          summary: 'Create a new user',
          description: 'Create a new user with name, email, and password (requires authentication)',
          security: [{ bearerAuth: [] }],
        },
      ),
    },
    createUser,
  );

  return app;
}

export default userRoutes;
