import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { Documents } from './documents.entity';
import { Filials } from '../filials/filials.entity';
import { Applications } from '../applications/applications.entity';
import { Predstavitel } from './predstavitel.entity';
import { PrichinaDE } from './prichinade.entity';
import { Gp } from '../applications/gp.entity';

@Entity({
  name: 'tblgp_dogovorenergo'
})
export class DogovorEnergo {
  @PrimaryColumn({
    name: 'id_dogovorenergo',
    type: 'uuid',
  })
  id_dogovorenergo: string;

  @Column({
    name: 'name_predstavitel',
    nullable: true
  })
  name_predstavitel: string;

  @ManyToOne(() => Applications, (application) => application.dogovorenergo)
  @JoinColumn({name: 'id_zayavka'})
  id_zayavka: Applications;

  @ManyToOne(() => Predstavitel, (predstavitel) => predstavitel.dogovorenergo)
  @JoinColumn({name: 'id_gp_predstavitel'})
  id_gp_predstavitel: Predstavitel;

  @ManyToOne(() => Gp, (gp) => gp.dogovorenergo)
  @JoinColumn({name: 'id_gp'})
  id_gp: Gp;

  @Column({
    name: 'id_gp_filial'
  })
  id_gp_filial: string;

  @ManyToOne(() => PrichinaDE, (prichina) => prichina.dogovorenergo)
  @JoinColumn({name: 'id_prichinade'})
  id_prichinade: PrichinaDE;

  @Column({
    name: 'nomer_ls',
    nullable: true
  })
  nomer_ls: string;

  @Column({
    name: 'nomer_dogovorenergo',
    nullable: true
  })
  nomer_dogovorenergo: string;

  @Column({
    name: 'nomer_elektroustanovka',
    nullable: true
  })
  nomer_elektroustanovka: string;

  @Column({
    name: 'date_create_de',
    type: 'timestamp'
  })
  date_create_de: Date;

  @Column({
    name: 'date_podpis_de',
    type: 'timestamp'
  })
  date_podpis_de: Date;

  @Column({
    name: 'id_cenovayakategoriya',
    type: 'bytea'
  })
  id_cenovayakategoriya: Buffer;
}