import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { env } from './environment';
import helmet from 'helmet';
import path from 'path';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: env.app.cors.split(';'),
      credentials: true,
    },
  });
  app.use(
    helmet({
      contentSecurityPolicy: !env.app.isDevelopment,
    }),
  );

  if (env.app.isDevelopment) {
    app.useStaticAssets(path.join(__dirname, '..', 'static'), {
      prefix: '/public',
    });
  }

  await app.listen(env.app.port, async () => {
    logger.log(`Server started on port ${env.app.port}`);
  });
}
bootstrap();
