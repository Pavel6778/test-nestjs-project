import {
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '../redis';
import { REDIS } from '../redis';
import { RedisClientType } from 'redis';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthModule } from '../auth/auth.module';
import { AppLoggerMiddleware } from "./middlewares/app-logger.middleware";

@Module({
  // TODO add config service
  imports: [AuthModule, RedisModule],
  providers: [AppService, Logger],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  constructor(@Inject(REDIS) private readonly redis: RedisClientType) {}
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({
            client: this.redis,
            logErrors: true,
          }),
          saveUninitialized: false,
          // TODO use secret value from config service
          secret: 'mysecret',
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
          },
        }),
        passport.initialize(),
        passport.session(),
        AppLoggerMiddleware,
      )
      .forRoutes('*');
  }
}
