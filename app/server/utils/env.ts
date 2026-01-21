import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

export const env = {
  // Server
  PORT: process.env.PORT || '8000',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // AWS
  AWS: {
    REGION: process.env.AWS_REGION || '',
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
    CLOUDFRONT_DOMAIN: process.env.AWS_CLOUDFRONT_DOMAIN || '',
  },

  // Brevo (Email)
  BREVO: {
    API_KEY: process.env.BREVO_API_KEY || '',
    API_URL: process.env.BREVO_API_URL || 'https://api.brevo.com/v3',
    FROM_EMAIL: process.env.BREVO_FROM_EMAIL || 'noreply@example.com',
    FROM_NAME: process.env.BREVO_FROM_NAME || 'API',
  },

  // PostgreSQL Database
  POSTGRES: {
    USER: process.env.POSTGRES_USER || 'postgres',
    PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
    DB: process.env.POSTGRES_DB || 'nodejs_boilerplate',
    HOST: process.env.POSTGRES_HOST || 'localhost',
    PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  },

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
} as const;

// Set DATABASE_URL for Prisma if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `postgresql://${env.POSTGRES.USER}:${env.POSTGRES.PASSWORD}@${env.POSTGRES.HOST}:${env.POSTGRES.PORT}/${env.POSTGRES.DB}?schema=public`;
}
