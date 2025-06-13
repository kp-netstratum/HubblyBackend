import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*', // Or replace with your frontend origin like 'http://localhost:3000'
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true, // Only if you send cookies/auth headers
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// test the data inside.