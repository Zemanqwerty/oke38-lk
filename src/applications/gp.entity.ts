import { GpFilial } from '../docsFiles/gpFilial.entity';
import { Applications } from '../applications/applications.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { DogovorEnergo } from '../docsFiles/dogovorenergo.entity';

@Entity({
    name: 'tblgp'
})
export class Gp {
  @PrimaryGeneratedColumn('uuid')
  id_gp: string;

  @Column({
    nullable: false
  })
  caption_gp: string;

  @OneToMany(() => Applications, (application) => application.provider, {cascade: true})
  applications: Applications[]

  @OneToMany(() => GpFilial, (gpFilial) => gpFilial.id_gp, {cascade: true})
  gpFilial: GpFilial[]

  @OneToMany(() => DogovorEnergo, (dogovorEnergo) => dogovorEnergo.id_gp, {cascade: true})
  dogovorenergo: DogovorEnergo[]
}