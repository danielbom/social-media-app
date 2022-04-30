import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { env } from './environment';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: env.app.cors.split(';'),
      credentials: true,
    },
  });
  app.use(helmet());
  await app.listen(env.app.port);
}
bootstrap();
