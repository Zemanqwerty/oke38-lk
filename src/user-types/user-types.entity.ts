import { ApplicationTypes } from '../application-type/application-type.entity';
import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tblusertype'
})
export class UserTypes {
  @PrimaryGeneratedColumn()
  id_usertype: number;

  @Column({
    nullable: true
  })
  caption_usertype: string;

  @OneToMany(() => Users, (user) => user.id_usertype, {cascade: true})
  users: Users[]

  @OneToMany(() => ApplicationTypes, (applicationTypes) => applicationTypes.id_usertype, {cascade: true})
  applicationTypes: ApplicationTypes[]
}