import { ConfigService } from '@nestjs/config';

export const firebaseConfig = (configService: ConfigService) => {
  return {
    apiKey: configService.get<string>('API_KEY'),
    authDomain: configService.get<string>('AUTH_DOMAIN'),
    projectId: configService.get<string>('PROJECT_ID'),
    storageBucket: configService.get<string>('STORAGE_BUCKET'),
    messagingSenderId: configService.get<string>('MESSAGING_SENDER_ID'),
    appId: configService.get<string>('APP_ID'),
    measurementId: configService.get<string>('MEASUOREMENT_ID'),
  };
};
