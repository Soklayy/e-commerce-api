import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('address')
export class Address extends AbstractEntity {
  @OneToOne(() => User, (user) => user.address, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, name: 'address_line' })
  addressLine: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude:string;

}
