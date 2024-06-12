import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { typeOrmConfig } from './configs/typeorm.config';
import { UniqueValidator } from './commons/validations/is-unigue.validation';
import { FirebaseModule } from './module/firebase/firebase.module';
import { JwtAuthGuard } from './commons/guard/jwt-auth.guard';
import { ExistValidator } from './commons/validations/is-exists.validattion';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/category/category.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';
import { OrderModule } from './module/order/order.module';
import { PaymentModule } from './module/payment/payment.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './commons/guard/throttler-behind-proxy.guard';
import { ThrottlerConfigService } from './configs/throttler.config';
import { UserOwnManagementModule } from './module/user-own-management/user-own-management.module';
import { TelegramBotModule } from './module/telegram-bot';
import { mailerConfig } from './configs/mailler.config';
import { RolesGuard } from './commons/guard/roles.guard';
import { UserModule } from './module/user/user.module';
import { MailerModule } from './module/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService]
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    TelegramBotModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({ token: config.get('BOT_TOKEN') }),
      inject: [ConfigService]
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailerConfig
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    FirebaseModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    UserOwnManagementModule,
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
  ],
})
export class AppModule { }
