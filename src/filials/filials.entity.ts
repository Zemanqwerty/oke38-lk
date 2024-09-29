import { Predstavitel } from 'src/docsFiles/predstavitel.entity';
import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tblfilial'
})
export class Filials {
  @PrimaryGeneratedColumn()
  id_filial: number;

  @Column({
    nullable: true
  })
  caption_filial!: string | null;

  @Column({
    nullable: true
  })
  caption_filial_short!: string | null;

  @OneToMany(() => Users, (user) => user.id_filial, {cascade: true})
  users: Users[]

  @OneToMany(() => Applications, (application) => application.filial, {cascade: true})
  applications: Applications[]
}