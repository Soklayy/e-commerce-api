import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'forgot-password-tokens',
})
export class ForgotEntity extends AbstractEntity {
  /**
   * Email colum
   */
  @Column({ type: 'text' })
  email: string;

  /**
   * Token for storing 2nd verification
   */
  @Column({ type: 'text' })
  token: string;

  /**
   * If the reset is done
   */
  @Column({ type: 'boolean', default: false })
  done: boolean;

  @Column({ name: 'verification_code' })
  verificationCode: string;
}
