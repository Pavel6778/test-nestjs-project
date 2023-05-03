import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const logger = app.get(Logger);

  await app.listen(3000);
  logger.log(`🚀 Listening on url: ${await app.getUrl()}`);
};

bootstrap();
