import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotEntity } from '../entities/forgot.entity';
import { MailerService } from 'src/module/mailer';
import { Verification } from '../entities/verification.entity';

@Injectable()
export default class EmailEvent {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(ForgotEntity)
    private readonly forgotRepository: Repository<ForgotEntity>,
    @InjectRepository(Verification)
    private readonly verifieRepo: Repository<Verification>,
    private mailerSevice: MailerService,
  ) {}

  @OnEvent('user.registered', { async: true })
  async verifyEmail(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      ),
    });

    const verifiCode = new Date().getTime().toString(36);

    this.verifieRepo.save(
      this.verifieRepo.create({
        email: payload.email,
        token: token,
        code: verifiCode,
      }),
    );

    this.mailerSevice.sendEmail({
      from: `${this.configService.get('EMAIL_USER')}`,
      to: payload?.email,
      subject: `Hello ${payload?.fullName}`,
      text: `Code for verifie your email: <h1>${verifiCode}</h1>`,
    });
  }

  @OnEvent('user.reset-password', { async: true })
  async resetPassword(payload: any) {
    const verifiCode = new Date().getTime().toString(36);

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      ),
    });

    this.forgotRepository.save(
      this.forgotRepository.create({
        email: payload.email,
        token: token,
        verificationCode: verifiCode,
      }),
    );

    this.mailerSevice.sendEmail({
      from: `${this.configService.get('EMAIL_USER')}`,
      to: payload?.email,
      subject: `Hello ${payload?.fullName}`,
      html: `code for Reset password: <h1>${verifiCode}<h1/>`,
    });
  }
}
