import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
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
  })
  caption_zayavkastatus: string;

  @Column({
    name: 'id_zayavkastatus_1c',
    type: 'bytea'
  })
  id_zayavkastatus_1c: Buffer;

  @OneToMany(() => Applications, (application) => application.status, {cascade: true})
  applications: Applications[]
}