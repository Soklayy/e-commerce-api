import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './configs/swagger.config';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const APP_ENV = configService.get<string>('APP_ENV');

  app.enableCors({
    origin: [
      configService.get<string>('FRONTEND_URI'),
      configService.get<string>('ADMIN_URI'),
    ],
  });

  app.use(bodyParser.json());
  app.use(cookieParser(configService.get('COOKIE_SECRET') || 'COOKIE'));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  //swagger
  if (APP_ENV === 'dev' || APP_ENV === 'test') {
    swaggerConfig(app);
  }

  const port = Number(configService.get('PORT')) || 3000;

  //for class-validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  //start app
  app.listen(port).then(() => console.log(`app run on port http://localhost:${port} `));
}

bootstrap();