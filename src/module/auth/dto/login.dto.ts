import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsExists } from 'src/commons/validations';
import { User } from 'src/module/user/entities/user.entity';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'ecomerce@api.com',
  })
  @IsEmail()
  @IsExists([User], { message: `User with this email doesn't exist!` })
  email: string;

  @ApiProperty({
    required: true,
    example: 'adminpassword',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
