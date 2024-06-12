import { PartialType } from '@nestjs/swagger';
import { CreateProductAttributeDto } from './create-product-atrribute.dto';

export class UpdateProductAtrributeDto extends PartialType(
  CreateProductAttributeDto,
) {}
