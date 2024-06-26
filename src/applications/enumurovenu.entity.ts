import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'tbl1c_enumurovenu'
})
export class EnumUrovenU {
  @PrimaryColumn({ type: 'bytea', generated: 'uuid', name: '_idrref' })
  idrref: Buffer;

  @Column({
    name: '_enumorder',
    type: 'numeric',
    precision: 10,
    scale: 3
  })
  enumorder: number;

  @Column()
  caption_short: string;

  @Column()
  caption_long: string;

  @OneToMany(() => Applications, (application) => application.powerLevel, {cascade: true})
  applications: Applications[]
}