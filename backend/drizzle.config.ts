import { defineConfig } from 'drizzle-kit';
import { loadEnvFile } from 'node:process';

loadEnvFile('.env.dev');

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
