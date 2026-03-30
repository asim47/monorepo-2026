#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const projectTypes = {
  1: { name: 'server', description: 'Node.js Backend (Fastify + TypeScript)' },
  2: { name: 'web', description: 'Next.js Web App (React + TypeScript + SSR)' },
  3: { name: 'web-app', description: 'Web App SPA (Vite + React + TypeScript)' },
  4: { name: 'admin', description: 'Admin Panel (Vite + React + TypeScript)' },
  5: {
    name: 'mobile',
    description: 'Mobile App (Expo + React Native + TypeScript)',
  },
};

// Template generators
const templates = {
  server: (projectName) => {
    const dbName = projectName.replace(/-/g, '_');
    return {
      packageJson: {
        name: `@app/${projectName}`,
        version: '1.0.0',
        description: `${projectName} backend server`,
        main: 'dist/index.js',
        scripts: {
          dev: 'tsx watch index.ts',
          build: 'tsc -p tsconfig.json',
          start: 'node dist/index.js',
          'type-check': 'tsc -p tsconfig.json --noEmit',
          lint: 'eslint .',
          'lint:fix': 'eslint . --fix',
          format: 'prettier --write "**/*.{ts,tsx,json,md}"',
          'format:check': 'prettier --check "**/*.{ts,tsx,json,md}"',
          'db:up': 'docker-compose up -d postgres',
          'db:down': 'docker-compose down',
          'db:stop': 'docker-compose stop postgres',
          'db:logs': 'docker-compose logs -f postgres',
          'db:reset': 'docker-compose down -v && docker-compose up -d postgres',
          'db:test': 'tsx scripts/test-db-connection.ts',
          'db:migrate': 'prisma migrate dev --schema ./prisma/schema.prisma',
          'db:migrate:deploy': 'prisma migrate deploy --schema ./prisma/schema.prisma',
          'db:migrate:reset': 'prisma migrate reset --schema ./prisma/schema.prisma',
          'db:generate': 'prisma generate --schema ./prisma/schema.prisma',
          'db:studio': 'prisma studio --schema ./prisma/schema.prisma',
        },
        dependencies: {
          '@aws-sdk/client-s3': '^3.962.0',
          '@aws-sdk/s3-request-presigner': '^3.962.0',
          '@fastify/cors': '^11.2.0',
          '@fastify/helmet': '^13.0.2',
          '@fastify/multipart': '^9.3.0',
          '@fastify/rate-limit': '^10.3.0',
          '@fastify/swagger': '^9.6.1',
          '@fastify/swagger-ui': '^5.2.4',
          '@getbrevo/brevo': '^3.0.1',
          '@prisma/adapter-pg': '^7.2.0',
          '@prisma/client': '^7.2.0',
          '@types/node': '^25.0.3',
          bcrypt: '^6.0.0',
          dotenv: '^17.2.3',
          fastify: '^5.6.2',
          jsonwebtoken: '^9.0.3',
          pg: '^8.16.3',
          prisma: '^7.2.0',
          tsx: '^4.21.0',
          typescript: '^5.9.3',
          zod: '^4.3.5',
        },
        devDependencies: {
          '@types/bcrypt': '^6.0.0',
          '@types/jsonwebtoken': '^9.0.10',
          '@typescript-eslint/eslint-plugin': '^8.51.0',
          '@typescript-eslint/parser': '^8.51.0',
          eslint: '^9.39.2',
          'eslint-config-prettier': '^10.1.8',
          'eslint-plugin-prettier': '^5.5.4',
          'pino-pretty': '^13.1.3',
          prettier: '^3.7.4',
          'typescript-eslint': '^8.51.0',
        },
      },
      tsconfig: {
        extends: '../../shared/config/ts/node.json',
        compilerOptions: {
          baseUrl: '.',
          paths: { '@repo/*': ['../../shared/*/src'] },
          outDir: './dist',
          rootDir: '.',
        },
        include: ['./**/*.ts'],
      },
      eslintConfig: `// Extends root ESLint config with server-specific overrides
import rootConfig from '../../eslint.config.mjs';

export default [
  ...rootConfig,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
];
`,
      indexFile: `import Fastify from 'fastify';
import { setupPlugins } from './plugins';
import { errorHandler } from './utils/errorHandler';
import { env } from './utils/env';
import { setupRoutes } from './routes';

const app = Fastify({
  logger:
    env.NODE_ENV === 'production'
      ? { level: 'info' }
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
app.setErrorHandler(errorHandler);

const start = async () => {
  try {
    await setupPlugins(app);
    await setupRoutes(app);
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(\`Server is running on http://localhost:\${PORT}\`);
    console.log(\`Swagger docs at http://localhost:\${PORT}/api-docs\`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
`,
      envExample: `# Server
PORT=8000
NODE_ENV=development

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=${dbName}
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL="postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@\${POSTGRES_HOST}:\${POSTGRES_PORT}/\${POSTGRES_DB}?schema=public"

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# AWS S3 (optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_CLOUDFRONT_DOMAIN=

# Brevo Email (optional)
BREVO_API_KEY=
BREVO_API_URL=https://api.brevo.com/v3
BREVO_FROM_EMAIL=noreply@example.com
BREVO_FROM_NAME=API
`,
      dockerCompose: `services:
  postgres:
    image: postgres:16-alpine
    container_name: ${projectName}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: \${POSTGRES_DB:-${dbName}}
    ports:
      - "\${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
`,
      prismaConfig: `require('dotenv').config();
const databaseUrl =
  process.env.DATABASE_URL ||
  \`postgresql://\${process.env.POSTGRES_USER || 'postgres'}:\${process.env.POSTGRES_PASSWORD || 'postgres'}@\${process.env.POSTGRES_HOST || 'localhost'}:\${process.env.POSTGRES_PORT || '5432'}/\${process.env.POSTGRES_DB || '${dbName}'}?schema=public\`;
module.exports = { datasource: { url: databaseUrl } };
`,
      files: {
        'plugins/index.ts': `import { FastifyInstance } from 'fastify';
import { setupCors } from './cors';
import { setupSecurity } from './security';
import { setupRateLimit } from './rateLimit';
import { setupSwagger } from './swagger';
import { setupMultipart } from './multipart';

export async function setupPlugins(app: FastifyInstance): Promise<void> {
  await setupSwagger(app);
  await setupSecurity(app);
  await setupCors(app);
  await setupRateLimit(app);
  await setupMultipart(app);
}
`,
        'plugins/cors.ts': `import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export async function setupCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:3002'],
    credentials: true,
  });
}
`,
        'plugins/security.ts': `import { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

export async function setupSecurity(app: FastifyInstance): Promise<void> {
  await app.register(helmet);
}
`,
        'plugins/swagger.ts': `import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from '../utils/env';

export async function setupSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: { title: 'API Documentation', description: 'Auto-generated API documentation', version: '1.0.0' },
      servers: [{ url: \`http://localhost:\${env.PORT}\`, description: 'Development server' }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Enter JWT token' },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });
  await app.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: { docExpansion: 'list', deepLinking: false },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}
`,
        'plugins/rateLimit.ts': `import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { env } from '../utils/env';

export async function setupRateLimit(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: env.NODE_ENV === 'production' ? 100 : 1000,
    timeWindow: '15 minutes',
  });
}
`,
        'plugins/multipart.ts': `import { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';

export async function setupMultipart(app: FastifyInstance): Promise<void> {
  await app.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } });
}
`,
        'utils/env.ts': `import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || '8000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  AWS: {
    REGION: process.env.AWS_REGION || '',
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
    CLOUDFRONT_DOMAIN: process.env.AWS_CLOUDFRONT_DOMAIN || '',
  },
  BREVO: {
    API_KEY: process.env.BREVO_API_KEY || '',
    API_URL: process.env.BREVO_API_URL || 'https://api.brevo.com/v3',
    FROM_EMAIL: process.env.BREVO_FROM_EMAIL || 'noreply@example.com',
    FROM_NAME: process.env.BREVO_FROM_NAME || 'API',
  },
  POSTGRES: {
    USER: process.env.POSTGRES_USER || 'postgres',
    PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
    DB: process.env.POSTGRES_DB || 'mydb',
    HOST: process.env.POSTGRES_HOST || 'localhost',
    PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
} as const;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = \`postgresql://\${env.POSTGRES.USER}:\${env.POSTGRES.PASSWORD}@\${env.POSTGRES.HOST}:\${env.POSTGRES.PORT}/\${env.POSTGRES.DB}?schema=public\`;
}
`,
        'utils/HttpError.ts': `export class HttpError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
    Error.captureStackTrace(this, this.constructor);
  }
}
`,
        'utils/logger.ts': `type LogLevel = 'info' | 'warn' | 'error' | 'debug';
class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    return \`[\${new Date().toISOString()}] [\${level.toUpperCase()}] \${message}\`;
  }
  info(message: string, ...args: unknown[]): void { console.log(this.formatMessage('info', message), ...args); }
  warn(message: string, ...args: unknown[]): void { console.warn(this.formatMessage('warn', message), ...args); }
  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    console.error(this.formatMessage('error', message), error instanceof Error ? error.stack : error, ...args);
  }
  debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') console.debug(this.formatMessage('debug', message), ...args);
  }
}
export const logger = new Logger();
`,
        'utils/errorHandler.ts': `import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { HttpError } from './HttpError';
import { logger } from './logger';

export async function errorHandler(error: unknown, request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (error instanceof ZodError) {
    const errors = error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    logger.warn('Validation error', { path: request.url, method: request.method, errors });
    await reply.code(400).send({ success: false, message: 'Validation error', errors });
    return;
  }
  if (error instanceof HttpError) {
    logger.error(\`HTTP Error \${error.statusCode}\`, error, { path: request.url, method: request.method });
    await reply.code(error.statusCode).send({ success: false, message: error.message });
    return;
  }
  if (error instanceof Error) {
    logger.error('Unhandled error', error, { path: request.url, method: request.method });
    await reply.code(500).send({ success: false, message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    return;
  }
  await reply.code(500).send({ success: false, message: 'Internal server error' });
}
`,
        'utils/swaggerSchemas.ts': `import type { z } from 'zod';

export function zodToOpenApiSchema(schema: z.ZodTypeAny, opts?: { title?: string; description?: string }): unknown {
  const json = (schema as { toJSONSchema?: () => unknown }).toJSONSchema?.() ?? {};
  if (json && typeof json === 'object' && '$schema' in json) delete (json as Record<string, unknown>).$schema;
  if (opts?.title && json && typeof json === 'object') (json as Record<string, unknown>).title = opts.title;
  if (opts?.description && json && typeof json === 'object') (json as Record<string, unknown>).description = opts.description;
  return json;
}

export interface FastifyZodSchema {
  body?: z.ZodTypeAny;
  querystring?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  response?: { [code: number]: z.ZodTypeAny };
}

export function createFastifySchema(z: FastifyZodSchema): Record<string, unknown> {
  const s: Record<string, unknown> = {};
  if (z.body) s.body = zodToOpenApiSchema(z.body);
  if (z.querystring) s.querystring = zodToOpenApiSchema(z.querystring);
  if (z.params) s.params = zodToOpenApiSchema(z.params);
  if (z.response) {
    s.response = {};
    for (const [code, sch] of Object.entries(z.response)) (s.response as Record<string, unknown>)[code] = zodToOpenApiSchema(sch);
  }
  return s;
}

export function withOpenApiMetadata(schema: unknown, meta: { tags?: string[]; summary?: string; description?: string; security?: unknown[] }): unknown {
  return { ...(schema as object), ...meta };
}
`,
        'utils/index.ts': `export * from './logger';
export * from './HttpError';
export * from './errorHandler';
export * from './env';
export * from './swaggerSchemas';
`,
        'db/connection.ts': `import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const databaseUrl = process.env.DATABASE_URL || \`postgresql://\${env.POSTGRES.USER}:\${env.POSTGRES.PASSWORD}@\${env.POSTGRES.HOST}:\${env.POSTGRES.PORT}/\${env.POSTGRES.DB}?schema=public\`;
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

prisma.$connect().then(() => logger.info('Database connected')).catch((e: unknown) => { logger.error('Failed to connect to database', e); process.exit(1); });
export default prisma;
`,
        'db/index.ts': `export { prisma, default as db } from './connection';
`,
        'middleware/isAuthenticated.ts': `import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { verifyToken, extractTokenFromHeader } from '../helpers/auth/jwt';
import { HttpError } from '../utils/HttpError';

export interface AuthenticatedRequest<R extends RouteGenericInterface = RouteGenericInterface> extends FastifyRequest<R> {
  user?: { userId: number; email: string };
}

export async function isAuthenticated(request: AuthenticatedRequest, _reply: FastifyReply): Promise<void> {
  try {
    const token = extractTokenFromHeader(request.headers.authorization);
    if (!token) throw new HttpError(401, 'Authentication required');
    const payload = verifyToken(token);
    request.user = { userId: payload.userId, email: payload.email };
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(401, 'Invalid or expired token');
  }
}
`,
        'types/routeContext.ts': `export interface RouteContext {}
`,
        'helpers/auth/bcrypt.ts': `import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export async function hashPassword(password: string): Promise<string> { return bcrypt.hash(password, SALT_ROUNDS); }
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> { return bcrypt.compare(password, hashedPassword); }
`,
        'helpers/auth/jwt.ts': `import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../utils/env';

export interface JWTPayload { userId: number; email: string; }

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT.SECRET, { expiresIn: env.JWT.EXPIRES_IN } as SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  try { return jwt.verify(token, env.JWT.SECRET) as JWTPayload; } catch { throw new Error('Invalid or expired token'); }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}
`,
        'helpers/auth/index.ts': `export * from './bcrypt';
export * from './jwt';
`,
        'helpers/aws/s3.ts': `import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { logger } from '../../utils/logger';
import { env } from '../../utils/env';

const getS3 = (): S3Client => new S3Client({
  region: env.AWS.REGION,
  credentials: { accessKeyId: env.AWS.ACCESS_KEY_ID, secretAccessKey: env.AWS.SECRET_ACCESS_KEY },
});

export async function uploadFileToS3(file: Buffer, name: string, path = ''): Promise<string> {
  const key = \`\${path}\${Date.now()}-\${name.replace(/ /g, '_')}\`;
  await getS3().send(new PutObjectCommand({ Bucket: env.AWS.BUCKET_NAME, Body: file, Key: key, ACL: 'public-read' } as PutObjectCommandInput));
  return \`\${env.AWS.CLOUDFRONT_DOMAIN}/\${key}\`;
}
`,
        'helpers/email/email.ts': `import * as brevo from '@getbrevo/brevo';
import { logger } from '../../utils/logger';
import { env } from '../../utils/env';
import { readTemplate } from './templates/templateLoader';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  template?: string;
  templateData?: Record<string, string | number>;
  from?: { email: string; name?: string };
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  let html = options.html;
  if (options.template) html = await readTemplate(options.template, options.templateData || {});
  if (!html) throw new Error('Email content (html or template) is required');
  const api = new brevo.TransactionalEmailsApi();
  api.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO.API_KEY);
  const email = new brevo.SendSmtpEmail();
  email.subject = options.subject;
  email.htmlContent = html;
  email.sender = options.from || { email: env.BREVO.FROM_EMAIL, name: env.BREVO.FROM_NAME };
  email.to = Array.isArray(options.to) ? options.to.map((e) => ({ email: e })) : [{ email: options.to }];
  await api.sendTransacEmail(email);
  logger.info('Email sent', { to: options.to, subject: options.subject });
}
`,
        'helpers/email/templates/templateLoader.ts': `import { readFileSync } from 'fs';
import { join } from 'path';

export async function readTemplate(name: string, data: Record<string, string | number> = {}): Promise<string> {
  let t = readFileSync(join(__dirname, \`\${name}.html\`), 'utf-8');
  Object.keys(data).forEach((k) => { t = t.replace(new RegExp(\`{{\${k}}}\`, 'g'), String(data[k])); });
  return t;
}
`,
        'helpers/email/templates/welcome.html': `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Welcome</title></head><body style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: #f4f4f4; padding: 20px; border-radius: 5px;"><h1>Welcome {{name}}!</h1><p>Thank you for joining us.</p></div></body></html>`,
        'helpers/index.ts': `export * from './aws/s3';
export * from './email/email';
export * from './auth';
`,
        'routes/index.ts': `import { FastifyInstance } from 'fastify';
import userRoutes from './userRoutes/userRoutes';
import healthRoutes from './healthRoutes/healthRoutes';
import authRoutes from './authRoutes/authRoutes';
import { RouteContext } from '../types/routeContext';

export async function setupRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async (_, reply) => reply.send({ message: 'Welcome to the API!', timestamp: new Date().toISOString() }));
  const ctx: RouteContext = {};
  healthRoutes(app, ctx);
  authRoutes(app, ctx);
  userRoutes(app, ctx);
}
`,
        'routes/healthRoutes/healthRoutes.ts': `import { FastifyInstance } from 'fastify';
import { getHealth } from './controllers/healthController';
import { RouteContext } from '../../types/routeContext';
import { z } from 'zod';
import { createFastifySchema, withOpenApiMetadata } from '../../utils/swaggerSchemas';

const healthSchema = z.object({ status: z.string() });
function healthRoutes(app: FastifyInstance, _: RouteContext) {
  app.get('/health', { schema: withOpenApiMetadata(createFastifySchema({ response: { 200: healthSchema } }), { tags: ['Health'], summary: 'Health check' }) }, getHealth);
  return app;
}
export default healthRoutes;
`,
        'routes/healthRoutes/controllers/healthController.ts': `import { FastifyRequest, FastifyReply } from 'fastify';
export const getHealth = async (_: FastifyRequest, reply: FastifyReply) => reply.code(200).send({ status: 'ok' });
`,
        'routes/authRoutes/authRoutes.ts': `import { FastifyInstance } from 'fastify';
import { signup } from './controllers/signup';
import { login } from './controllers/login';
import { RouteContext } from '../../types/routeContext';
import { signupSchema, loginSchema, authResponseSchema } from '../../schemas/authSchemas';
import { createFastifySchema, withOpenApiMetadata } from '../../utils/swaggerSchemas';

function authRoutes(app: FastifyInstance, _: RouteContext) {
  app.post('/api/auth/signup', { schema: withOpenApiMetadata(createFastifySchema({ body: signupSchema, response: { 201: authResponseSchema } }), { tags: ['Authentication'], summary: 'Sign up' }) }, signup);
  app.post('/api/auth/login', { schema: withOpenApiMetadata(createFastifySchema({ body: loginSchema, response: { 200: authResponseSchema } }), { tags: ['Authentication'], summary: 'Login' }) }, login);
  return app;
}
export default authRoutes;
`,
        'routes/authRoutes/controllers/login.ts': `import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginInput } from '../../../schemas/authSchemas';
import { prisma } from '../../../db';
import { verifyPassword } from '../../../helpers/auth/bcrypt';
import { generateToken } from '../../../helpers/auth/jwt';
import { HttpError } from '../../../utils/HttpError';

export const login = async (req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(401, 'Invalid email or password');
  if (user.status === 'Blocked') throw new HttpError(403, 'Your account has been blocked');
  if (!(await verifyPassword(password, user.password))) throw new HttpError(401, 'Invalid email or password');
  const token = generateToken({ userId: user.id, email: user.email });
  const { password: _, ...u } = user;
  return reply.code(200).send({ success: true, message: 'Login successful', data: { token, user: u } });
};
`,
        'routes/authRoutes/controllers/signup.ts': `import { FastifyRequest, FastifyReply } from 'fastify';
import { SignupInput } from '../../../schemas/authSchemas';
import { prisma } from '../../../db';
import { hashPassword } from '../../../helpers/auth/bcrypt';
import { generateToken } from '../../../helpers/auth/jwt';
import { HttpError } from '../../../utils/HttpError';

export const signup = async (req: FastifyRequest<{ Body: SignupInput }>, reply: FastifyReply) => {
  const body = req.body;
  if (await prisma.user.findUnique({ where: { email: body.email } })) throw new HttpError(409, 'User with this email already exists');
  const hashed = await hashPassword(body.password);
  const user = await prisma.user.create({ data: { name: body.name, email: body.email, password: hashed } });
  const token = generateToken({ userId: user.id, email: user.email });
  const { password: _, ...u } = user;
  return reply.code(201).send({ success: true, message: 'User created successfully', data: { token, user: u } });
};
`,
        'routes/userRoutes/userRoutes.ts': `import { FastifyInstance } from 'fastify';
import { getUsers } from './controllers/getUsers';
import { createUser } from './controllers/createUser';
import { RouteContext } from '../../types/routeContext';
import { createUserSchema, usersResponseSchema, createUserResponseSchema } from '../../schemas/userSchemas';
import { createFastifySchema, withOpenApiMetadata } from '../../utils/swaggerSchemas';
import { isAuthenticated } from '../../middleware/isAuthenticated';

function userRoutes(app: FastifyInstance, _: RouteContext) {
  app.get('/api/users', { preHandler: [isAuthenticated], schema: withOpenApiMetadata(createFastifySchema({ response: { 200: usersResponseSchema } }), { tags: ['Users'], summary: 'Get all users', security: [{ bearerAuth: [] }] }) }, getUsers);
  app.post('/api/users', { preHandler: [isAuthenticated], schema: withOpenApiMetadata(createFastifySchema({ body: createUserSchema, response: { 201: createUserResponseSchema } }), { tags: ['Users'], summary: 'Create user', security: [{ bearerAuth: [] }] }) }, createUser);
  return app;
}
export default userRoutes;
`,
        'routes/userRoutes/controllers/getUsers.ts': `import { FastifyReply } from 'fastify';
import { prisma } from '../../../db';
import { AuthenticatedRequest } from '../../../middleware/isAuthenticated';

export const getUsers = async (req: AuthenticatedRequest, reply: FastifyReply) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, status: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: 'desc' } });
  return reply.code(200).send({ success: true, data: users, count: users.length });
};
`,
        'routes/userRoutes/controllers/createUser.ts': `import { FastifyReply } from 'fastify';
import { CreateUserInput } from '../../../schemas/userSchemas';
import { prisma } from '../../../db';
import { hashPassword } from '../../../helpers/auth/bcrypt';
import { AuthenticatedRequest } from '../../../middleware/isAuthenticated';

export const createUser = async (req: AuthenticatedRequest, reply: FastifyReply) => {
  const body = req.body as CreateUserInput;
  if (await prisma.user.findUnique({ where: { email: body.email } })) return reply.code(409).send({ success: false, message: 'User with this email already exists' });
  const hashed = await hashPassword(body.password);
  const user = await prisma.user.create({ data: { name: body.name, email: body.email, password: hashed, ...(body.status && { status: body.status }) } });
  const { password: _, ...u } = user;
  return reply.code(201).send({ success: true, message: 'User created successfully', data: u });
};
`,
        'schemas/authSchemas.ts': `import { z } from 'zod';

export const signupSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({ token: z.string(), user: z.object({ id: z.number(), name: z.string(), email: z.string(), status: z.enum(['Active', 'Blocked']) }) }),
});
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
`,
        'schemas/userSchemas.ts': `import { z } from 'zod';

export const userStatusSchema = z.enum(['Active', 'Blocked']);
export const createUserSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8), status: userStatusSchema.optional() });
export const userSchema = z.object({ id: z.number(), name: z.string(), email: z.string(), status: userStatusSchema, createdAt: z.string(), updatedAt: z.string() });
export const usersResponseSchema = z.object({ success: z.boolean(), data: z.array(userSchema), count: z.number() });
export const createUserResponseSchema = z.object({ success: z.boolean(), message: z.string(), data: userSchema });
export type CreateUserInput = z.infer<typeof createUserSchema>;
`,
        'schemas/index.ts': `export * from './authSchemas';
export * from './userSchemas';
`,
        'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum UserStatus {
  Active
  Blocked
}

model User {
  id        Int        @id @default(autoincrement())
  name      String
  email     String     @unique
  password  String
  status    UserStatus @default(Active)
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  @@map("users")
}
`,
        'scripts/test-db-connection.ts': `import { prisma } from '../db';
async function main() {
  await prisma.$connect();
  console.log('Database connection OK');
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
`,
      },
    };
  },

  web: (projectName) => ({
    packageJson: {
      name: `@app/${projectName}`,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev --turbopack',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        'lint:fix': 'next lint --fix',
        'type-check': 'tsc -p tsconfig.json --noEmit',
      },
      dependencies: {
        '@emotion/react': '^11.11.1',
        '@emotion/styled': '^11.11.0',
        '@hookform/resolvers': '^4.1.2',
        '@mui/icons-material': '^5.14.3',
        '@mui/material': '^5.14.3',
        '@stripe/react-stripe-js': '^3.1.1',
        '@stripe/stripe-js': '^5.7.0',
        '@tanstack/react-query': '^5.66.11',
        autoprefixer: '^10.4.14',
        axios: '^1.8.1',
        'date-fns': '^4.1.0',
        moment: '^2.30.1',
        'next': '16.2.1',
        'next-themes': '^0.2.1',
        postcss: '^8.4.27',
        'react': '19.2.4',
        'react-dom': '19.2.4',
        'react-hook-form': '^7.54.2',
        'react-hot-toast': '^2.5.2',
        sass: '^1.85.1',
        'socket.io-client': '^4.8.1',
        zod: '^3.24.2',
      },
      devDependencies: {
        '@repo/config': '0.0.0',
        '@tailwindcss/postcss': '^4',
        '@tanstack/eslint-plugin-query': '^5.66.1',
        '@types/node': '^20',
        '@types/react': '19.2.14',
        '@types/react-dom': '19.2.3',
        eslint: '^9',
        'eslint-config-next': '16.2.1',
        tailwindcss: '^3.3.3',
        typescript: '^5',
      },
      overrides: {
        '@types/react': '19.2.14',
        '@types/react-dom': '19.2.3',
      },
    },
    tsconfig: {
      extends: '../../shared/config/ts/next.json',
      compilerOptions: {
        baseUrl: '.',
        paths: { '@/*': ['./src/*'] },
        allowJs: true,
        skipLibCheck: true,
        isolatedModules: true,
        incremental: true,
        plugins: [{ name: 'next' }],
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
    nextConfig: `import type { NextConfig } from 'next';
const nextConfig: NextConfig = { transpilePackages: ['@repo/ui'] };
export default nextConfig;
`,
    eslintConfig: `{ "extends": ["next/core-web-vitals", "next/typescript"] }
`,
    postcssConfig: `const config = { plugins: ["@tailwindcss/postcss"] };
export default config;
`,
    tailwindConfig: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  presets: [require('../../shared/config/tailwind/index.cjs')],
};
`,
    appLayout: `import '@/styles/globals.scss';
import ConfigWrapper from '@/common/configWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Generated by monorepo boilerplate',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConfigWrapper>{children}</ConfigWrapper>
      </body>
    </html>
  );
}
`,
    appPage: `export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to ${projectName}</h1>
      <p className="text-text-secondary mt-2">Your Next.js app is ready!</p>
    </div>
  );
}
`,
    gitignore: `.next/\nout/\nbuild/\ndist/\nnode_modules/\n.DS_Store\n.env*.local\n.vercel\n*.tsbuildinfo\nnext-env.d.ts
`,
    files: {
      'src/helpers/constants.ts': `export const CONSTANTS = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000',
};
`,
      'src/helpers/assets.ts': `export const ASSETS = {
  favIcon: '/icons/favicon.svg',
  logo: '/images/logo.svg',
};
`,
      'src/helpers/apiRequest.ts': `import { GenericData } from '@/interfaces';
import axios, { AxiosRequestConfig } from 'axios';
import { CONSTANTS } from './constants';

const instance = axios.create({ baseURL: CONSTANTS.API_ENDPOINT });

instance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) config.headers['access-token'] = token;
  return config;
}, (e) => Promise.reject(e));

instance.interceptors.response.use((r) => r, (e) => Promise.reject(e));

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const res = await instance(config);
  return res.data;
};
`,
      'src/helpers/api.ts': `import { apiRequest } from './apiRequest';
import type { GenericData, UserData } from '@/interfaces';

export const getUser = async () =>
  apiRequest<GenericData<UserData>>({ method: 'GET', url: '/api/users/me' });
`,
      'src/interfaces/index.ts': `import { z } from 'zod';

export interface GenericData<T> { data: T; }

export interface UserData { id: number; name: string; email: string; }

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type SignupFormData = z.infer<typeof signupSchema>;
`,
      'src/common/queryProvider/index.tsx': `'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { PropsWithChildren } from 'react';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (n, e) => (n >= 3 ? false : !(isAxiosError(e) && [400, 401, 403, 404].includes(e.response?.status ?? 0))),
    },
  },
});

export const ReactQueryProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
`,
      'src/common/userProvider/index.tsx': `'use client';
import { getUser } from '@/helpers/api';
import { UserData } from '@/interfaces';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, FC, PropsWithChildren, useCallback } from 'react';

type Ctx = { user: UserData | null | undefined; isError: boolean; isLoading: boolean; refetch: () => void; logout: () => void; };
export const UserContext = createContext<Ctx>({ user: null, isError: false, isLoading: false, logout: () => {}, refetch: () => {} });

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const qc = useQueryClient();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: !!token,
    staleTime: Infinity,
  });
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    qc.setQueryData(['user'], null);
    refetch();
    router.push('/');
  }, [qc, refetch, router]);
  return (
    <UserContext.Provider value={{ user: data?.data, isError, isLoading, refetch, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
`,
      'src/common/configWrapper/index.tsx': `'use client';
import { ThemeProvider } from 'next-themes';
import MUIThemeProvider from '@/theme/ThemeProvider';
import { ReactQueryProvider } from '../queryProvider';
import { Toaster } from 'react-hot-toast';
import UserProvider from '../userProvider';

export default function ConfigWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
        <MUIThemeProvider>
          <UserProvider>
            <div className="bg-background">{children}</div>
            <Toaster />
          </UserProvider>
        </MUIThemeProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
`,
      'src/common/authPageLayout/index.tsx': `'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../userProvider';

export default function AuthPageLayout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);
  return <div className="h-[100svh] w-full flex items-center justify-center bg-background">{children}</div>;
}
`,
      'src/common/dashboardLayout/index.tsx': `'use client';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../userProvider';
import { Button } from '@mui/material';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();
  if (!user) { router.push('/'); return null; }
  return (
    <div className="w-full min-h-[100svh] flex flex-col">
      <header className="h-14 flex justify-end items-center px-4 border-b">
        <span className="mr-2">{user.name}</span>
        <Button size="small" onClick={logout}>Logout</Button>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
`,
      'src/theme/colors.ts': `function getCssVar(name: string): string {
  if (typeof window !== 'undefined') return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const d: Record<string, string> = { '--primary': '#0066FF', '--error': '#940900', '--success': '#21DC11', '--background': '#FFFFFF', '--background-paper': '#F2f2f2', '--text-primary': '#000', '--text-secondary': '#757575' };
  return d[name] || '';
}
export const getMuiColors = (isDark: boolean) => ({
  primary: getCssVar('--primary'),
  error: getCssVar('--error'),
  success: getCssVar('--success'),
  background: { default: getCssVar('--background'), paper: getCssVar('--background-paper') },
  text: { primary: getCssVar('--text-primary'), secondary: getCssVar('--text-secondary') },
});
export const colors = { primary: 'var(--primary)', error: 'var(--error)', success: 'var(--success)' };
`,
      'src/theme/ThemeProvider.tsx': `'use client';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from 'next-themes';
import { getMuiColors } from './colors';
import { ReactNode, useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === 'dark';
  const theme = createTheme({
    palette: { mode: isDark ? 'dark' : 'light', ...getMuiColors(isDark) },
    components: { MuiButton: { defaultProps: { variant: 'outlined' } } },
  });
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <MUIThemeProvider theme={theme}><CssBaseline />{children}</MUIThemeProvider>;
}
`,
      'src/styles/globals.scss': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #0066FF;
  --background: #ffffff;
  --background-paper: #F2f2f2;
  --text-primary: #000000;
  --text-secondary: #757575;
  --error: #940900;
  --success: #21dc11;
}

[data-theme="dark"] {
  --background: #000000;
  --background-paper: #0d0d0d;
  --text-primary: #ffffff;
}

body { background-color: var(--background); color: var(--text-primary); }
`,
    },
  }),

  admin: (projectName) => ({
    packageJson: {
      name: `@app/${projectName}`,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -p tsconfig.json && vite build',
        preview: 'vite preview',
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
        'type-check': 'tsc -p tsconfig.json --noEmit',
      },
      dependencies: {
        '@emotion/react': '^11.11.1',
        '@emotion/styled': '^11.11.0',
        '@hookform/resolvers': '^4.1.2',
        '@mui/icons-material': '^5.14.3',
        '@mui/material': '^5.14.3',
        '@mui/x-data-grid': '^8.9.1',
        '@tanstack/react-query': '^5.66.11',
        axios: '^1.8.1',
        'date-fns': '^4.1.0',
        'lucide-react': '^0.525.0',
        'moment': '^2.30.1',
        'next-themes': '^0.2.1',
        'react': '19.2.3',
        'react-dom': '19.2.3',
        'react-hook-form': '^7.54.2',
        'react-hot-toast': '^2.5.2',
        'recharts': '^3.1.0',
        'react-router-dom': '^6.30.0',
      },
      devDependencies: {
        '@repo/config': '0.0.0',
        '@eslint/js': '^9.39.2',
        '@tanstack/eslint-plugin-query': '^5.66.1',
        '@types/react': '^19',
        '@types/react-dom': '^19',
        '@vitejs/plugin-react': '^4.3.4',
        autoprefixer: '^10.4.14',
        eslint: '^9.39.2',
        'eslint-plugin-react-hooks': '^5.2.0',
        'eslint-plugin-react-refresh': '^0.4.18',
        postcss: '^8.4.27',
        sass: '^1.85.1',
        tailwindcss: '^3.3.3',
        typescript: '^5.9.3',
        'typescript-eslint': '^8.51.0',
        vite: '^6.1.0',
      },
    },
    tsconfig: {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src'],
    },
    viteConfig: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173 },
});
`,
    postcssConfig: `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
`,
    tailwindConfig: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
`,
    eslintConfig: `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
`,
    indexHtml: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    mainTsx: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ConfigWrapper from '@/common/configWrapper';
import App from './App';
import '@/styles/globals.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigWrapper>
        <App />
      </ConfigWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
`,
    appTsx: `import { Route, Routes } from 'react-router-dom';
import DashboardPage from '@/app/page';
import AuthLoginPage from '@/app/auth/login/page';
import ProfilePage from '@/app/profile/page';

const NotFound = () => <div className="w-full h-[100svh] flex items-center justify-center"><h1 className="text-2xl">404</h1></div>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/auth/login" element={<AuthLoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
`,
    gitignore: `# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n.DS_Store\n`,
    files: {
      'src/helpers/constants.ts': `export const CONSTANTS = { API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8000' };
`,
      'src/helpers/assets.ts': `export const ASSETS = { logo: '/images/logo.png', defaultAvatar: '/images/defaultAvatar.png' };
`,
      'src/helpers/apiRequest.ts': `import { GenericData } from '@/interfaces';
import axios, { AxiosRequestConfig } from 'axios';
import { CONSTANTS } from './constants';

const instance = axios.create({ baseURL: CONSTANTS.API_ENDPOINT });
instance.interceptors.request.use((c) => {
  const t = localStorage.getItem('accessToken');
  if (t) c.headers['access-token'] = t;
  c.headers['u-f'] = 'admin';
  return c;
}, (e) => Promise.reject(e));
instance.interceptors.response.use((r) => r, (e) => Promise.reject(e));

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const res = await instance(config);
  return res.data;
};
`,
      'src/helpers/api.ts': `import { apiRequest } from './apiRequest';
import type { GenericData, UserData } from '@/interfaces';

export interface LoginFormData { email: string; password: string; }

export const login = (data: LoginFormData) =>
  apiRequest<GenericData<{ accessToken: string; refreshToken: string }>>({ method: 'POST', url: '/api/auth/login', data });

export const getUser = () => apiRequest<GenericData<UserData>>({ method: 'GET', url: '/api/users/me' });
`,
      'src/interfaces/index.ts': `export interface GenericData<T> { data: T; }
export interface UserData { id: number; name: string; email: string; }
`,
      'src/common/queryProvider/index.tsx': `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { PropsWithChildren } from 'react';

const client = new QueryClient({
  defaultOptions: {
    queries: { retry: (n, e) => (n >= 3 ? false : !(isAxiosError(e) && [400, 401, 403, 404].includes(e.response?.status ?? 0))) },
  },
});

export const ReactQueryProvider = ({ children }: PropsWithChildren) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
`,
      'src/common/userProvider/index.tsx': `import { UserData } from '@/interfaces';
import { useNavigate } from 'react-router-dom';
import { createContext, FC, PropsWithChildren, useCallback, useState, useEffect } from 'react';

type Ctx = { user: UserData | null; isError: boolean; isLoading: boolean; refetch: () => void; logout: () => void; };
export const UserContext = createContext<Ctx>({ user: null, isError: false, isLoading: false, logout: () => {}, refetch: () => {} });

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (t) setUser({ id: 1, name: 'Admin', email: 'admin@example.com' });
  }, []);
  const logout = useCallback(() => { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); setUser(null); navigate('/auth/login'); }, [navigate]);
  const refetch = useCallback(() => {}, []);
  return <UserContext.Provider value={{ user, isError: false, isLoading: false, refetch, logout }}>{children}</UserContext.Provider>;
};
export default UserProvider;
`,
      'src/common/configWrapper/index.tsx': `import { ThemeProvider } from 'next-themes';
import MUIThemeProvider from '@/theme/ThemeProvider';
import { ReactQueryProvider } from '../queryProvider';
import { Toaster } from 'react-hot-toast';
import UserProvider from '../userProvider';

export default function ConfigWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
        <MUIThemeProvider>
          <UserProvider>
            <div className="bg-background">{children}</div>
            <Toaster />
          </UserProvider>
        </MUIThemeProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
`,
      'src/common/authPageLayout/index.tsx': `import { ASSETS } from '@/helpers/assets';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userProvider';

export default function AuthPageLayout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  if (user) return null;
  return (
    <div className="h-[100svh] w-full flex">
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gradient-to-br from-primary to-blue-900 text-white" />
      <div className="flex-[1.4] flex items-center justify-center bg-white py-10 px-4"><div className="w-full max-w-[400px]">{children}</div></div>
    </div>
  );
}
`,
      'src/common/dashboardLayout/index.tsx': `import { ASSETS } from '@/helpers/assets';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  useEffect(() => { if (!user) navigate('/auth/login'); }, [user, navigate]);
  if (!user) return null;
  return (
    <div className="w-full h-[100svh] flex overflow-hidden">
      <aside className="hidden lg:flex w-[280px] p-5 border-r flex-col gap-3"><h2>Sidebar</h2></aside>
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex justify-end items-center px-4 border-b">
          <Button onClick={(e) => setAnchorEl(e.currentTarget)} className="!text-text-primary">{user.name}<Avatar className="ml-2" /></Button>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>Profile</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); logout(); }}>Logout</MenuItem>
          </Menu>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
`,
      'src/theme/colors.ts': `function getCssVar(n: string): string {
  if (typeof window !== 'undefined') return getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const d: Record<string, string> = { '--primary': '#10B981', '--error': '#dc2626', '--success': '#059669', '--background': '#FFF', '--background-paper': '#FFF', '--text-primary': '#000', '--text-secondary': '#757575' };
  return d[n] || '';
}
export const getMuiColors = (d: boolean) => ({ primary: getCssVar('--primary'), error: getCssVar('--error'), success: getCssVar('--success'), background: { default: getCssVar('--background'), paper: getCssVar('--background-paper') }, text: { primary: getCssVar('--text-primary'), secondary: getCssVar('--text-secondary') } });
export const colors = { primary: 'var(--primary)', error: 'var(--error)', success: 'var(--success)' };
`,
      'src/theme/ThemeProvider.tsx': `import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from 'next-themes';
import { getMuiColors } from './colors';
import { ReactNode, useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === 'dark';
  const theme = createTheme({ palette: { mode: isDark ? 'dark' : 'light', ...getMuiColors(isDark) }, components: { MuiButton: { defaultProps: { variant: 'outlined' } } } });
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <MUIThemeProvider theme={theme}><CssBaseline />{children}</MUIThemeProvider>;
}
`,
      'src/styles/globals.scss': `@tailwind base; @tailwind components; @tailwind utilities;
:root { --primary: #10B981; --error: #dc2626; --success: #059669; --background: #FFF; --background-paper: #FFF; --text-primary: #000; --text-secondary: #757575; }
[data-theme="dark"] { --background: #0d0d0d; --background-paper: #1a1a1a; --text-primary: #fff; }
body { background: var(--background); color: var(--text-primary); }
`,
      'src/app/page.tsx': `import DashboardLayout from '@/common/dashboardLayout';

export default function DashboardPage() {
  return <DashboardLayout><div><h1 className="text-2xl font-semibold">Dashboard</h1><p className="text-text-secondary">Welcome to ${projectName} admin.</p></div></DashboardLayout>;
}
`,
      'src/app/auth/login/page.tsx': `import AuthPageLayout from '@/common/authPageLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/helpers/api';
import { Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { LoginFormData } from '@/helpers/api';

export default function AuthLoginPage() {
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const { register, handleSubmit } = useForm<LoginFormData>();
  const onSub = async (d: LoginFormData) => {
    try {
      const res = await login(d);
      localStorage.setItem('accessToken', (res as { data: { accessToken: string } }).data.accessToken);
      navigate('/');
    } catch (e) { setErr((e as Error).message); }
  };
  return <AuthPageLayout><form onSubmit={handleSubmit(onSub)} className="flex flex-col gap-4"><TextField label="Email" {...register('email')} /><TextField label="Password" type="password" {...register('password')} /><Button type="submit">Login</Button>{err && <span className="text-error">{err}</span>}</form></AuthPageLayout>;
}
`,
      'src/app/profile/page.tsx': `import DashboardLayout from '@/common/dashboardLayout';
import { useContext } from 'react';
import { UserContext } from '@/common/userProvider';

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  return <DashboardLayout><div><h1 className="text-2xl">Profile</h1><p>{user?.email}</p></div></DashboardLayout>;
}
`,
    },
    gitignore: `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`,
  }),

  'web-app': (projectName) => ({
    packageJson: {
      name: `@app/${projectName}`,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -p tsconfig.json && vite build',
        preview: 'vite preview',
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
        'type-check': 'tsc -p tsconfig.json --noEmit',
      },
      dependencies: {
        '@emotion/react': '^11.11.1',
        '@emotion/styled': '^11.11.0',
        '@mui/material': '^5.14.3',
        '@tanstack/react-query': '^5.66.11',
        axios: '^1.8.1',
        'next-themes': '^0.2.1',
        'react': '^19.0.0',
        'react-dom': '^19.0.0',
        'react-hook-form': '^7.54.2',
        'react-hot-toast': '^2.5.2',
        'react-router-dom': '^6.30.0',
        zod: '^3.24.2',
      },
      devDependencies: {
        '@repo/config': '0.0.0',
        '@eslint/js': '^9.39.2',
        '@types/react': '^19',
        '@types/react-dom': '^19',
        '@vitejs/plugin-react': '^4.3.4',
        autoprefixer: '^10.4.14',
        eslint: '^9.39.2',
        'eslint-plugin-react-hooks': '^5.2.0',
        'eslint-plugin-react-refresh': '^0.4.18',
        postcss: '^8.4.27',
        tailwindcss: '^3.3.3',
        typescript: '^5.9.3',
        'typescript-eslint': '^8.51.0',
        vite: '^6.1.0',
      },
    },
    tsconfig: {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src'],
    },
    viteConfig: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
  },
})
`,
    eslintConfig: `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
