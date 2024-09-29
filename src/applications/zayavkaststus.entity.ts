import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: 'tblzayavkastatus'
})
export class ZayavkaStatus {
  @PrimaryGeneratedColumn({
    name: 'id_zayavkastatus'
  })
  id_zayavkastatus: number;

  @Column({
    name: 'caption_zayavkastatus',
    nullable: true
  })
  caption_zayavkastatus: string;

  @Column({
    name: 'id_zayavkastatus_1c',
    type: 'bytea',
    nullable: true
  })
  id_zayavkastatus_1c: Buffer;

  @OneToMany(() => Applications, (application) => application.status, {cascade: true})
  applications: Applications[]
}