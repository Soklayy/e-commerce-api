import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { Gender } from 'src/commons/enums/gender.enum';

export class UpdateUserOwnManagementDto {
  @ApiProperty({
    required: false,
    example: 'Jhon',
  })
  @IsOptional()
  @MinLength(3)
  firstname: string;

  @ApiProperty({
    required: false,
    example: 'Doo',
  })
  @IsOptional()
  @MinLength(3)
  lastname: string;

  @ApiProperty({
    required: false,
    example: '2024-02-01',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dateOfbirth: Date;

  @ApiProperty({
    required: false,
    example: Gender.MALE,
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    required: false,
    type: String,
    format: 'binary',
  })
  profileImage: string;
}
