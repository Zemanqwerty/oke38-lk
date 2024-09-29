import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'tbl1c_vidrassrochki'
})
export class VidRassrochki {
  @PrimaryColumn({ type: 'bytea', generated: 'uuid', name: '_idrref' })
  idrref: Buffer;

  @Column({
    name: '_enumorder',
    type: 'numeric',
    precision: 10,
    scale: 3
  })
  enumorder: number;

  @Column({
    nullable: true
  })
  caption_short: string;

  @Column({
    nullable: true
  })
  caption_long: string;

  @OneToMany(() => Applications, (application) => application.paymentsOption, {cascade: true})
  applications: Applications[]
}