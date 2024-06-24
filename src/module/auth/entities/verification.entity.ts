import { AbstractEntity } from "src/commons/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity('verification')
export class Verification extends AbstractEntity {
    @Column()
    code: string;

    @Column()
    email: string;

    @Column({ type: 'boolean', default: false })
    done: boolean;

    @Column({ type: 'text' })
    token: string;
}