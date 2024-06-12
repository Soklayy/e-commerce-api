import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { Category } from 'src/module/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ProductSku } from './product-sku.entity';
import { File } from 'src/module/file/entities/file.entity';

@Entity('products')
export class Product extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'text', default: null })
  summary: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @OneToOne(() => File, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cover' })
  cover: File;

  @ManyToOne(() => Category, (category) => category.product, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductSku, (productSku) => productSku.product)
  productSku: ProductSku[];
}
