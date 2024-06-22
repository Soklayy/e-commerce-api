import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ForgotEntity } from './entities/forgot.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ForgotEntity)
    private readonly forgotRepo: Repository<ForgotEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async registerUser(dto: RegisterDto) {
    const user = await this.userRepo.save(this.userRepo.create(dto));
    ('INSERT TO USERS ');
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    this.eventEmitter.emit('user.registered', {
      fullName: user.firstname + ' ' + user.lastname,
      email: user.email,
    });
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user || !compareSync(dto.password, user.password))
      throw new BadRequestException('Invalid login credential!');

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.userRepo.update(userId, { refreshToken: null });
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException();
    }
    this.eventEmitter.emit('user.reset-password', {
      fullName: user.firstname + ' ' + user.lastname,
      email: email,
      timestamp: Date.now(),
    });
    return email;
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const user = await this.userRepo.findOneBy({ email: dto.email });
      if (!user) {
        throw new BadRequestException(`User with this email doesn't exist!`);
      }

      const forgot = await this.forgotRepo.findOneBy({
        verificationCode: dto.verificationCode,
      });

      if (!forgot) {
        throw new BadRequestException(`Verification Code Doesn't Exist`);
      }

      if (forgot.done) {
        throw new BadRequestException(`Verification Code already used!`);
      }

      const payload = this.jwtService.verify(forgot.token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (payload.email !== user.email) {
        throw new BadRequestException(`Mismatched Email!`);
      }

      this.userRepo.update(user.id, { password: dto.password });
      this.forgotRepo.update(forgot.id, { done: true });

      return { message: 'Password reset' };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Verification Code expired!');
      }
      throw new BadRequestException('Invalid Verification Code!');
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw new ForbiddenException('Access Denied');
      const refreshTokenMatches = compareSync(refreshToken, user?.refreshToken);
      if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
      const tokens = await this.getTokens(user.id);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      console.log('Refresh token error: ', error.message);
      throw new ForbiddenException('Access Denied');
    }
  }

  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: +this.configService.get('JWT_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        },
      ),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = hashSync(refreshToken, genSaltSync(10));
    await this.userRepo.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
