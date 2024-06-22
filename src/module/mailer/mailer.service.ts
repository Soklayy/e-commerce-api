import { Inject, Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { MODULE_OPTIONS_TOKEN, MailerModuleOption } from './mailer.interface';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly option: MailerModuleOption,
  ) {
    this.transporter = createTransport(option.transport, option.defaults);
  }

  async sendEmail(mailOptions: MailOptions) {
    await this.transporter.sendMail(mailOptions);
  }
}
