import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema';
import * as pg from 'pg';

export const DATABASE_CONNECTION = 'database_connection';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const { Pool } = pg;

        const poolConfig: pg.PoolConfig = {
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        };

        const pool = new Pool(poolConfig);

        return drizzle(pool, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DbModule {}
