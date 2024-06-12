import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart extends AbstractEntity {
  @OneToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'float', nullable: true, default: 0 })
  total: number;

  @OneToMany(() => CartItem, (item) => item.cart)
  cartItem: CartItem[];
}
