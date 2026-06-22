import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // This is the critical missing piece
  app.enableCors({
    origin: '*', 
  });

  await app.listen(3001);
}
bootstrap();