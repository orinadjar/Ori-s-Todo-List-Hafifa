import { DbModule } from './db/db.module';
import { TodosModule } from './todos/todos.module';
import { envSchema } from './common/pipes/zodEnvValidation.pipe';

import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.dev' : undefined,
      validate: (config) => {
        return envSchema.parse(config);
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        const redisStore = new KeyvRedis(
          `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        );

        const keyv = new Keyv({
          store: redisStore,
          namespace: 'todos',
        });

        return {
          stores: [keyv],
        };
      },
    }),
    ScheduleModule.forRoot(),
    DbModule,
    TodosModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
