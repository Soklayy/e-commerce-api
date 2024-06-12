import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigurableModuleClass } from './mailer.interface';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule extends ConfigurableModuleClass {}
