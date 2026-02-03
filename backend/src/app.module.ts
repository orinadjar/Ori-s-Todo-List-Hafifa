import { DbModule } from './db/db.module';
import { TodosModule } from './todos/todos.module';

import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  CacheModule.registerAsync({
    isGlobal: true,
    useFactory: async () => {
      const redisStore = new KeyvRedis(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

      const keyv = new Keyv({
        store: redisStore,
        namespace: 'todos',
      });

      return {
        stores: [
          keyv
        ]
      }
    },
  }),
  ScheduleModule.forRoot(),
    DbModule,
    TodosModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule { }
