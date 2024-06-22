import { Module } from '@nestjs/common';
import { AbaPaywayService } from './aba-payway.service';
import {
  ConfigurableModuleClass,
} from './aba-payway.interface';

@Module({
  providers: [AbaPaywayService],
  exports: [AbaPaywayService],
})
export class AbaPaywayModule extends ConfigurableModuleClass {}
