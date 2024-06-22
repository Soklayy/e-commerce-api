import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsUnique } from 'src/commons/validations';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUnique([Category], { message: 'Use another name' })
  name: string;

  @IsOptional()
  @Length(0, 255)
  description: string;
}
