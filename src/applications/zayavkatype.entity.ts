import { UserTypes } from "../user-types/user-types.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Applications } from "./applications.entity";

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