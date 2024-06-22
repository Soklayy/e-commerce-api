import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { ThrottlerStorageMongoService } from 'nestjs-throttler-storage-mongo';
// import { ThrottlerStorageMongoService } from 'nestjs-throttler-storage-mongo';
@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions():
    | ThrottlerModuleOptions
    | Promise<ThrottlerModuleOptions> {
    // const redisUrl = this.configService.get('REDIS_URL');
    // const cache_host_port = redisUrl.toString().split('@')[1];
    // const cache_password_head = redisUrl.toString().split('@')[0];
    // const cache_password = cache_password_head.split(':')[2];
    // const cache_host = cache_host_port.split(':')[0];
    // const cache_port = cache_host_port.split(':')[1];

    // const redisObj = {
    //   host: cache_host,
    //   port: cache_port,
    //   password: cache_password,
    //   // tls: {
    //   //     servername: cache_host,
    //   //     rejectUnauthorized: false,
    //   // },
    // };

    return {
      throttlers: [
        {
          ttl: this.configService.get('THROTTLE_TTL'),
          limit: this.configService.get('THROTTLE_LIMIT'),
        },
      ],

      // storage: {
      //   async increment(key, ttl) {
      //     const expire = new Date();
      //     const implementsExpire = Date.now() + ttl * 1000
      //     if (expire.getTime() - Date.now() < 0) {
      //       // throw new ThrottlerException()
      //     }
      //     return {
      //       totalHits: 59,
      //       timeToExpire: (expire.getTime() - Date.now())/ 1000,
      //     }
      //   },
      // },

      // storage: new ThrottlerStorageMongoService(this.configService.get<string>('MONGODB_URL')),
    };
  }
}
