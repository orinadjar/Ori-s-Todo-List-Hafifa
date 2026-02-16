import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { Client } from 'pg';
import * as schema from '../../../db/schema';

export interface TestDbHelper {
  db: NodePgDatabase<typeof schema>;
  cleanup: () => Promise<void>;
}

export const setupTestDb = async (): Promise<TestDbHelper> => {
  const DB_CONFIG: object = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  };

  const dbName = `testDb_${Math.floor(Math.random() * 10000)}`;

  const mainClient = new Client({ ...DB_CONFIG, database: 'postgres' });
  await mainClient.connect();
  await mainClient.query(`CREATE DATABASE "${dbName}"`);
  await mainClient.end();

  const testClient = new Client({ ...DB_CONFIG, database: dbName });
  await testClient.connect();

  const db = drizzle(testClient, { schema });

  await db.execute('CREATE EXTENSION IF NOT EXISTS postgis');

  await migrate(db, { migrationsFolder: './drizzle' });

  const cleanup = async () => {
    await testClient.end();

    const cleanupClient = new Client({ ...DB_CONFIG, database: 'postgres' });
    await cleanupClient.connect();
    await cleanupClient.query(`DROP DATABASE "${dbName}"`);
    await cleanupClient.end();
  };

  return { db, cleanup };
};
