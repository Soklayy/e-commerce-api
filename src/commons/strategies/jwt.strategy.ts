import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from 'src/module/user/entities/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const timeDiff = payload.exp - payload.iat;

    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        dateOfbirth: true,
        role: true,
        profileImage: {
          id: true,
          url: true,
        },
      },
      loadEagerRelations: false,
      relations: {
        profileImage: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
