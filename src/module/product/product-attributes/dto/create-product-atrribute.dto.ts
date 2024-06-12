import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductAttributeType } from 'src/commons/enums/product-attribute-type.enum';

export class CreateProductAttributeDto {
  @IsEnum(ProductAttributeType)
  type: ProductAttributeType;

  @IsNotEmpty()
  @ApiProperty({ example: 'red' })
  value: string;
}
