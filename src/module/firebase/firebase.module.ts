import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigurableModuleClass } from './firebase.interface';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule extends ConfigurableModuleClass {}
