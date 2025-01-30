import { Files } from '../files/Files.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationTypes } from '../application-type/application-type.entity';
import { Filials } from '../filials/filials.entity';
import { stat } from 'fs';
import { Applications } from '../applications/applications.entity';
import { Doctype } from './doctype.entity';
import { ContractSatatus } from './contractstatus.entity';
import { ContractDoc } from './contractdoc.entity';
import { Documents } from './documents.entity';

@Entity({
  name: 'tblcontract'
})
export class Contract {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_contract'
  })
  id_contractdoc: string;

  @ManyToOne(() => Applications, (application) => application.contract, {nullable: true})
  @JoinColumn({name: 'id_zayavka'})
  id_zayavka: Applications;

  @Column({
    name: 'contract_number_1c',
    nullable: true
  })
  contract_number_1c: string;

  @Column({
    name: 'contract_date_1c',
    type: 'timestamp',
    nullable: true
  })
  contract_date_1c: Date;

  @ManyToOne(() => ContractSatatus, (contractStatus) => contractStatus.contract, {nullable: true})
  @JoinColumn({name: 'id_contractstatus'})
  id_contractstatus: ContractSatatus;

  @OneToMany(() => ContractDoc, (contractDoc) => contractDoc.id_contract, {cascade: true})
  contractDoc: ContractDoc[];

  @OneToMany(() => Documents, (docs) => docs.id_contract, {cascade: true})
  documents: Documents[];
}