import { ConfigurableModuleBuilder } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface MailerModuleOption {
  transport: SMTPTransport | SMTPTransport.Options | string;
  defaults?: SMTPTransport.Options;
}
export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<MailerModuleOption>()
  .setClassMethodName('forRoot')
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
