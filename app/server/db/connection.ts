import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Build DATABASE_URL from env vars if not provided
const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${env.POSTGRES.USER}:${env.POSTGRES.PASSWORD}@${env.POSTGRES.HOST}:${env.POSTGRES.PORT}/${env.POSTGRES.DB}?schema=public`;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Test connection on startup
prisma
  .$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error: unknown) => {
    logger.error('Failed to connect to database', error);
    process.exit(1);
  });

export default prisma;
