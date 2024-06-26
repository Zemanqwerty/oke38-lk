import { ApplicationTypes } from 'src/application-type/application-type.entity';
import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tblusertype'
})
export class UserTypes {
  @PrimaryGeneratedColumn()
  id_usertype: number;

  @Column()
  caption_usertype: string;

  @OneToMany(() => Users, (user) => user.id_usertype, {cascade: true})
  users: Users[]

  @OneToMany(() => ApplicationTypes, (applicationTypes) => applicationTypes.id_usertype, {cascade: true})
  applicationTypes: ApplicationTypes[]
}