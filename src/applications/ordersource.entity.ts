import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'tblordersource'
})
export class OrderSource {
  @PrimaryColumn({
    type: 'uuid',
    name: 'id_ordersource'
  })
  id_ordersource: string;

  @Column({
    name: 'caption_ordersource',
    nullable: true
  })
  caption_ordersource: string;

  @Column({
    name: 'caption_ordersource_short',
    nullable: true
  })
  caption_ordersource_short: string;

  @OneToMany(() => Applications, (application) => application.id_ordersource, {cascade: true})
  applications: Applications[];
}