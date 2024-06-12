import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from 'src/commons/strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from 'src/commons/strategies/refresh-token.strategy';
import { ForgotEntity } from './entities/forgot.entity';
import EmailEvent from './events/email.event';

@Module({
  imports: [
    PassportModule,
    UserModule,
    TypeOrmModule.forFeature([User, ForgotEntity]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, RefreshTokenStrategy, AuthService, EmailEvent],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
