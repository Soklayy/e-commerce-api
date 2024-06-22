import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItems } from './cart-items.entity';

@Entity('cartss')
export class Carts extends AbstractEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', nullable: true, default: 0, precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => CartItems, (item) => item.cart)
  cartItem: CartItems[];
}