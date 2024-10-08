import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { UserTypes } from '../user-types/user-types.entity';
import { Users } from '../users/users.entity';
import { JoinColumn, ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tblzayavkatype'
})
export class ApplicationTypes {
  @PrimaryGeneratedColumn()
  id_zayavkatype: number;

  @Column({
    nullable: true
  })
  caption_zayavkatype: string;
  
  @Column({
    nullable: true
  })
  caption_zayavkatype_short: string;

  @ManyToOne(() => UserTypes, (userType) => userType.users)
  @JoinColumn({ name: 'id_usertype' })
  id_usertype: UserTypes

  @OneToMany(() => Applications, (application) => application.id_zayavkatype, {cascade: true})
  applications: Applications[]
}