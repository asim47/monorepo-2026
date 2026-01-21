import { FastifyInstance } from 'fastify';
import { signup } from './controllers/signup';
import { login } from './controllers/login';
import { RouteContext } from '../../types/routeContext';
import { signupSchema, loginSchema, authResponseSchema } from '../../schemas/authSchemas';
import { createFastifySchema, withOpenApiMetadata } from '../../utils/swaggerSchemas';

function authRoutes(app: FastifyInstance, _ctx: RouteContext) {
  // POST /api/auth/signup
  app.post(
    '/api/auth/signup',
    {
      schema: withOpenApiMetadata(
        createFastifySchema({
          body: signupSchema,
          response: {
            201: authResponseSchema,
          },
        }),
        {
          tags: ['Authentication'],
          summary: 'Sign up',
          description: 'Create a new user account',
        },
      ),
    },
    signup,
  );

  // POST /api/auth/login
  app.post(
    '/api/auth/login',
    {
      schema: withOpenApiMetadata(
        createFastifySchema({
          body: loginSchema,
          response: {
            200: authResponseSchema,
          },
        }),
        {
          tags: ['Authentication'],
          summary: 'Login',
          description: 'Authenticate user and get access token',
        },
      ),
    },
    login,
  );

  return app;
}

export default authRoutes;
