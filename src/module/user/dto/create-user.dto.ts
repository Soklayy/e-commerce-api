import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/commons/validations/is-unigue.validation';
import { User } from '../entities/user.entity';
import { Role } from 'src/commons/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
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
  @IsUnique([User], { message: 'This email is already exist' })
  email: string;

  @ApiProperty({
    required: false,
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  dateOfbirth: Date;

  @ApiProperty({
    required: true,
    example: '12345678',
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
