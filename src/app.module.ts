import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TelegrafModule } from 'nestjs-telegraf';
import { FirebaseModule } from './module/firebase';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/category/category.module';
import { ProductModule } from './module/product/product.module';
import { OrderModule } from './module/order/order.module';
import { UserOwnManagementModule } from './module/user-own-management/user-own-management.module';
import { UserModule } from './module/user/user.module';
import { MailerModule } from './module/mailer';
import { UniqueValidator, ExistValidator } from './commons/validations';
import {
  ThrottlerConfigService,
  firebaseConfig,
  mailerConfig,
  typeOrmConfig,
} from './configs';
import {
  JwtAuthGuard,
  RolesGuard,
  ThrottlerBehindProxyGuard,
} from './commons/guard';
import { BrandModule } from './module/brand/brand.module';
import { AbaPaywayModule } from './module/aba-payway';
import { ProductOptionModule } from './module/product-option/product-option.module';
import { BotModule } from './module/bot/bot.module';
import { session } from 'telegraf';
import { CartsModule } from './module/cart/carts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailerConfig,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
        include: [BotModule],
        middlewares: [session()],
        launch: {
          dropPendingUpdates: true,
          onlyFirstMatch: true,
        },
        onError: (err) => {
          if (err.response?.error_code === 409) {
            console.error(`Bot instance is already running. Exiting...`);
            process.exit(1);
          } else {
            console.error('Telegram bot error:', err);
          }
        },
      }),
    }),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: firebaseConfig,
    }),
    AbaPaywayModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        baseUrl: config.get<string>('PAYWAY_BASE_URL'),
        merchantId: config.get<string>('PAYWAY_MERCHANT_ID'),
        apiKey: config.get<string>('PAYWAY_PUBLIC_KEY'),
        returnLink: config.get<string>('PAYWAY_RETURN_LINK')
      }),
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    UserOwnManagementModule,
    BrandModule,
    ProductOptionModule,
    BotModule,
    CartsModule,
  ],
  providers: [
    UniqueValidator,
    ExistValidator,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule { }
