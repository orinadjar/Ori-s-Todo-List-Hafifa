import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

export const DATABASE_CONNECTION = 'database_connection';

@Global()
@Module({
    providers: [
        { 
            provide: DATABASE_CONNECTION,
            useFactory: (configService: ConfigService) => {
                const pool = new Pool({
                    connectionString: configService.getOrThrow('DATABASE_URL'),
                })
                return drizzle(pool, { schema });
            },
            inject: [ConfigService],
        },
    ],
    exports: [DATABASE_CONNECTION],
})

export class DbModule {};