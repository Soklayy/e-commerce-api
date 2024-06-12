import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsSameAs } from 'src/commons/validations/is-same-as.validation';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    example: 'helloworld@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'sdf23t2n',
  })
  @IsNotEmpty()
  verificationCode: string;

  @ApiProperty({
    required: true,
    example: '12345678',
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    required: true,
    example: '12345678',
  })
  @IsSameAs('password')
  confirmPassword: string;
}
