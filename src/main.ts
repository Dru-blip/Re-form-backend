import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app/app.module';
import { AuthGuard } from './app/auth/guards';
import { ResponseInterceptor } from './interceptors/response.interceptor';

/**
 * Starts the NestJS application.
 *
 * - Creates the NestJS application with {@link AppModule}
 * - Sets up validation with {@link ValidationPipe}
 * - Sets up auth guards with {@link AuthGuard}
 * - Sets up response interceptors with {@link ResponseInterceptor}
 * - Configures the API documentation with Swagger and Scalar
 * - Enables CORS with the origin set to '*'
 * - Starts listening on port 5000
 */
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
      theme: 'default',
      spec: {
        content: document,
      },
    }),
  );

  app.enableCors({
    origin: '*',
  });

  await app.listen(5000);
}

bootstrap();
