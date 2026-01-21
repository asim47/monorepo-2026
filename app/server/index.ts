import Fastify from 'fastify';
import { setupPlugins } from './plugins';
import { errorHandler } from './utils/errorHandler';
import { env } from './utils/env';
import { setupRoutes } from './routes';

const app = Fastify({
  logger:
    env.NODE_ENV === 'production'
      ? {
          level: 'info',
        }
      : {
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              colorize: true,
            },
          },
        },
});

const PORT = parseInt(env.PORT, 10);

// Set error handler
app.setErrorHandler(errorHandler);

// Start server
const start = async () => {
  try {
    // Setup plugins first (Swagger needs to be registered before routes to capture them)
    await setupPlugins(app);

    // Setup routes (Fastify Swagger will automatically pick up routes registered after it)
    await setupRoutes(app);

    await app.listen({ port: PORT, host: '0.0.0.0' });

    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
