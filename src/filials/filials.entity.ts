import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tblfilial'
})
export class Filials {
  @PrimaryGeneratedColumn()
  id_filial: number;

  @Column()
  caption_filial: string;

  @Column()
  caption_filial_short: string;

  @OneToMany(() => Users, (user) => user.id_filial, {cascade: true})
  users: Users[]

  @OneToMany(() => Applications, (application) => application.filial, {cascade: true})
  applications: Applications[]
}