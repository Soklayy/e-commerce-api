import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(readonly configService: ConfigService) {
    // super({
    //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   passReqToCallback: true,
    //   secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
    // });
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.signedCookies['auth._refresh_token.local'];
        },
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(request: Request, payload: any) {
    // const refreshToken = request?.headers?.authorization?.split(' ')[1];
    const refreshToken = request?.signedCookies['auth._refresh_token.local'];
    return { ...payload, refreshToken };
  }
}
