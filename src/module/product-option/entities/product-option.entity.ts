import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { Product } from 'src/module/product/entities/product.entity';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('product_options')
export class ProductOption extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ name: 'price_increment', type: 'decimal', precision: 10, scale: 2 })
  priceIncrement: number;

  @ManyToOne(() => Product, (product) => product.option, { onDelete: 'CASCADE' })
  product: Product;

  @AfterLoad()
  afterLoad() {
    if (this.priceIncrement) this.priceIncrement = Number(this.priceIncrement);
  }
}
