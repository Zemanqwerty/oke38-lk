import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'tblprichinapodachiz'
})
export class PrichinaPodachi {
  @PrimaryGeneratedColumn('uuid')
  id_prichinapodachiz: string;

  @Column({
    nullable: true
  })
  caption_short: string;

  @Column({
    nullable: true
  })
  caption_long: string;

  @OneToMany(() => Applications, (application) => application.reason, {cascade: true})
  applications: Applications[]
}