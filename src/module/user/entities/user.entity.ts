import { genSaltSync, hashSync } from 'bcrypt';
import { Role } from 'src/commons/enums/role.enum';
import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { LogginProvider } from 'src/commons/enums/loggin.enum';
import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { File } from 'src/module/file/entities/file.entity';
import { Address } from 'src/module/user-own-management/entities/address.entity';
import { Gender } from 'src/commons/enums/gender.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({
    nullable: true,
    transformer: {
      to: (value) => (value ? hashSync(value, genSaltSync(10, 'b')) : null),
      from: (value) => value,
    },
  })
  password: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  dateOfbirth: Date;

  @Exclude()
  @JoinColumn({ name: 'file_id' })
  @OneToOne(() => File, { eager: true, cascade: true, onDelete: 'SET NULL' })
  profileImage: File;

  @Column({ default: Role.USER, type: 'enum', enum: Role })
  role: Role;

  @Column({
    type: 'enum',
    enum: LogginProvider,
    default: LogginProvider.DEFAULT,
    name: 'loggin_provider',
  })
  logginProvider: LogginProvider;

  @Column({
    nullable: true,
  })
  refreshToken?: string;

  @OneToOne(() => Address, (address) => address.user)
  address: Address;

  profileImageUrl: string;

  @AfterLoad()
  afterLoad() {
    this?.profileImage
      ? (this.profileImageUrl = this.profileImage.url)
      : (this.profileImageUrl = null);
  }
}
