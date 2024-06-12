import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { ProductAttributeType } from 'src/commons/enums/product-attribute-type.enum';
import { Column, Entity } from 'typeorm';

@Entity('product_attributes')
export class ProductAttribute extends AbstractEntity {
  @Column({ type: 'enum', enum: ProductAttributeType })
  type: ProductAttributeType;

  @Column()
  value: string;
}
