import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCategorySchema {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  cover: string;
}

export class UpdateCategorySchema extends PartialType(CreateCategorySchema) {}

export class AddSubCategorySchema {
  @ApiProperty()
  brand: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  logo: string;
}
