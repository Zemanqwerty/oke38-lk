import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tbluserrole'
})
export class UserRoles {
  @PrimaryGeneratedColumn()
  id_userrole: number;

  @Column({
    nullable: true
  })
  caption_userrole: string;

  @OneToMany(() => Users, (user) => user.id_userrole, {cascade: true})
  users: Users[]
}