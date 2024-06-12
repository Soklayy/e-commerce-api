import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { Product } from 'src/module/product/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('categories')
export class Category extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
