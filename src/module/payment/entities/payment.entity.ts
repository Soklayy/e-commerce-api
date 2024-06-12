import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { PaymentStatus } from 'src/commons/enums/payment-status.enum';
import { Order } from 'src/module/order/entities/order.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('payments')
export class Payment extends AbstractEntity {
  @OneToOne(() => Order, (order) => order, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  method: string;
}