`,
    indexHtml: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    mainTsx: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ConfigWrapper from '@/common/configWrapper';
import App from './App';
import '@/styles/globals.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigWrapper>
        <App />
      </ConfigWrapper>
    </BrowserRouter>
  </StrictMode>,
);
`,
    appTsx: `import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">${projectName}</h1>
      <p className="text-text-secondary mt-2">Welcome to your new web app!</p>
      <Link to="/about" className="text-primary underline">Go to About</Link>
    </div>
  );
}

function About() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">About</h1>
      <Link to="/" className="text-primary underline">Back to Home</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
`,
    files: {
      'src/helpers/constants.ts': `export const CONSTANTS = { API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8000' };
`,
      'src/helpers/apiRequest.ts': `import axios, { AxiosRequestConfig } from 'axios';
import { CONSTANTS } from './constants';

const instance = axios.create({ baseURL: CONSTANTS.API_ENDPOINT });
instance.interceptors.request.use((c) => {
  const t = localStorage.getItem('accessToken');
  if (t) c.headers['access-token'] = t;
  return c;
}, (e) => Promise.reject(e));

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const res = await instance(config);
  return res.data;
};
`,
      'src/common/configWrapper/index.tsx': `import { ThemeProvider } from 'next-themes';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

const qc = new QueryClient();

function MUIWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [m, setM] = useState(false);
  useEffect(() => { setM(true); }, []);
  if (!m) return null;
  const theme = createTheme({ palette: { mode: resolvedTheme === 'dark' ? 'dark' : 'light' } });
  return <MUIThemeProvider theme={theme}><CssBaseline />{children}</MUIThemeProvider>;
}

export default function ConfigWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
        <MUIWrapper>
          {children}
          <Toaster />
        </MUIWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
`,
      'src/styles/globals.scss': `@tailwind base; @tailwind components; @tailwind utilities;
:root { --primary: #0066FF; --background: #fff; --text-primary: #000; --text-secondary: #757575; }
[data-theme="dark"] { --background: #0d0d0d; --text-primary: #fff; }
body { background: var(--background); color: var(--text-primary); }
`,
    },
    tailwindConfig: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
    postcssConfig: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
    gitignore: `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`,
  }),

  mobile: (projectName) => ({
    packageJson: {
      name: `@app/${projectName}`,
      main: 'expo-router/entry',
      version: '1.0.0',
      scripts: {
        start: 'expo start',
        dev: 'expo start -c',
        android: 'expo run:android',
        ios: 'expo run:ios',
        web: 'expo start --web',
        lint: 'expo lint',
        'lint:fix': 'expo lint --fix',
        prebuild: 'expo prebuild',
      },
      dependencies: {
        '@hookform/resolvers': '^5.2.2',
        '@tanstack/react-query': '^5.90.10',
        axios: '^1.11.0',
        'expo': '~54.0.30',
        'expo-constants': '~18.0.8',
        'expo-linking': '~8.0.11',
        'expo-router': '~6.0.21',
        'expo-status-bar': '~3.0.9',
        'react': '19.1.0',
        'react-dom': '19.1.0',
        'react-hook-form': '^7.66.1',
        'react-native': '0.81.5',
        'react-native-mmkv': '^3.3.1',
        'react-native-safe-area-context': '~5.6.0',
        'react-native-screens': '~4.16.0',
        'zod': '^4.1.13',
        'zustand': '^5.0.8',
      },
      devDependencies: {
        '@types/react': '~19.1.0',
        eslint: '^9.25.0',
        'eslint-config-expo': '~10.0.0',
        typescript: '~5.9.2',
      },
      private: true,
    },
    tsconfig: {
      extends: 'expo/tsconfig.base',
      compilerOptions: {
        strict: true,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
        },
      },
    },
    appJson: {
      expo: {
        name: projectName,
        slug: projectName,
        version: '1.0.0',
        orientation: 'portrait',
        icon: './src/assets/images/icon.png',
        scheme: projectName,
        userInterfaceStyle: 'automatic',
        splash: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
        ios: {
          supportsTablet: true,
          bundleIdentifier: `com.${projectName.toLowerCase()}.app`,
        },
        android: {
          adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff',
          },
          package: `com.${projectName.toLowerCase()}.app`,
        },
        web: {
          bundler: 'metro',
          output: 'static',
          favicon: './assets/favicon.png',
        },
        plugins: ['expo-router'],
        experiments: {
          typedRoutes: true,
        },
      },
    },
    appLayout: `import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
`,
    appIndex: `import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to ${projectName}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
`,
    gitignore: `# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files (never commit real secrets)
.env
.env.local
.env.dev
.env*.local

# typescript
*.tsbuildinfo
`,
    files: {
      'src/constants/api_keys.ts': `export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
export const USE_MOCK_API = false;
`,
      'src/constants/theme.ts': `import { Platform } from 'react-native';

export const Colors = {
  light: { text: '#2C3E63', background: '#fff', primary: '#007AFF', error: '#E74C3C', success: '#45B98F' },
  dark: { text: '#ECEDEE', background: '#151718', primary: '#0A84FF', error: '#FF453A', success: '#45B98F' },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', helvetica: 'Helvetica' },
  default: { sans: 'normal', helvetica: 'Helvetica' },
  web: { sans: "system-ui, sans-serif", helvetica: 'Helvetica' },
});
`,
      'src/helpers/Logger.ts': `export const Log = (...args: unknown[]) => {
  if (__DEV__) console.log('[App]', ...args);
};
`,
      'src/helpers/localStorage.ts': `import { MMKV } from 'react-native-mmkv';

export enum StoredKeys {
  firstOpen = 'firstOpen',
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
  user = 'user',
}

export const storage = new MMKV({ id: 'app-storage' });

export const localStorage = {
  setItem: (key: StoredKeys, value: string) => storage.set(key, value),
  getItem: (key: StoredKeys) => storage.getString(key) ?? null,
  removeItem: (key: StoredKeys) => storage.delete(key),
  setJSON: (key: StoredKeys, value: unknown) => { try { storage.set(key, JSON.stringify(value)); } catch { /* no-op */ } },
  getJSON: <T>(key: StoredKeys): T | null => { try { const s = storage.getString(key); return s ? JSON.parse(s) as T : null; } catch { return null; } },
};
`,
      'src/helpers/ApiRequestHandler.ts': `import { API_URL } from '@/constants/api_keys';
import axios, { AxiosRequestConfig } from 'axios';
import { StoredKeys, localStorage } from './localStorage';

const instance = axios.create({ baseURL: API_URL });
instance.interceptors.request.use((c) => {
  const t = localStorage.getItem(StoredKeys.accessToken);
  if (t) c.headers['access-token'] = t;
  return c;
}, (e) => Promise.reject(e));

instance.interceptors.response.use((r) => r, async (e) => {
  const orig = e.config;
  if (e.response?.data?.Msg === 'jwt expired' && !orig._retry) {
    orig._retry = true;
    try {
      const res = await axios.post(API_URL + '/auth/refresh-token', { refreshToken: localStorage.getItem(StoredKeys.refreshToken) });
      if (res.status === 200 && res.data?.data) {
        localStorage.setItem(StoredKeys.accessToken, res.data.data.accessToken);
        localStorage.setItem(StoredKeys.refreshToken, res.data.data.refreshToken);
        orig.headers['access-token'] = res.data.data.accessToken;
        return instance(orig);
      }
    } catch { /* ignore */ }
  }
  return Promise.reject(e);
});

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const res = await instance(config);
  return res.data;
};
`,
      'src/interfaces/index.ts': `export interface GenericData<T> { data: T; }
export interface AuthSuccessResponse { accessToken: string; refreshToken: string; }
`,
    },
  }),
};

