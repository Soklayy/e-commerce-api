import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { PaymentStatus } from 'src/commons/enums';
import { CartItems } from 'src/module/cart/entities/cart-items.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('orders')
export class Order extends AbstractEntity {
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'json',
  })
  item: CartItems[];

  @Column({ name: 'tran_id', unique: true })
  tranId: string;

  @Column({ name: 'payment_status', type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ name: 'shipping', type: 'boolean', default: false })
  shippingStatus: boolean;

  @Column({ type: 'float' })
  total: number;
}
