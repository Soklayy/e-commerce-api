import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export async function typeOrmConfig(
  configService: ConfigService,
): Promise<TypeOrmModuleAsyncOptions> {
  const APP_ENV = configService.get<string>('APP_ENV');
  if (APP_ENV === 'dev') {
    return {
      //@ts-ignore
      type: configService.get<string>('DB_TYPE'),
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      synchronize: configService.get<string>('DB_SYNC') !== 'false',
      migrationsRun: true,
      entities: [join(__dirname, '../**/**.entity{.js,.ts}')],
      migrations: [join(__dirname, '../migrations/**{.ts,.js}')],
      cli: {
        migrationsDir: 'src/migrations',
      },
    };
  } else if (APP_ENV === 'prod' || APP_ENV === 'test') {
    return {
      //@ts-ignore
      type: configService.get<string>('DB_TYPE'),
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [__dirname + './../**/**.entity{.ts,.js}'],
      migrations: [join(__dirname, '../migrations/**{.ts,.js}')],
      synchronize: false,
      migrationsRun: true,
      ssl: true,
      retryAttempts: 20,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }
}
