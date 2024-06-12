import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function JwtConfig(config: ConfigService) {
  return {
    secret: config.get<string>('JWT_SECRET_KEY'),
    signOptions: {
      expiresIn: config.get('JWT_EXPIRATION'),
    },
  } as JwtModuleOptions;
}
