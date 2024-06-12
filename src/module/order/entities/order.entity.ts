import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('orders')
export class Order extends AbstractEntity {
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'float' })
  total: number;
}
