import { ConfigService } from '@nestjs/config';

export const mailerConfig = (config: ConfigService) => ({
  transport: {
    service: config.get<string>('EMAIL_SERVICE'),
    host: config.get('EMAIL_HOST'),
    port: +config.get('EMAIL_PORT'),
    secure: true,
    auth: {
      user: config.get('EMAIL_USER'),
      pass: config.get('EMAIL_PASSWORD'),
    },
    
  },
});
