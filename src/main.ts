import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app/app.module';
import { AuthGuard } from './app/auth/guards';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting up validation,Auth Guards and response interceptors
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  app.useGlobalPipes(new ValidationPipe({}));
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // API Documentation using swagger and scalar
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Re-Forms')
    .setDescription('API for Re-Forms')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  app.use(
    '/api',
    apiReference({
      theme:'default',
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(5000);
}
bootstrap();
