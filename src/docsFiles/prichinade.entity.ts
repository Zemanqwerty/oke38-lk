import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { Documents } from './documents.entity';
import { DogovorEnergo } from './dogovorenergo.entity';

@Entity({
  name: 'tblgp_prichinade'
})
export class PrichinaDE {
  @PrimaryColumn({
    name: 'id_prichinade',
    type: 'uuid',
  })
  id_prichinade: string;

  @Column({
    name: 'caption_prichinade',
    nullable: true
  })
  caption_prichinade: string;

  @OneToMany(() => Documents, (documents) => documents.doctype, {cascade: true})
  documents: Documents[];

  @OneToMany(() => DogovorEnergo, (dogovorEnergo) => dogovorEnergo.id_prichinade, {cascade: true})
  dogovorenergo: DogovorEnergo[];
}