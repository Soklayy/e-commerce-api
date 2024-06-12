import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Category } from 'src/module/category/entities/category.entity';

export class CreateProductSchema {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: false })
  summary: string;

  @ApiProperty({
    required: true,
    example: '5be37837-5400-422f-89f6-bf42097ea626',
    type: 'string',
  })
  category: Category;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  cover: string;
}

export class UpdateProductSchema extends PartialType(CreateProductSchema) {}
