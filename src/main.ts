import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './configs/swagger.config';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const APP_ENV = configService.get<string>('APP_ENV');

  // app.enableCors({
  //   origin: [
  //     configService.get<string>('FRONTEND_URI'),
  //     configService.get<string>('ADMIN_URI'),
  //   ],
  // });
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL'),
      configService.get('ADMIN_URL'),
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Forwarded-Proto',
      'Access-Control-Allow-Origin',
    ],
    exposedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Forwarded-Proto',
      'Access-Control-Allow-Origin',
    ],
  });

  if (APP_ENV !== 'dev') {
    app.set('trust proxy', 1);
  }

  app.use(bodyParser.json());
  app.use(cookieParser(configService.get('COOKIE_SECRET') || 'COOKIE'));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  //swagger
  if (APP_ENV === 'dev' || APP_ENV === 'test') {
    swaggerConfig(app);
  }

  // ...
  const bot = app.get(getBotToken());
  app.use(bot.webhookCallback('/hook'));

  const port = process.env.PORT || Number(configService.get('PORT')) || 3001;

  //for class-validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  //start app
  app
    .listen(port)
    .then(() => console.log(`app run on port http://localhost:${port}`));
}

bootstrap();

