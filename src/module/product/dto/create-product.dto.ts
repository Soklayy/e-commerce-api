import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsExists } from 'src/commons/validations/is-exists.validattion';
import { Category } from 'src/module/category/entities/category.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  summary: string;

  @IsNotEmpty()
  @IsExists([Category, (argu) => Object({ id: argu.value })], {
    message: 'Category is not exist',
  })
  category: Category;
}
