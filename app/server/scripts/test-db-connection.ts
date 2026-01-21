import { Client } from 'pg';
import { env } from '../utils/env';

async function testConnection() {
  const client = new Client({
    host: env.POSTGRES.HOST,
    port: env.POSTGRES.PORT,
    user: env.POSTGRES.USER,
    password: env.POSTGRES.PASSWORD,
    database: env.POSTGRES.DB,
  });

  try {
    // eslint-disable-next-line no-console
    console.log('Attempting to connect to PostgreSQL...');
    // eslint-disable-next-line no-console
    console.log(`Host: ${env.POSTGRES.HOST}:${env.POSTGRES.PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Database: ${env.POSTGRES.DB}`);
    // eslint-disable-next-line no-console
    console.log(`User: ${env.POSTGRES.USER}`);

    await client.connect();
    // eslint-disable-next-line no-console
    console.log('✅ Successfully connected to PostgreSQL!');

    const result = await client.query('SELECT version()');
    // eslint-disable-next-line no-console
    console.log('\nPostgreSQL Version:');
    // eslint-disable-next-line no-console
    console.log(result.rows[0].version);

    const dbResult = await client.query('SELECT current_database()');
    // eslint-disable-next-line no-console
    console.log(`\nCurrent Database: ${dbResult.rows[0].current_database}`);

    await client.end();
    // eslint-disable-next-line no-console
    console.log('\n✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to connect to PostgreSQL:');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  }
}

testConnection();
