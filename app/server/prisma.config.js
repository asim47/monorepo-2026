require('dotenv').config();

// Build DATABASE_URL from env vars if not provided
const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'nodejs_boilerplate'}?schema=public`;

module.exports = {
  datasource: {
    url: databaseUrl,
  },
};
