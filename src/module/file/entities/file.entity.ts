import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('files')
export class File extends AbstractEntity {
  @Column()
  path: string;

  @Column()
  url: string;
}
