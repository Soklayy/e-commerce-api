import { IsBoolean, IsNumber, IsOptional, Length } from 'class-validator';
import { IsExists } from 'src/commons/validations';

export class CreateProductOptionDto {
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsBoolean()
  available: boolean;

  @IsNumber()
  priceIncrement: number;
}
