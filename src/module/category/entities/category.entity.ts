import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { File } from 'src/module/file/entities/file.entity';
import { Product } from 'src/module/product/entities/product.entity';
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('categories')
export class Category extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];

  @Exclude()
  @OneToOne(() => File, { onDelete: 'SET NULL' })
  @JoinColumn()
  cover: File;

  coverUrl: string;

  @AfterLoad()
  afterload() {
    this.coverUrl = this.cover ? this.cover.url : null;
  }
}
