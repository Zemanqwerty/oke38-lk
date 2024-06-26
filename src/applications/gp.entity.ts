import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'tblgp'
})
export class Gp {
  @PrimaryGeneratedColumn('uuid')
  id_gp: string;

  @Column()
  caption_gp: string;

  @OneToMany(() => Applications, (application) => application.provider, {cascade: true})
  applications: Applications[]
}