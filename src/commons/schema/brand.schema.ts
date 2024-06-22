import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBrandSchema {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  logo: string;
}

export class UpdateBrandSchema extends PartialType(CreateBrandSchema) {}
