import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductAttribute } from './product-attribute.entity';
import { File } from 'src/module/file/entities/file.entity';
import { CartItem } from 'src/module/cart/entities/cart-item.entity';

@Entity('products_skus')
export class ProductSku extends AbstractEntity {
  @Column({ nullable: false, unique: true })
  sku: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'float', default: 0 ,})
  discount: number;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.productSku, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductAttribute, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'size_attribute_id' })
  size: ProductAttribute;

  @ManyToOne(() => ProductAttribute, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'color_attribute_id' })
  color: ProductAttribute;

  @OneToOne(() => File, { onDelete: 'SET NULL' })
  @JoinColumn()
  image: File;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productSku)
  cartItem: CartItem[];
}
