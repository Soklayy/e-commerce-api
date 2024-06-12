import { IsExists } from 'src/commons/validations/is-exists.validattion';
import { ProductAttribute } from '../../entities/product-attribute.entity';
import { Product } from '../../entities/product.entity';
import { ProductAttributeType } from 'src/commons/enums/product-attribute-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { isPercentage } from 'src/commons/validations/is-percentage.validattion';

export class CreateProductSkuDto {
  @ApiProperty({
    type: Number,
    example: '100',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    type: Number,
    description:'Range from 0 to 1',
    example: '0.1',
  })
  @isPercentage()
  @Transform(({ value }) => Number(value))
  discount: number;

  @ApiProperty({
    type: Number,
    example: '100',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  quantity: number;

  @ApiProperty({
    type: String,
    example: 'beed0391-677b-454f-94ae-edc651097541',
  })
  @IsExists([Product, (arg) => Object({ id: arg.value })])
  product: Product;

  @ApiProperty({
    type: String,
    example: 'beed0391-677b-454f-94ae-edc651097548',
  })
  @IsExists([
    ProductAttribute,
    (arg) => Object({ id: arg.value, type: ProductAttributeType.SIZE }),
  ])
  size: ProductAttribute;

  @ApiProperty({
    type: String,
    example: 'beed0391-677b-454f-94ae-edc651097548',
  })
  @IsExists([
    ProductAttribute,
    (arg) => Object({ id: arg.value, type: ProductAttributeType.COLOR }),
  ])
  color: ProductAttribute;
}
