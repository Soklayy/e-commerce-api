import { ApiProperty, PartialType } from '@nestjs/swagger';

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
  categoryId: string;

  @ApiProperty({
    required: true,
    example: '5be37837-5400-422f-89f6-bf42097ea626',
    type: 'string',
  })
  brandId: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary', isArray: true })
  images: string[];
}

export class UpdateProductSchema extends PartialType(CreateProductSchema) { }

