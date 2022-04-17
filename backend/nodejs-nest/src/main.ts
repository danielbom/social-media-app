import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { env } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: env.app.cors.split(';'),
    credentials: true,
  });
  await app.listen(env.app.port);
}
bootstrap();