async function createProject(type, projectName) {
  const projectPath = path.join(process.cwd(), 'app', projectName);

  // Check if project already exists
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Error: Project "${projectName}" already exists!`);
    process.exit(1);
  }

  console.log(`\n🚀 Creating ${type} project: ${projectName}...\n`);

  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });

  const template = templates[type](projectName);

  try {
    // Create package.json
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(template.packageJson, null, 2)
    );
    console.log('✅ Created package.json');

    // Create tsconfig.json
    fs.writeFileSync(
      path.join(projectPath, 'tsconfig.json'),
      JSON.stringify(template.tsconfig, null, 2)
    );
    console.log('✅ Created tsconfig.json');

    // Type-specific setup
    if (type === 'server') {
      fs.writeFileSync(path.join(projectPath, 'index.ts'), template.indexFile);
      console.log('✅ Created index.ts');
      fs.writeFileSync(path.join(projectPath, '.env.example'), template.envExample);
      console.log('✅ Created .env.example');
      fs.writeFileSync(path.join(projectPath, 'eslint.config.mjs'), template.eslintConfig);
      console.log('✅ Created eslint.config.mjs');
      fs.writeFileSync(path.join(projectPath, 'docker-compose.yml'), template.dockerCompose);
      console.log('✅ Created docker-compose.yml');
      fs.writeFileSync(path.join(projectPath, 'prisma.config.js'), template.prismaConfig);
      console.log('✅ Created prisma.config.js');
      if (template.files) {
        for (const [relPath, content] of Object.entries(template.files)) {
          const full = path.join(projectPath, relPath);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          fs.writeFileSync(full, content);
        }
        console.log('✅ Created plugins, utils, db, middleware, helpers, routes, schemas, types, prisma, scripts');
      }
    } else if (type === 'web') {
      fs.writeFileSync(path.join(projectPath, 'next.config.ts'), template.nextConfig);
      console.log('✅ Created next.config.ts');
      fs.writeFileSync(path.join(projectPath, '.eslintrc.json'), template.eslintConfig);
      console.log('✅ Created .eslintrc.json');
      fs.writeFileSync(path.join(projectPath, '.gitignore'), template.gitignore);
      fs.writeFileSync(path.join(projectPath, 'postcss.config.mjs'), template.postcssConfig);
      fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), template.tailwindConfig);
      const appDir = path.join(projectPath, 'src', 'app');
      fs.mkdirSync(appDir, { recursive: true });
      fs.writeFileSync(path.join(appDir, 'layout.tsx'), template.appLayout);
      fs.writeFileSync(path.join(appDir, 'page.tsx'), template.appPage);
      fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'public', 'icons'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'public', 'images'), { recursive: true });
      if (template.files) {
        for (const [relPath, content] of Object.entries(template.files)) {
          const full = path.join(projectPath, relPath);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          fs.writeFileSync(full, content);
        }
        console.log('✅ Created helpers, common, theme, interfaces, styles');
      }
    } else if (type === 'admin') {
      fs.writeFileSync(path.join(projectPath, 'vite.config.ts'), template.viteConfig);
      fs.writeFileSync(path.join(projectPath, 'eslint.config.mjs'), template.eslintConfig);
      fs.writeFileSync(path.join(projectPath, '.gitignore'), template.gitignore);
      fs.writeFileSync(path.join(projectPath, 'postcss.config.cjs'), template.postcssConfig);
      fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), template.tailwindConfig);
      fs.writeFileSync(path.join(projectPath, 'index.html'), template.indexHtml);
      const srcDir = path.join(projectPath, 'src');
      fs.mkdirSync(srcDir, { recursive: true });
      fs.writeFileSync(path.join(srcDir, 'main.tsx'), template.mainTsx);
      fs.writeFileSync(path.join(srcDir, 'App.tsx'), template.appTsx);
      fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'public', 'images'), { recursive: true });
      if (template.files) {
        for (const [relPath, content] of Object.entries(template.files)) {
          const full = path.join(projectPath, relPath);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          fs.writeFileSync(full, content);
        }
        console.log('✅ Created helpers, common, theme, app pages, styles');
      }
    } else if (type === 'web-app') {
      // Create vite.config.ts
      fs.writeFileSync(
        path.join(projectPath, 'vite.config.ts'),
        template.viteConfig
      );
      console.log('✅ Created vite.config.ts');

      // Create eslint.config.js
      fs.writeFileSync(
        path.join(projectPath, 'eslint.config.js'),
        template.eslintConfig
      );
      console.log('✅ Created eslint.config.js');

      // Create .gitignore
      fs.writeFileSync(path.join(projectPath, '.gitignore'), template.gitignore);
      console.log('✅ Created .gitignore');

      // Create tailwind.config.js
      fs.writeFileSync(
        path.join(projectPath, 'tailwind.config.js'),
        template.tailwindConfig
      );
      console.log('✅ Created tailwind.config.js');

      // Create postcss.config.js
      fs.writeFileSync(
        path.join(projectPath, 'postcss.config.js'),
        template.postcssConfig
      );
      console.log('✅ Created postcss.config.js');

      // Create index.html
      fs.writeFileSync(path.join(projectPath, 'index.html'), template.indexHtml);
      console.log('✅ Created index.html');

      // Create src directory
      const srcDir = path.join(projectPath, 'src');
      fs.mkdirSync(srcDir, { recursive: true });

      // Create main.tsx
      fs.writeFileSync(path.join(srcDir, 'main.tsx'), template.mainTsx);
      console.log('✅ Created src/main.tsx');

      // Create App.tsx
      fs.writeFileSync(path.join(srcDir, 'App.tsx'), template.appTsx);
      console.log('✅ Created src/App.tsx');

      // Create public directory
      fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });

      if (template.files) {
        for (const [relPath, content] of Object.entries(template.files)) {
          const full = path.join(projectPath, relPath);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          fs.writeFileSync(full, content);
        }
        console.log('✅ Created helpers, common, styles');
      }
    } else if (type === 'mobile') {
      // Create app.json
      fs.writeFileSync(
        path.join(projectPath, 'app.json'),
        JSON.stringify(template.appJson, null, 2)
      );
      console.log('✅ Created app.json');

      // Create .gitignore
      fs.writeFileSync(path.join(projectPath, '.gitignore'), template.gitignore);
      console.log('✅ Created .gitignore');

      // Create app directory
      const appDir = path.join(projectPath, 'app');
      fs.mkdirSync(appDir, { recursive: true });

      // Create _layout.tsx
      fs.writeFileSync(path.join(appDir, '_layout.tsx'), template.appLayout);
      console.log('✅ Created app/_layout.tsx');

      // Create index.tsx
      fs.writeFileSync(path.join(appDir, 'index.tsx'), template.appIndex);
      console.log('✅ Created app/index.tsx');

      // Create assets directory
      fs.mkdirSync(path.join(projectPath, 'assets'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src', 'assets', 'images'), { recursive: true });

      if (template.files) {
        for (const [relPath, content] of Object.entries(template.files)) {
          const full = path.join(projectPath, relPath);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          fs.writeFileSync(full, content);
        }
        console.log('✅ Created src/constants, src/helpers, src/interfaces');
      }
    }

    console.log('\n✨ Project structure created successfully!\n');

    // Update root package.json
    updateRootPackageJson(type, projectName);

    console.log('\n📦 Installing dependencies...\n');
    console.log(
      '   Run: npm install (this will install dependencies for all workspaces)\n'
    );

    console.log('🎉 Done! Your new project is ready.\n');
    console.log(`   cd app/${projectName}`);

    if (type === 'server') {
      console.log(`   npm run dev (or from root: npm run dev:${projectName})\n`);
    } else if (type === 'web') {
      console.log(`   npm run dev (or from root: npm run dev:${projectName})\n`);
    } else if (type === 'web-app') {
      console.log(`   npm run dev (or from root: npm run dev:${projectName})\n`);
    } else if (type === 'admin') {
      console.log(`   npm run dev (or from root: npm run dev:${projectName})\n`);
    } else if (type === 'mobile') {
      console.log(`   npm run dev (or from root: npm run dev:${projectName})\n`);
    }
  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    // Cleanup on error
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

function updateRootPackageJson(type, projectName) {
  const rootPackagePath = path.join(process.cwd(), 'package.json');
  const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));

  // Add scripts based on type
  const scriptPrefix = projectName.replace(/-/g, ':');

  if (type === 'server') {
    rootPackage.scripts[`dev:${projectName}`] = `npm -w app/${projectName} run dev`;
    rootPackage.scripts[`build:${projectName}`] = `npm -w app/${projectName} run build`;
    rootPackage.scripts[`lint:${projectName}`] = `npm -w app/${projectName} run lint:fix`;
  } else if (type === 'web' || type === 'web-app' || type === 'admin') {
    rootPackage.scripts[`dev:${projectName}`] = `npm -w app/${projectName} run dev`;
    rootPackage.scripts[`build:${projectName}`] = `npm -w app/${projectName} run build`;
    rootPackage.scripts[`lint:${projectName}`] = `npm -w app/${projectName} run lint:fix`;
  } else if (type === 'mobile') {
    rootPackage.scripts[`dev:${projectName}`] = `npm -w app/${projectName} run dev`;
    rootPackage.scripts[`${projectName}:start`] = `npm -w app/${projectName} run start`;
    rootPackage.scripts[`${projectName}:android`] = `npm -w app/${projectName} run android`;
    rootPackage.scripts[`${projectName}:ios`] = `npm -w app/${projectName} run ios`;
    rootPackage.scripts[`lint:${projectName}`] = `npm -w app/${projectName} run lint:fix`;
  }

  // Add lint-staged configuration
  const lintStagedKey = `app/${projectName}/**/*.{ts,tsx,js,jsx}`;
  if (!rootPackage['lint-staged']) {
    rootPackage['lint-staged'] = {};
  }

  if (type === 'mobile') {
    rootPackage['lint-staged'][lintStagedKey] = [
      `npm -w app/${projectName} run lint:fix`,
    ];
  } else if (type === 'server') {
    rootPackage['lint-staged'][lintStagedKey] = [
      `npm -w app/${projectName} exec -- eslint --config eslint.config.mjs --fix`,
      `npm -w app/${projectName} exec -- prettier --write`,
    ];
  } else if (type === 'web-app' || type === 'admin') {
    rootPackage['lint-staged'][lintStagedKey] = [
      `npm -w app/${projectName} exec -- eslint --config eslint.config.js --fix`,
      `npm -w app/${projectName} exec -- prettier --write`,
    ];
  } else if (type === 'web') {
    rootPackage['lint-staged'][lintStagedKey] = [
      `npm -w app/${projectName} exec -- eslint --fix`,
      `npm -w app/${projectName} exec -- prettier --write`,
    ];
  }

  fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n');
  console.log('✅ Updated root package.json with new scripts');
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   📦 Monorepo Project Generator                   ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Show project types
  console.log('Select project type:\n');
  Object.entries(projectTypes).forEach(([key, { name, description }]) => {
    console.log(`  ${key}. ${description}`);
  });
  console.log('');

  // Get user input
  const typeChoice = await question('Enter project type (1-5): ');
  const selectedType = projectTypes[typeChoice.trim()];

  if (!selectedType) {
    console.error('❌ Invalid project type selected!');
    rl.close();
    process.exit(1);
  }

  const projectName = await question(
    `\nEnter project name (e.g., my-${selectedType.name}): `
  );

  if (!projectName || projectName.trim() === '') {
    console.error('❌ Project name cannot be empty!');
    rl.close();
    process.exit(1);
  }

  // Validate project name
  const sanitizedName = projectName.trim().toLowerCase().replace(/\s+/g, '-');
  if (!/^[a-z0-9-]+$/.test(sanitizedName)) {
    console.error(
      '❌ Project name can only contain lowercase letters, numbers, and hyphens!'
    );
    rl.close();
    process.exit(1);
  }

  const confirm = await question(
    `\n📋 Summary:\n   Type: ${selectedType.description}\n   Name: ${sanitizedName}\n   Path: app/${sanitizedName}\n\nProceed? (y/n): `
  );

  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('Cancelled.');
    rl.close();
    process.exit(0);
  }

  rl.close();

  await createProject(selectedType.name, sanitizedName);
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
