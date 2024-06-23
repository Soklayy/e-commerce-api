import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { File } from 'src/module/file/entities/file.entity';
import { Brand } from 'src/module/brand/entities/brand.entity';
import { Category } from 'src/module/category/entities/category.entity';
import { Exclude } from 'class-transformer';
import { ProductOption } from 'src/module/product-option/entities/product-option.entity';

@Entity('products')
export class Product extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({
    type: 'decimal', default: 0, precision: 10, scale: 2, transformer: {
      to: (value) => value,
      from: (value) => Number(value),
    },
  })
  price: number;

  @Column({
    type: 'decimal',
    default: 0,
    precision: 5,
    scale: 4,
    transformer: {
      to: (value) => value,
      from: (value) => Number(value),
    },
  })
  discount: number;

  @Column({ type: 'json' })
  images: Partial<File>[];

  @ManyToOne(() => Category, (category) => category.product, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.product, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ default: 0, type: 'int' })
  quantity: number

  @OneToMany(() => ProductOption, (option) => option.product)
  option: ProductOption[];

  @AfterLoad()
  afterLoad() {
    this.images = this.images?.length > 0 ? this.images : []
  }
}
