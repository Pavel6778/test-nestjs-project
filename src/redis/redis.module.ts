import { Module } from '@nestjs/common';
import { REDIS } from './redis.constants';
import { createClient } from 'redis';

@Module({
  providers: [
    {
      provide: REDIS,
      useValue: createClient({
        // TODO use host and port value from config service
        url: `redis://redis:6379`,
      }),
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
