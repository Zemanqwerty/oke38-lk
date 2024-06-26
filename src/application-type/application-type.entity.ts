import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { UserTypes } from 'src/user-types/user-types.entity';
import { Users } from 'src/users/users.entity';
import { JoinColumn, ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tblzayavkatype'
})
export class ApplicationTypes {
  @PrimaryGeneratedColumn()
  id_zayavkatype: number;

  @Column()
  caption_zayavkatype: string;
  
  @Column()
  caption_zayavkatype_short: string;

  @ManyToOne(() => UserTypes, (userType) => userType.users)
  @JoinColumn({ name: 'id_usertype' })
  id_usertype: UserTypes

  @OneToMany(() => Applications, (application) => application.id_zayavkatype, {cascade: true})
  applications: Applications[]
}