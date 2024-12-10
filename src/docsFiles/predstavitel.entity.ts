import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { Documents } from './documents.entity';
import { Filials } from '../filials/filials.entity';
import { DogovorEnergo } from './dogovorenergo.entity';

@Entity({
  name: 'tblgp_predstavitel'
})
export class Predstavitel {
  @PrimaryColumn({
    name: 'id_gp_predstavitel',
    type: 'uuid',
  })
  id_gp_predstavitel: string;

  @Column({
    name: 'name_predstavitel',
    nullable: true
  })
  name_predstavitel: string;

  @Column({
    name: 'id_gp_filial',
    nullable: true
  })
  id_gp_filial: string;

  @Column({
    name: 'id_gp',
    nullable: true
  })
  id_gp: string;

  @Column({
    name: 'id_user',
    nullable: true
  })
  id_suer: string;

  @OneToMany(() => Documents, (documents) => documents.doctype, {cascade: true})
  documents: Documents[];

  @OneToMany(() => DogovorEnergo, (dogovorEnergo) => dogovorEnergo.id_gp_predstavitel, {cascade: true})
  dogovorenergo: DogovorEnergo[];
}