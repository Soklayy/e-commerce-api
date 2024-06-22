import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';
import { IsUnique } from 'src/commons/validations';
import { Brand } from '../entities/brand.entity';

export class CreateBrandDto {
  @Length(3, 255)
  @IsUnique([Brand], { message: 'Can not use this name' })
  name: string;

  @IsOptional()
  @MaxLength(255)
  description: string;
}
