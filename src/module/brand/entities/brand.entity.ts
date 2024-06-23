import {
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
  Entity,
  AfterLoad,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { File } from 'src/module/file/entities/file.entity';
import { Product } from 'src/module/product/entities/product.entity';

@Entity('brands')
export class Brand extends AbstractEntity {
  @Column({ })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Exclude()
  @OneToOne(() => File, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'logo_id' })
  logo: File;

  @OneToMany(() => Product, (product) => product)
  product: Product[];

  logoUrl: string;

  @AfterLoad()
  afterload() {
    this.logoUrl = this.logo ? this.logo.url : null;
  }
}
