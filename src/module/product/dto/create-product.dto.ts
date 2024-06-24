import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsExists } from 'src/commons/validations';
import { Brand } from 'src/module/brand/entities/brand.entity';
import { Category } from 'src/module/category/entities/category.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  summary: string;

  @IsOptional()
  price: number;

  @IsOptional()
  discount: number;

  @IsOptional()
  quantity: number;

  @IsOptional()
  @IsNotEmpty()
  @IsExists([Category, ({ value }) => Object({ id: value })], {
    message: 'Category is not exist',
  })
  categoryId: string;

  @IsNotEmpty()
  @IsExists([Brand, ({ value }) => Object({ id: value })], {
    message: 'Category is not exist',
  })
  brandId: string;
}
