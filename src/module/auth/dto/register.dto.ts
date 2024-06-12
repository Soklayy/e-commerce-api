import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsSameAs } from 'src/commons/validations/is-same-as.validation';
import { IsUnique } from 'src/commons/validations/is-unigue.validation';
import { User } from 'src/module/user/entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    required: true,
    example: 'Jhon',
  })
  @IsNotEmpty()
  @MinLength(3)
  firstname: string;

  @ApiProperty({
    required: true,
    example: 'Doo',
  })
  @IsNotEmpty()
  @MinLength(3)
  lastname: string;

  @ApiProperty({
    required: true,
    example: 'spiderman@email.com',
  })
  @IsEmail()
  @IsUnique([User], { message: 'User with this email already existed!' })
  email: string;

  @ApiProperty({
    required: true,
    example: '12345678',
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
    example: '12345678',
  })
  @IsSameAs('password')
  confirmPassword: string;
}
